document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.querySelector('.icon-cart');
    const cartTab = document.querySelector('.cartTab');
    const closeBtn = document.querySelector('.close');
    const cartItemCount = document.querySelector('.cart-count');
    const totalAmount = document.querySelector('.totalAmount');
    const checkoutBtn = document.querySelector('.checkout-btn'); // Checkout button
    let listProducts = []; // Array to store products

    // Fetch products from JSON file
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            listProducts = data; // Assign fetched data to listProducts array
            displayProducts(listProducts); // Display products on page load
        })
        .catch(error => console.error('Error fetching products:', error));

    // Display products on the page
    function displayProducts(products) {
        const listProduct = document.querySelector('.listProduct');

        products.forEach(product => {
            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <div class="price">$${product.price.toFixed(2)}</div>
                <button class="addCart" data-id="${product.id}">Add to Cart</button>
            `;
            listProduct.appendChild(item);
        });

        // Add event listeners to 'Add to Cart' buttons after they are created
        const addButtons = document.querySelectorAll('.addCart');
        addButtons.forEach(button => {
            button.addEventListener('click', function() {
                const itemId = parseInt(this.dataset.id); // Get product ID from data-id attribute
                const selectedProduct = listProducts.find(product => product.id === itemId);

                if (selectedProduct) {
                    addToCart(selectedProduct); // Add selected product to cart
                    updateCartCount(); // Update cart count display
                    updateTotalAmount(); // Update total price display
                }
            });
        });
    }

    // Add selected product to cart
    function addToCart(product) {
        const cartList = document.querySelector('.listCart');
        const existingCartItem = cartList.querySelector(`.cart-item[data-id="${product.id}"]`);

        if (existingCartItem) {
            const quantityElement = existingCartItem.querySelector('.quantity span.quantity-value');
            let quantity = parseInt(quantityElement.textContent);
            quantityElement.textContent = quantity + 1;

            const totalPriceElement = existingCartItem.querySelector('.totalPrice');
            totalPriceElement.textContent = `$${(product.price * (quantity + 1)).toFixed(2)}`;
        } else {
            const newItem = document.createElement('div');
            newItem.classList.add('cart-item');
            newItem.dataset.id = product.id;
            newItem.innerHTML = `
                <div class="image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="details">
                    <div class="name">${product.name}</div>
                    <div class="price">$${product.price.toFixed(2)}</div>
                    <div class="quantity">
                        <span class="minus">-</span>
                        <span class="quantity-value">1</span>
                        <span class="plus">+</span>
                    </div>
                    <div class="totalPrice">$${product.price.toFixed(2)}</div>
                </div>
                <button class="remove-from-cart-btn">Remove</button>
            `;
            cartList.appendChild(newItem);

            // Add event listener for removing from cart
            const removeButton = newItem.querySelector('.remove-from-cart-btn');
            removeButton.addEventListener('click', function() {
                cartList.removeChild(newItem);
                updateCartCount();
                updateTotalAmount(); // Update total price display
            });

            // Add event listeners for quantity increase and decrease
            const minusButton = newItem.querySelector('.minus');
            const plusButton = newItem.querySelector('.plus');
            const quantityValue = newItem.querySelector('.quantity-value');

            minusButton.addEventListener('click', function() {
                let quantity = parseInt(quantityValue.textContent);
                if (quantity > 1) {
                    quantityValue.textContent = quantity - 1;
                    updateTotalPrice(newItem, product.price, quantity - 1);
                    updateTotalAmount(); // Update total price display
                }
            });

            plusButton.addEventListener('click', function() {
                let quantity = parseInt(quantityValue.textContent);
                quantityValue.textContent = quantity + 1;
                updateTotalPrice(newItem, product.price, quantity + 1);
                updateTotalAmount(); // Update total price display
            });
        }
    }

    // Update total price of cart item
    function updateTotalPrice(item, price, quantity) {
        const totalPriceElement = item.querySelector('.totalPrice');
        totalPriceElement.textContent = `$${(price * quantity).toFixed(2)}`;
    }

    // Update total amount display
    function updateTotalAmount() {
        const cartItems = document.querySelectorAll('.listCart .cart-item');
        let total = 0;

        cartItems.forEach(item => {
            const totalPriceElement = item.querySelector('.totalPrice');
            total += parseFloat(totalPriceElement.textContent.replace('$', ''));
        });

        totalAmount.textContent = `$${total.toFixed(2)}`;
    }

    // Update cart count display
    function updateCartCount() {
        cartItemCount.textContent = document.querySelectorAll('.listCart .cart-item').length;
    }

    // Toggle cart display
    cartIcon.addEventListener('click', function() {
        cartTab.classList.toggle('active');
    });

    // Close cart tab
    closeBtn.addEventListener('click', function() {
        cartTab.classList.remove('active');
    });

    // Handle checkout button click
    checkoutBtn.addEventListener('click', function() {
        alert('Please take a screenshot of your cart before proceeding to checkout.');
        setTimeout(function() {
            window.location.href = 'https://t.me/ISSAC2010'; // Redirect to Telegram URL
        }, 3000); // Delay to give the user time to take a screenshot
    });
});
