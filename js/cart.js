document.addEventListener("DOMContentLoaded", () => {
    const cartIconContainer = document.querySelector(".cart-icon-container");
    const cartCount = document.querySelector(".cart-count");
    const cartDropdown = document.querySelector(".cart-dropdown");
    const cartItemsContainer = document.querySelector(".cart-dropdown .cart-items");
    const cartTotal = document.querySelector(".cart-dropdown .cart-total p");
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Load cart from localStorage or initialize as empty array

    // Update cart count display
    function updateCartCount() {
        cartCount.textContent = cart.length;
    }

    // Update cart dropdown and total price display
    function updateCartDropdown() {
        cartItemsContainer.innerHTML = ""; // Clear the dropdown content

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        } else {
            let total = 0;
            cart.forEach((item, index) => {
                const cartItem = document.createElement("div");
                cartItem.classList.add("cart-item");

                // Create cart item content
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" width="50">
                    <p>${item.name} - $${item.price}</p>
                    <button class="remove-item" data-index="${index}">Remove</button>
                `;

                cartItemsContainer.appendChild(cartItem);
                total += parseFloat(item.price);
            });
            cartTotal.textContent = `Total: $${total.toFixed(2)}`;
        }

        // Save cart to localStorage after update
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Function to add product to the cart
    function addToCart(product) {
        cart.push(product);
        updateCartCount();
        updateCartDropdown();
    }

    // Add event listener to all "Add to Cart" buttons
    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", () => {
            const productCard = button.closest(".product-card");
            const productName = productCard.querySelector("h3").textContent;
            const productPrice = productCard.querySelector(".price").textContent.replace("$", "");
            const productImage = productCard.querySelector("img").src;

            const product = {
                name: productName,
                price: productPrice,
                image: productImage
            };

            addToCart(product);
        });
    });

    // Add event listener to remove items from the cart
    cartItemsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-item")) {
            const index = e.target.getAttribute("data-index");
            cart.splice(index, 1); // Remove item from cart
            updateCartCount();
            updateCartDropdown();
        }
    });

    // Toggle cart dropdown visibility
    cartIconContainer.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevents the click from propagating to the document
        cartDropdown.classList.toggle("show");
    });

    // Hide the cart when clicking outside of the cart container
    document.addEventListener("click", (e) => {
        if (!cartIconContainer.contains(e.target) && !cartDropdown.contains(e.target)) {
            cartDropdown.classList.remove("show");
        }
    });

    // Initialize cart display on page load
    updateCartCount();
    updateCartDropdown();
});
