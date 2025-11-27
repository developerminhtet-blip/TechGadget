// Enhanced product data with categories
const products = [
    {
        id: 1,
        name: "Quantum Wireless Headphones",
        price: 149.99,
        originalPrice: 199.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Premium noise-cancelling headphones with 40hr battery life and immersive sound quality.",
        category: "audio",
        badge: "BEST SELLER"
    },
    {
        id: 2,
        name: "Nexus Pro Smartphone",
        price: 999.99,
        originalPrice: 1199.99,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Flagship smartphone with revolutionary camera system and all-day battery.",
        category: "mobile",
        badge: "NEW"
    },
    {
        id: 3,
        name: "Apex Gaming Laptop",
        price: 1899.99,
        originalPrice: 2199.99,
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "High-performance gaming laptop with RTX 4070 and 240Hz display for ultimate gaming.",
        category: "computers",
        badge: "HOT"
    },
    {
        id: 4,
        name: "Chronos Smart Watch",
        price: 349.99,
        originalPrice: 399.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Advanced health monitoring with always-on display and 7-day battery life.",
        category: "wearables",
        badge: "SALE"
    },
    {
        id: 5,
        name: "Pulse Wireless Earbuds",
        price: 179.99,
        originalPrice: 229.99,
        image: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "True wireless earbuds with spatial audio and adaptive noise cancellation.",
        category: "audio",
        badge: "LIMITED"
    },
    {
        id: 6,
        name: "Vision Pro Tablet",
        price: 799.99,
        originalPrice: 899.99,
        image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Professional tablet with stunning display and powerful performance for creatives.",
        category: "computers",
        badge: "NEW"
    },
    {
        id: 7,
        name: "Spectra Pro Camera",
        price: 1299.99,
        originalPrice: 1499.99,
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Mirrorless camera with 45MP sensor and 8K video capabilities for professionals.",
        category: "mobile",
        badge: "PREMIUM"
    },
    {
        id: 8,
        name: "Nova Wireless Speaker",
        price: 199.99,
        originalPrice: 249.99,
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "360° immersive sound with deep bass and 20-hour playtime for any occasion.",
        category: "audio",
        badge: "POPULAR"
    }
];

// Cart data
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// DOM elements
const productsContainer = document.getElementById('productsContainer');
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeModal = document.getElementById('closeModal');
const cartItems = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartCountElement = document.querySelector('.cart-count');
const categoryButtons = document.querySelectorAll('.category-btn');
const contactForm = document.getElementById('contactForm');

// Initialize the store
function initStore() {
    renderProducts();
    updateCart();
    
    // Event listeners
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    closeModal.addEventListener('click', () => {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Category filter buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            filterProducts(category);
        });
    });
    
    // Contact form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
    
    // Newsletter form submission
    document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Thank you for subscribing to our newsletter!');
        this.reset();
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
}

// Filter products by category
function filterProducts(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    renderProducts(filteredProducts);
}

// Render products
function renderProducts(productsToRender = products) {
    productsContainer.innerHTML = '';
    
    if (productsToRender.length === 0) {
        productsContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #6c757d;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3>No products found</h3>
                <p>Try selecting a different category</p>
            </div>
        `;
        return;
    }
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <div>
                        <span class="original-price">$${product.originalPrice}</span>
                        $${product.price.toFixed(2)}
                    </div>
                    <div style="color: #28a745; font-size: 0.9rem;">
                        Save $${(product.originalPrice - product.price).toFixed(2)}
                    </div>
                </div>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('.add-to-cart').getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    
    // Show confirmation notification
    showNotification(`${product.name} added to cart!`);
    
    // Animate cart icon
    cartIcon.style.transform = 'scale(1.1)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 300);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    
    // Show notification
    showNotification('Item removed from cart');
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Update cart UI
function updateCart() {
    // Calculate cart count and total
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Update cart count in header
    cartCountElement.textContent = cartCount;
    
    // Update cart total
    cartTotalElement.textContent = cartTotal.toFixed(2);
    
    // Render cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started</p>
            </div>
        `;
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
            </div>
            <div class="cart-item-controls">
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Add event listeners to cart controls
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            updateQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            updateQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
    
    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (cart.length > 0) {
            showNotification(`Order placed successfully! Total: $${cartTotal.toFixed(2)}`);
            cart = [];
            updateCart();
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Show notification
function showNotification(message) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Initialize the store when page loads
document.addEventListener('DOMContentLoaded', initStore);