document.querySelectorAll(".button, .social-button").forEach((button) => {
  button.addEventListener("mousedown", () => {
    button.style.transform = "scale(0.95)";
  });

  button.addEventListener("mouseup", () => {
    button.style.transform = "scale(1)";
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "scale(1)";
  });
});

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { firebaseConfig, db } from "./assets/js/firebase-config.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('auth-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userDoc = await getDoc(doc(db, "users", user.email));
    if (userDoc.exists()) {
      localStorage.setItem('userDetails', JSON.stringify(userDoc.data()));
    } else {
      await setDoc(doc(db, "users", user.email), {
        email: user.email,
        cart: [],
        favorites: [],
        address: "",
        phone: ""
      });
    }
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(user));
    alert('Login successful');
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed: ' + error.message);
  }
});

document.getElementById('google-signin').addEventListener('click', async function(event) {
  event.preventDefault();
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(user));
    alert('Google sign-in successful');
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Google sign-in error:', error);
    alert('Google sign-in failed: ' + error.message);
  }
});

document.getElementById('facebook-signin').addEventListener('click', async function(event) {
  event.preventDefault();
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(user));
    alert('Facebook sign-in successful');
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Facebook sign-in error:', error);
    alert('Facebook sign-in failed: ' + error.message);
  }
});

// Ensure the addToCart function is defined and used correctly
function addToCart(id, name, price, image) {
  const cartItem = { id, name, price: parseFloat(price), image, quantity: 1 };
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingItemIndex = cart.findIndex(item => item.id === id);
  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push(cartItem);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert('Item added to cart');
  window.location.href = 'cart.html';
}

// Ensure the updateCartCount function is defined and used correctly
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector('.header-action-btn[aria-label="cart"] .btn-badge').textContent = cartCount;
}

// Ensure the event listeners are correctly set up
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.add-to-cart-button').forEach(button => {
    button.addEventListener('click', function(event) {
      const id = event.target.getAttribute('data-id');
      const name = event.target.getAttribute('data-name');
      const price = event.target.getAttribute('data-price');
      const image = event.target.getAttribute('data-image');
      addToCart(id, name, price, image);
    });
  });
  updateCartCount();
});

document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('login-btn');
    loginBtn.classList.add('medium');
    // ...existing code...
});

function addToFavorites(id, name, price, image) {
    const favoriteItem = { id, name, price, image };
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.some(item => item.id === id)) {
        favorites.push(favoriteItem);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateWishlistCount();
        alert('Item added to favorites');

        // Update Firestore
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            const userRef = doc(db, "users", user.email);
            updateDoc(userRef, {
                favorites: arrayUnion(favoriteItem)
            });
        }
    } else {
        alert('Item is already in favorites');
    }
}

async function registerUser(email, password, phone, address) {
  const response = await fetch('/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, phone, address })
  });
  const data = await response.text();
  alert(data);
}

async function loginUser(email, password) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  const data = await response.text();
  if (response.ok) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify({ email }));
    alert('Login successful');
    window.location.href = 'index.html';
  } else {
    alert(data);
  }
}