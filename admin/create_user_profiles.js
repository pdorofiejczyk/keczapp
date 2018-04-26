const admin = require("firebase-admin");
const serviceAccount = require("./keys/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://keczapp-b9eff.firebaseio.com"
});

const createUserProfiles = (nextPageToken) => {
	admin.auth().listUsers(1000, nextPageToken)
	.then(function(listUsersResult) {
	  listUsersResult.users.forEach(function(user) {
		  admin.firestore().collection("userProfile").doc(user.uid).set({
		    email: user.email,
		    displayName: user.displayName,
		    photoUrl: user.photoURL
		  });
	  });
	  if (listUsersResult.pageToken) {
	    // List next batch of users.
	    createUserProfiles(listUsersResult.pageToken)
	  }
	})
	.catch(function(error) {
	  console.log("Error listing users:", error);
	});
}

createUserProfiles();