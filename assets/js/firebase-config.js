import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAGVoqQlSR15zRCrlJqYsvz7b2FVOO8Kog",
    authDomain: "project-1-ee121.firebaseapp.com",
    projectId: "project-1-ee121",
    storageBucket: "project-1-ee121.firebasestorage.app",
    messagingSenderId: "737534293699",
    appId: "1:737534293699:web:7a5d1c89e7406b0f1e5476"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, firebaseConfig };