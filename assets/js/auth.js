import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { firebaseConfig, db } from "./firebase-config.js";
import { doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function saveUserDetails(user) {
  try {
    await setDoc(doc(db, "users", user.email), user);
    console.log("User details saved successfully");
  } catch (error) {
    console.error("Error saving user details: ", error);
  }
}

async function fetchUserDetails(email) {
  try {
    const userDoc = await getDoc(doc(db, "users", email));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user details: ", error);
    return null;
  }
}

async function updateUserDetails(email, updatedDetails) {
  try {
    await updateDoc(doc(db, "users", email), updatedDetails);
    console.log("User details updated successfully");
  } catch (error) {
    console.error("Error updating user details: ", error);
  }
}

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, saveUserDetails, fetchUserDetails, updateUserDetails };