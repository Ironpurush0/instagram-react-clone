import firebase from "firebase";
import { FIREBASE_CONFIG } from "../config";

const firebaseConfig = FIREBASE_CONFIG;

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

const storage = firebase.storage();

export { db, auth, storage };
