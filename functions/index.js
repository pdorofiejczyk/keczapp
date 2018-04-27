const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.storeBalanceHistory = functions.firestore
  .document("/orders/{orderId}")
  .onUpdate((change, context) => {
    const orderData = change.after.data();

    if (orderData.status === "closed") {
      const itemsRef = change.after.ref.collection("items");
      const balanceRef = admin.firestore().collection("balance");

      return itemsRef.get().then(querySnapshot => {
        const itemsCount = querySnapshot.size;
        const uniqueUsersMap = {};

        querySnapshot.forEach(item => {
          const itemData = item.data();

          uniqueUsersMap[itemData.userId] = true;

          balanceRef
            .doc(itemData.userId)
            .collection("history")
            .add({
              orderId: context.params.orderId,
              userId: orderData.userId,
              amount: -1 * itemData.price,
              comment: orderData.name + ": " + itemData.name
            });

          balanceRef
            .doc(orderData.userId)
            .collection("history")
            .add({
              orderId: context.params.orderId,
              userId: itemData.userId,
              amount: itemData.price,
              comment: orderData.name + ": " + itemData.name
            });
        });

        const uniqueUsers = Object.keys(uniqueUsersMap);
        const deliveryPricePerItem = orderData.price / uniqueUsers.length;

        uniqueUsers.forEach(userId => {
          balanceRef
            .doc(userId)
            .collection("history")
            .add({
              orderId: context.params.orderId,
              userId: orderData.userId,
              amount: -1 * deliveryPricePerItem,
              comment: "Dostawa z: " + orderData.name
            });

          balanceRef
            .doc(orderData.userId)
            .collection("history")
            .add({
              orderId: context.params.orderId,
              userId: userId,
              amount: deliveryPricePerItem,
              comment: "Dostawa z: " + orderData.name
            });
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
