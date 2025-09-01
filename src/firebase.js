import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGVoqQlSR15zRCrlJqYsvz7b2FVOO8Kog",
  authDomain: "project-1-ee121.firebaseapp.com",
  projectId: "project-1-ee121",
  storageBucket: "project-1-ee121.firebasestorage.app",
  messagingSenderId: "737534293699",
  appId: "1:737534293699:web:7a5d1c89e7406b0f1e5476",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
