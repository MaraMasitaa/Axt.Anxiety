const products = [
    { id: '010', name: 'Product 010', price: 25.00, img: './img/010front.JPEG' },
    { id: '011', name: 'Product 011', price: 30.00, img: './img/011front.JPEG' },
    { id: '012', name: 'Product 012', price: 28.00, img: './img/012front.JPEG' },
    { id: '013', name: 'Product 013', price: 32.00, img: './img/013front.JPEG' }
];

const productGrid = document.getElementById('product-grid');
const deliveryFee = 2.00;
let cartItems = [];
const selectedSizes = {};

// Render products
products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">$${product.price.toFixed(2)}</p>
        <div class="size-selector" id="size-${product.id}">
            <div class="size-option" onclick="selectSize('S', 'size-${product.id}')">S</div>
            <div class="size-option" onclick="selectSize('M', 'size-${product.id}')">M</div>
            <div class="size-option" onclick="selectSize('L', 'size-${product.id}')">L</div>
        </div>
        <div class="product-actions">
            <button onclick="addToCart('${product.id}', ${product.price}, 'size-${product.id}', '${product.img}')">
                <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
        </div>
    `;
    productGrid.appendChild(productCard);
});

// Select size function
function selectSize(size, selectorId) {
    const sizeOptions = document.querySelectorAll(`#${selectorId} .size-option`);
    sizeOptions.forEach(option => option.classList.remove('selected'));
    
    document.querySelector(`#${selectorId} .size-option:contains('${size}')`).classList.add('selected');
    selectedSizes[selectorId] = size;
}

// Toggle cart visibility
function toggleCart() {
    const cartDropdown = document.getElementById('cart-dropdown');
    cartDropdown.style.display = (cartDropdown.style.display === 'block') ? 'none' : 'block';
}

// Add to cart function
function addToCart(productId, price, sizeSelectorId, imageSrc) {
    const size = selectedSizes[sizeSelectorId];
    if (!size) {
        alert('Please select a size');
        return;
    }

    const existingItem = cartItems.find(item => item.id === productId && item.size === size);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({ id: productId, size: size, price: price, image: imageSrc, quantity: 1 });
    }

    updateCartDisplay();
    updateTotal();
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = ''; // Clear previous items

    cartItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.id}" style="width: 40px; height: auto; margin-right: 10px;">
            <p>${item.id} - Size: ${item.size} - $${item.price.toFixed(2)}</p>
            <div style="display: flex; align-items: center;">
                <button onclick="changeQuantity('${item.id}', '${item.size}', -1)" class="quantity-btn">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity('${item.id}', '${item.size}', 1)" class="quantity-btn">+</button>
                <button onclick="removeFromCart('${item.id}', '${item.size}')" class="remove-btn">✖️</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });
}

// Change item quantity
function changeQuantity(productId, size, change) {
    const item = cartItems.find(item => item.id === productId && item.size === size);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId, size);
        } else {
            updateCartDisplay();
            updateTotal();
        }
    }
}

// Remove item from cart
function removeFromCart(productId, size) {
    cartItems = cartItems.filter(item => !(item.id === productId && item.size === size));
    updateCartDisplay();
    updateTotal();
}

// Update total price
function updateTotal() {
    const itemTotalElem = document.getElementById('cart-total');
    let total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Add delivery fee if the cart is not empty
    total += cartItems.length > 0 ? deliveryFee : 0;

    itemTotalElem.innerText = `Total: $${total.toFixed(2)}`;
}

// Checkout function
function checkout() {
    if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = parseFloat(document.getElementById('cart-total').innerText.replace('Total: $', '')) || 0;
    alert(`Your total is $${total.toFixed(2)}. Proceeding to checkout.`);
    window.location.href = 'check.html'; // Redirect to checkout page
}
