const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const getOperationType = (prevStatus, nextStatus) => {
  switch (true) {
    case prevStatus === "new" && nextStatus === "closed":
      return "fialization";
    case prevStatus === "closed" && nextStatus === "canceled":
      return "rollback";
    case prevStatus === "new" && nextStatus === "canceled":
      return "cancelation";
  }
};

const getOperationSign = operationType => {
  switch (operationType) {
    case "fialization":
      return 1;
    case "rollback":
      return -1;
    default:
      return 0;
  }
};

const storeBalanceHistory = (
  balanceRef,
  orderId,
  orderOwnerId,
  orderClientId,
  amount,
  comment
) => {
  balanceRef
    .doc(orderClientId)
    .collection("history")
    .add({
      orderId: orderId,
      userId: orderOwnerId,
      amount: -1 * amount,
      comment: comment
    });

  balanceRef
    .doc(orderOwnerId)
    .collection("history")
    .add({
      orderId: orderId,
      userId: orderClientId,
      amount: amount,
      comment: comment
    });
};

exports.storeBalanceHistory = functions.firestore
  .document("/orders/{orderId}")
  .onUpdate((change, context) => {
    const beforeOrderData = change.before.data();
    const orderData = change.after.data();
    const operationType = getOperationType(
      beforeOrderData.status,
      orderData.status
    );

    if (operationType === "fialization" || operationType === "rollback") {
      const itemsRef = change.after.ref.collection("items");
      const balanceRef = admin.firestore().collection("balance");
      const operationSign = getOperationSign(operationType);

      return itemsRef.get().then(querySnapshot => {
        const itemsCount = querySnapshot.size;
        const uniqueUsersMap = {};

        querySnapshot.forEach(item => {
          const itemData = item.data();

          uniqueUsersMap[itemData.userId] = true;

          storeBalanceHistory(
            balanceRef,
            context.params.orderId,
            orderData.userId,
            itemData.userId,
            operationSign * itemData.price,
            orderData.name + ": " + itemData.name
          );
        });

        const uniqueUsers = Object.keys(uniqueUsersMap);
        const deliveryPricePerItem = orderData.price / uniqueUsers.length;

        uniqueUsers.forEach(userId => {
          storeBalanceHistory(
            balanceRef,
            context.params.orderId,
            orderData.userId,
            userId,
            operationSign * deliveryPricePerItem,
            "Dostawa z: " + orderData.name
          );
        });
      });
    }

    return null;
  });

exports.calculateBalance = functions.firestore
  .document("/balance/{userId}/history/{historyId}")
  .onWrite((change, context) => {
    const userBalanceRef = admin
      .firestore()
      .collection("balance")
      .doc(context.params.userId);
    const userBalanceAmountsRef = userBalanceRef.collection("amounts");
    const userBalanceHistoryRef = userBalanceRef.collection("history");

    return userBalanceHistoryRef.get().then(querySnapshot => {
      const balance = {};
      querySnapshot.forEach(doc => {
        const historyRecord = doc.data();
        balance[historyRecord.userId] =
          (parseFloat(balance[historyRecord.userId]) || 0) +
          parseFloat(historyRecord.amount);
      });

      Object.keys(balance).forEach(userId => {
        userBalanceAmountsRef.doc(userId).set({
          amount: balance[userId]
        });
      });
    });
  });

exports.createProfile = functions.auth.user().onCreate(user => {
  return admin
    .firestore()
    .collection("userProfile")
    .doc(user.uid)
    .set({
      email: user.email,
      displayName: user.displayName,
      photoUrl: user.photoURL
    });
});
