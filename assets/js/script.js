"use strict";

/**
 * add event on element
 */
const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
};

async function fetchProducts() {
  const res = db.exec("SELECT * FROM products");
  return res[0].values;
}

async function fetchProductById(id) {
  try {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products.find((p) => p.id === id);

    if (!product) {
      console.error(`Product with id ${id} not found`);
      return null;
    }

    // Ensure image URL is absolute
    if (product.image && !product.image.startsWith("http")) {
      product.image = new URL(product.image, window.location.origin).href;
    }

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function addToCart(id, name, price, image) {
  const cartItem = { id, name, price: parseFloat(price), image, quantity: 1 };
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItemIndex = cart.findIndex((item) => item.id === id);
  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push(cartItem);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showPopup("Item added to cart");

  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    const userRef = doc(db, "users", user.email);
    await updateDoc(userRef, {
      cart: arrayUnion(cartItem),
    });
  }
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector(
    '.header-action-btn[aria-label="cart"] .btn-badge'
  ).textContent = cartCount;
}

async function addToFavorites(id, name, price, image) {
  const favoriteItem = { id, name, price, image };
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.some((item) => item.id === id)) {
    favorites.push(favoriteItem);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateWishlistCount();
    showPopup("Item added to favorites");

    // Update Firestore
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const userRef = doc(db, "users", user.email);
      await updateDoc(userRef, {
        favorites: arrayUnion(favoriteItem),
      });
    }
  } else {
    alert("Item is already in favorites");
  }
}

function removeFromFavorites(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter((item) => item.id !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateWishlistCount();
  showPopup("Item removed from favorites");
  renderFavorites();

  // Update Firestore
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    const userRef = doc(db, "users", user.email);
    updateDoc(userRef, {
      favorites: favorites,
    });
  }
}

function updateWishlistCount() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const wishlistCount = favorites.length;
  document.querySelector(
    '.header-action-btn[aria-label="favorite list"] .btn-badge'
  ).textContent = wishlistCount;
}

function showPopup(message) {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.classList.add("show");
  setTimeout(() => {
    popup.classList.remove("show");
  }, 3000);
}

function renderFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const favoritesContainer = document.getElementById("favorites-container");
  favoritesContainer.innerHTML = "";

  favorites.forEach((item) => {
    const favoriteItem = document.createElement("div");
    favoriteItem.classList.add("favorite-item");
    favoriteItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="favorite-details">
        <span class="favorite-name">${item.name}</span>
        <span class="favorite-price">₹${parseFloat(item.price).toFixed(
          2
        )}</span>
        <button class="remove-favorite" onclick="removeFromFavorites('${
          item.id
        }')">Remove</button>
      </div>
    `;
    favoritesContainer.appendChild(favoriteItem);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    updateCartCount();
    updateWishlistCount();
    renderFavorites();
  }

  // Store product data in localStorage
  const products = [
    {
      id: "product-1",
      name: "Animi Dolor Pariatur",
      price: "10.00",
      image: "./assets/images/product-1.jpg",
      description: "Description for Animi Dolor Pariatur",
    },
    {
      id: "product-2",
      name: "Art Deco Home",
      price: "30.00",
      image: "./assets/images/product-2.jpg",
      description: "Description for Art Deco Home",
    },
    {
      id: "product-3",
      name: "Artificial potted plant",
      price: "40.00",
      image: "./assets/images/product-3.jpg",
      description: "Description for Artificial potted plant",
    },
    {
      id: "product-4",
      name: "Dark Green Jug",
      price: "17.10",
      image: "./assets/images/product-4.jpg",
      description: "Description for Dark Green Jug",
    },
    {
      id: "product-5",
      name: "Drinking Glasses",
      price: "21.00",
      image: "./assets/images/product-5.jpg",
      description: "Description for Drinking Glasses",
    },
    {
      id: "product-6",
      name: "Helen Chair",
      price: "69.50",
      image: "./assets/images/product-6.jpg",
      description: "Description for Helen Chair",
    },
    {
      id: "product-7",
      name: "High Quality Glass Bottle",
      price: "30.10",
      image: "./assets/images/product-7.jpg",
      description: "Description for High Quality Glass Bottle",
    },
    {
      id: "product-8",
      name: "Living Room & Bedroom Lights",
      price: "45.00",
      image: "./assets/images/product-8.jpg",
      description: "Description for Living Room & Bedroom Lights",
    },
    {
      id: "product-9",
      name: "Nancy Chair",
      price: "90.00",
      image: "./assets/images/product-9.jpg",
      description: "Description for Nancy Chair",
    },
    {
      id: "product-10",
      name: "Simple Chair",
      price: "40.00",
      image: "./assets/images/product-10.jpg",
      description: "Description for Simple Chair",
    },
    {
      id: "product-11",
      name: "Smooth Disk",
      price: "46.00",
      image: "./assets/images/product-11.jpg",
      description: "Description for Smooth Disk",
    },
    {
      id: "product-12",
      name: "Table Black",
      price: "67.00",
      image: "./assets/images/product-12.jpg",
      description: "Description for Table Black",
    },
    {
      id: "product-13",
      name: "Table Wood Pine",
      price: "50.00",
      image: "./assets/images/product-13.jpg",
      description: "Description for Table Wood Pine",
    },
    {
      id: "product-14",
      name: "Teapot with black tea",
      price: "25.00",
      image: "./assets/images/product-14.jpg",
      description: "Description for Teapot with black tea",
    },
    {
      id: "product-15",
      name: "Unique Decoration",
      price: "15.00",
      image: "./assets/images/product-15.jpg",
      description: "Description for Unique Decoration",
    },
    {
      id: "product-16",
      name: "Vase Of Flowers",
      price: "77.00",
      image: "./assets/images/product-16.jpg",
      description: "Description for Vase Of Flowers",
    },
    {
      id: "product-17",
      name: "Wood Eggs",
      price: "19.00",
      image: "./assets/images/product-17.jpg",
      description: "Description for Wood Eggs",
    },
    {
      id: "product-18",
      name: "Wooden Box",
      price: "27.00",
      image: "./assets/images/product-18.jpg",
      description: "Description for Wooden Box",
    },
    {
      id: "product-19",
      name: "Wooden Cups",
      price: "29.00",
      image: "./assets/images/product-19.jpg",
      description: "Description for Wooden Cups",
    },
    {
      id: "product-Indian-Chair",
      name: "Indian-Chair",
      price: "2229.00",
      image: "./assets/images/new images/Indian-Chair-.webp",
      description: "Description for Indian-Chair",
    },
    {
      id: "product-berggrune",
      name: "berggrune",
      price: "2999.00",
      image: "./assets/images/new images/berggrune.webp",
      description: "Description for berggrune",
    },
    {
      id: "product-chair",
      name: "chair",
      price: "3999.00",
      image: "./assets/images/new images/chair.webp",
      description: "Description for chair",
    },
    {
      id: "product-Whitewashed",
      name: "Whitewashed",
      price: "1999.00",
      image:
        "./assets/images/new images/Design-Element-4-Whitewashed-300x300.webp",
      description: "Description for Whitewashed",
    },
    {
      id: "product-Exquisite Indian Bone Inlay Jar Set",
      name: "Exquisite Indian Bone Inlay Jar Set",
      price: "999.00",
      image:
        "./assets/images/new images/Exquisite_Indian_Bone_Inlay_Jar_Set__15189.1717154889.webp",
      description: "Description for Exquisite Indian Bone Inlay Jar Set",
    },
    {
      id: "product-Mirror",
      name: "Mirror",
      price: "699.00",
      image: "./assets/images/new images/mirror.webp",
      description: "Description for Mirror",
    },
    {
      id: "product-Pillow",
      name: "Pillow",
      price: "399.00",
      image: "./assets/images/new images/Pillow.webp",
      description: "Description for Pillow",
    },
    {
      id: "Table Self-product",
      name: "Table Self",
      price: "999.00",
      image: "./assets/images/new images/Self.webp",
      description: "Description for Table Self",
    },
    {
      id: "Sofa-1",
      name: "Sofa",
      price: "3999.00",
      image: "./assets/images/new images/Sofa.webp",
      description: "Description for Sofa",
    },
    {
      id: "Wooden Tool",
      name: "Wooden Tool",
      price: "3699.00",
      image: "./assets/images/new images/Wooden Tool .webp",
      description: "Description for Wooden Tool",
    },
    // Add more products as needed
  ];
  localStorage.setItem("products", JSON.stringify(products));
  console.log("Products stored in localStorage:", products); // Debugging information
});

/**
 * navbar toggle
 */
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("active");
};

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("active");
};

addEventOnElem(navbarLinks, "click", closeNavbar);

/**
 * header & back top btn active when window scroll down to 100px
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const showElemOnScroll = function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
};

addEventOnElem(window, "scroll", showElemOnScroll);

/**
 * product filter
 */
const filterBtns = document.querySelectorAll("[data-filter-btn]");
const filterBox = document.querySelector("[data-filter]");

let lastClickedFilterBtn = filterBtns[0];

const filter = function () {
  lastClickedFilterBtn.classList.remove("active");
  this.classList.add("active");
  lastClickedFilterBtn = this;

  filterBox.setAttribute("data-filter", this.dataset.filterBtn);
};

document.addEventListener("snipcart.ready", () => {
  const cartCountElement = document.getElementById("cart-count");
  Snipcart.events.on("item.added", (item) => {
    const currentCount = parseInt(cartCountElement.innerText);
    cartCountElement.innerText = currentCount + 1;
  });
});

Snipcart.events.on("item.removed", (item) => {
  const currentCount = parseInt(cartCountElement.innerText);
  cartCountElement.innerText = currentCount - 1;
});

addEventOnElem(filterBtns, "click", filter);

function showSuggestions(query) {
  const suggestionsContainer = document.getElementById("suggestions-container");
  suggestionsContainer.innerHTML = ""; // Clear previous suggestions

  if (query.length === 0) {
    return; // Exit if query is empty
  }

  const products = [
    {
      id: "product-1",
      name: "Animi Dolor Pariatur",
      price: "10.00",
      image: "./assets/images/product-1.jpg",
    },
    {
      id: "product-2",
      name: "Art Deco Home",
      price: "30.00",
      image: "./assets/images/product-2.jpg",
    },
    {
      id: "product-3",
      name: "Artificial potted plant",
      price: "40.00",
      image: "./assets/images/product-3.jpg",
    },
    {
      id: "product-4",
      name: "Dark Green Jug",
      price: "17.10",
      image: "./assets/images/product-4.jpg",
    },
    {
      id: "product-5",
      name: "Drinking Glasses",
      price: "21.00",
      image: "./assets/images/product-5.jpg",
    },
    {
      id: "product-6",
      name: "Helen Chair",
      price: "69.50",
      image: "./assets/images/product-6.jpg",
    },
    {
      id: "product-7",
      name: "High Quality Glass Bottle",
      price: "30.10",
      image: "./assets/images/product-7.jpg",
    },
    {
      id: "product-8",
      name: "Living Room & Bedroom Lights",
      price: "45.00",
      image: "./assets/images/product-8.jpg",
    },
    {
      id: "product-9",
      name: "Nancy Chair",
      price: "90.00",
      image: "./assets/images/product-9.jpg",
    },
    {
      id: "product-10",
      name: "Simple Chair",
      price: "40.00",
      image: "./assets/images/product-10.jpg",
    },
    {
      id: "product-11",
      name: "Smooth Disk",
      price: "46.00",
      image: "./assets/images/product-11.jpg",
    },
    {
      id: "product-12",
      name: "Table Black",
      price: "67.00",
      image: "./assets/images/product-12.jpg",
    },
    {
      id: "product-13",
      name: "Table Wood Pine",
      price: "50.00",
      image: "./assets/images/product-13.jpg",
    },
    {
      id: "product-14",
      name: "Teapot with black tea",
      price: "25.00",
      image: "./assets/images/product-14.jpg",
    },
    {
      id: "product-15",
      name: "Unique Decoration",
      price: "15.00",
      image: "./assets/images/product-15.jpg",
    },
    {
      id: "product-16",
      name: "Vase Of Flowers",
      price: "77.00",
      image: "./assets/images/product-16.jpg",
    },
    {
      id: "product-17",
      name: "Wood Eggs",
      price: "19.00",
      image: "./assets/images/product-17.jpg",
    },
    {
      id: "product-18",
      name: "Wooden Box",
      price: "27.00",
      image: "./assets/images/product-18.jpg",
    },
    {
      id: "product-19",
      name: "Wooden Cups",
      price: "29.00",
      image: "./assets/images/product-19.jpg",
    },
    {
      id: "product-Indian-Chair",
      name: "Indian-Chair",
      price: "2229.00",
      image: "./assets/images/new images/Indian-Chair-.webp",
    },
    {
      id: "product-berggrune",
      name: "berggrune",
      price: "2999.00",
      image: "./assets/images/new images/berggrune.webp",
    },
    {
      id: "product-chair",
      name: "chair",
      price: "3999.00",
      image: "./assets/images/new images/chair.webp",
    },
    {
      id: "product-Whitewashed",
      name: "Whitewashed",
      price: "1999.00",
      image:
        "./assets/images/new images/Design-Element-4-Whitewashed-300x300.webp",
    },
    {
      id: "product-Exquisite Indian Bone Inlay Jar Set",
      name: "Exquisite Indian Bone Inlay Jar Set",
      price: "999.00",
      image:
        "./assets/images/new images/Exquisite_Indian_Bone_Inlay_Jar_Set__15189.1717154889.webp",
    },
    {
      id: "product-Mirror",
      name: "Mirror",
      price: "699.00",
      image: "./assets/images/new images/mirror.webp",
    },
    {
      id: "product-Pillow",
      name: "Pillow",
      price: "399.00",
      image: "./assets/images/new images/Pillow.webp",
    },
    {
      id: "Table Self-product",
      name: "Table Self",
      price: "999.00",
      image: "./assets/images/new images/Self.webp",
    },
    {
      id: "Sofa-1",
      name: "Sofa",
      price: "3999.00",
      image: "./assets/images/new images/Sofa.webp",
    },
    {
      id: "Wooden Tool",
      name: "Wooden Tool",
      price: "3699.00",
      image: "./assets/images/new images/Wooden Tool .webp",
    },
    {
      id: "rustic_wooden_dining_table ",
      name: "Dining Table",
      price: 15000.0,
      image: "assets/images/new images/1 rustic_wooden_dining_table .png",
      category: "accessory",
    },
    {
      id: "round_marble_side_table",
      name: "Side Table",
      price: 200.0,
      image:
        "assets/images/new images/2 round_marble_side_table-removebg-preview.png",
      category: "chair",
    },
    {
      id: "minimalist_coffee_table",
      name: "Minimalist Coffee Table",
      price: 1200.0,
      image:
        "assets/images/new images/3 minimalist_coffee_table-removebg-preview.png",
      category: "table",
    },
    {
      id: "industrial_work_desk",
      name: "Industrial Work Desk",
      price: 300.0,
      image:
        "assets/images/new images/4 industrial_work_desk-removebg-preview.png",
      category: "accessory",
    },
    {
      id: "glass_top_console_table",
      name: "Glass Top Console Table",
      price: 80.0,
      image:
        "assets/images/new images/5 glass_top_console_table-removebg-preview.png",
      category: "decoration",
    },
    {
      id: "reclining_home_theater_sofa",
      name: " Home Theater Sofa",
      price: 500.0,
      image:
        "assets/images/new images/6 reclining_home_theater_sofa-removebg-preview.png",
      category: "accessory",
    },
    {
      id: "shaped_sectional_sofa",
      name: "Shaped Sectional Sofa",
      price: 200.0,
      image:
        "assets/images/new images/7modern_l_shaped_sectional_sofa-removebg-preview.png",
      category: "sofa",
    },
    {
      id: "frameless_wall_mirror",
      name: "Frameless Wall Mirror",
      price: 700.0,
      image:
        "assets/images/new images/frameless_wall_mirror-removebg-preview.png",
      category: "table",
    },
    {
      id: "chesterfield_leather_sofa",
      name: "Leather Sofa",
      price: 1800.0,
      image:
        "assets/images/new images/10 chesterfield_leather_sofa-removebg-preview.png",
      category: "sofa",
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  filteredProducts.forEach((product) => {
    const suggestionItem = document.createElement("div");
    suggestionItem.classList.add("suggestion-item");
    suggestionItem.innerHTML = `
      <img src="${product.image}" alt="${
      product.name
    }" class="suggestion-image">
      <div class="suggestion-details">
        <span class="suggestion-name">${product.name}</span>
        <span class="suggestion-price">₹${parseFloat(product.price).toFixed(
          2
        )}</span>
      </div>
    `;
    suggestionItem.onclick = () => {
      window.location.href = `#${product.id}`;
    };
    suggestionsContainer.appendChild(suggestionItem);
  });
}
