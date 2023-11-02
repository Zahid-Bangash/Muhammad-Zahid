import firebase from "firebase/compat/app";
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
    apiKey: "AIzaSyBywmGDQzdUswKlcPVpCpDWX-2dorIFwMw",
    authDomain: "finalyearproject-41594.firebaseapp.com",
    projectId: "finalyearproject-41594",
    storageBucket: "gs://finalyearproject-41594.appspot.com",
    messagingSenderId: "666098238346",
    appId: "1:666098238346:web:ebdbd4a4087b1d445c3e73"
  };
let app;
if (getApps.length < 1) {
  app = initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
