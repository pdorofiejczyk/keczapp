import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import config from "../config/prod.json";

firebase.initializeApp(config);

export default firebase;
