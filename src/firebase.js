import {initializeApp} from "firebase/app"
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

  const firebaseConfig = {
    apiKey: "AIzaSyCzEb50w3aNsip90IFtcu15DR9ZlG5os18",
    authDomain: "database-383cb.firebaseapp.com",
    projectId: "database-383cb",
    storageBucket: "database-383cb.appspot.com",
    messagingSenderId: "994833052344",
    appId: "1:994833052344:web:076171bfd76a13c1f53a4d"
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase();
const firestore = getFirestore();
const auth = getAuth(app);

export { auth, database, firestore}

