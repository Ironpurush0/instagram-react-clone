import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyBoxtRcvBWCMfjHmPqXWbEJSW62G0Lq_-4",
    authDomain: "instagram-clone-react-370ba.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-370ba.firebaseio.com",
    projectId: "instagram-clone-react-370ba",
    storageBucket: "instagram-clone-react-370ba.appspot.com",
    messagingSenderId: "337341151354",
    appId: "1:337341151354:web:262a53388c2600aec2a3c3",
    measurementId: "G-3HDX3EVH54"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()

const auth = firebase.auth()

const storage = firebase.storage()

export {db, auth, storage}
