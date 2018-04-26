const admin = require("firebase-admin");
const serviceAccount = require("./keys/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://keczapp-b9eff.firebaseio.com"
});

exports.admin = admin;