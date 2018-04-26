import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

const config = {
  apiKey: "AIzaSyDoVuSsj4bpZGbDCyFhCARDcIfZ6zpShrs",
  authDomain: "keczapp-b9eff.firebaseapp.com",
  databaseURL: "https://keczapp-b9eff.firebaseio.com",
  projectId: "keczapp-b9eff",
  storageBucket: "keczapp-b9eff.appspot.com",
  messagingSenderId: "224237714515"
};

firebase.initializeApp(config);

export default firebase;
