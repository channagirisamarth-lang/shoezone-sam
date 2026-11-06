
let products = [];
let cart = [];

const productList = document.getElementById("product-list");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

// Load products from JSON file
async function loadProducts() {
    try {
        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {
        productList.innerHTML = "Error loading products. Please try again.";
        console.error(error);
    }
}

// Display product cards
function displayProducts(items) {
    productList.innerHTML = "";

    if (items.length === 0) {
        productList.innerHTML = "<p>No products found.</p>";
        return;
    }

    items.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="category">${product.category}</p>
            <p class="price">₹${product.price}</p>
            <p class="rating">⭐ ${product.rating}/5</p>
            <button class="add-btn">Add to Cart</button>
        `;

        card.querySelector(".add-btn").addEventListener("click", () => {
            addToCart(product.id);
        });

        productList.appendChild(card);
    });
}

// Add product to cart
function addToCart(id) {
    const product = products.find(item => item.id === id);

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
}

// Update cart information
function updateCart() {
    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItems.textContent = "Your cart is empty.";
    }

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        const div = document.createElement("div");
        div.className = "cart-item";

        const name = document.createElement("span");
        name.textContent = `${item.name} x ${item.quantity}`;

        const price = document.createElement("span");
        price.textContent = `₹${item.price * item.quantity}`;

        div.append(name, price);
        cartItems.appendChild(div);
    });

    cartCount.textContent = count;
    cartTotal.textContent = total.toLocaleString("en-IN");
}

// Search products
document.getElementById("search").addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue)
    );

    displayProducts(filteredProducts);
});

// Start website
loadProducts();
