document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please log in to view your cart.');
        window.location.href = 'login.html';
        return;
    }

    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    const priceDetailsList = document.getElementById('price-details-list');
    const clearCartButton = document.getElementById('clear-cart');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        priceDetailsList.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<li class="empty-cart">Your cart is empty.</li>';
            cartTotalContainer.textContent = '';
        } else {
            cart.forEach((item, index) => {
                const li = document.createElement('li');
                li.classList.add('cart-item');

                const img = document.createElement('img');
                img.src = item.image || './assets/images/default-product.jpg';
                img.alt = item.name;

                const details = document.createElement('div');
                details.classList.add('cart-item-details');
                details.textContent = `${item.name}`;

                const price = document.createElement('span');
                price.classList.add('cart-item-price');
                price.textContent = `₹${parseFloat(item.price).toFixed(2)}`;

                const quantityControls = document.createElement('div');
                quantityControls.classList.add('quantity-controls');
                quantityControls.innerHTML = `
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                `;

                const totalItemPrice = document.createElement('span');
                totalItemPrice.classList.add('cart-item-total-price');
                totalItemPrice.textContent = `Total: ₹${(parseFloat(item.price) * item.quantity).toFixed(2)}`;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-button');
                deleteButton.onclick = () => {
                    cart.splice(index, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartDisplay();
                };

                li.appendChild(img);
                li.appendChild(details);
                li.appendChild(price);
                li.appendChild(quantityControls);
                li.appendChild(totalItemPrice);
                li.appendChild(deleteButton);
                cartItemsContainer.appendChild(li);
                total += parseFloat(item.price) * item.quantity;
                totalItems += item.quantity;

                const priceDetailItem = document.createElement('li');
                priceDetailItem.innerHTML = `
                    <span>${item.name} (x${item.quantity})</span>
                    <span>₹${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                `;
                priceDetailsList.appendChild(priceDetailItem);
            });

            const totalPriceItem = document.createElement('li');
            totalPriceItem.classList.add('total-price');
            totalPriceItem.innerHTML = `
                <span>Total Price</span>
                <span>₹${total.toFixed(2)}</span>
            `;
            priceDetailsList.appendChild(totalPriceItem);

            cartTotalContainer.textContent = `Total: ₹${total.toFixed(2)} (${totalItems} items)`;
        }
    }

    function updateQuantity(id, change) {
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
    }

    cartItemsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('increase-quantity')) {
            const id = event.target.getAttribute('data-id');
            updateQuantity(id, 1);
        }

        if (event.target.classList.contains('decrease-quantity')) {
            const id = event.target.getAttribute('data-id');
            updateQuantity(id, -1);
        }
    });

    clearCartButton.onclick = () => {
        if (confirm("Are you sure you want to clear the cart?")) {
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
    };

    updateCartDisplay();
});

