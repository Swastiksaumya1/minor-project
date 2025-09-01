"use strict";

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { db } from "./firebase-config.js";

const auth = getAuth();

// Function to fetch user data from Firestore
async function fetchUserData(email) {
  try {
    const userRef = doc(db, "users", email);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.error("User data not found in Firestore.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

// Function to render user data on the dashboard
async function renderDashboard(user) {
  if (!user) {
    alert("You need to log in to access the dashboard.");
    window.location.href = "login.html";
    return;
  }

  const userData = await fetchUserData(user.email);
  if (userData) {
    document.getElementById("user-name").textContent = userData.name || user.email;
    document.getElementById("user-email").textContent = user.email;
    document.getElementById("user-phone").textContent = userData.phone || "N/A";
    document.getElementById("user-address").textContent = userData.address || "N/A";
  } else {
    document.getElementById("user-name").textContent = user.email;
    document.getElementById("user-email").textContent = user.email;
    document.getElementById("user-phone").textContent = "N/A";
    document.getElementById("user-address").textContent = "N/A";
  }
}

// Monitor authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    renderDashboard(user);
  } else {
    alert("You need to log in to access the dashboard.");
    window.location.href = "login.html";
  }
});

// Logout functionality
document.addEventListener("DOMContentLoaded", function () {
  const authBtn = document.getElementById("auth-btn");
  if (authBtn) {
    authBtn.addEventListener("click", function () {
      auth.signOut().then(() => {
        alert("Logged out successfully.");
        window.location.href = "login.html";
      }).catch((error) => {
        console.error("Error logging out:", error);
      });
    });
  }
});
