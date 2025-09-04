// --- Global Data ---
let products = [
    {
        id: '1',
        name: 'Smartphone Pro Max 2025',
        price: 999,
        oldPrice: 1299,
        discount: 23,
        rating: 4.8,
        prime: true,
        category: 'electronics',
        brand: 'Apple',
        stock: 100,
        shortDescription: 'The next generation smartphone with unparalleled performance.',
        longDescription: 'Experience the future of mobile technology with the Smartphone Pro Max. Its A-series chip delivers incredible speed and efficiency, while the pro-grade camera system captures stunning photos and 8K video. The vibrant Super Retina XDR display is perfect for all your content.',
        images: [
            'https://images.unsplash.com/photo-1592882208035-7769931752b9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=800',
            'https://images.unsplash.com/photo-1596702334887-b93080c5f242?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=800'
        ],
        video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        variants: {
            color: ['black', 'white', 'blue'],
            storage: ['128GB', '256GB']
        },
        specs: {
            Display: '6.7-inch Super Retina XDR',
            Processor: 'A20 Bionic Chip',
            Camera: '48MP Main, 12MP Ultra-Wide',
            Battery: 'Up to 24 hours video playback',
            OS: 'iOS 19'
        },
        reviews: [
            {user: 'Ali Khan', date: 'Aug 20, 2025', stars: 5, title: 'Amazing phone!', text: 'Best smartphone I have ever used. The camera is out of this world.'},
            {user: 'Sara Ali', date: 'Aug 22, 2025', stars: 4, title: 'Great but pricey', text: 'Love the speed and display, but the price is a bit high.'}
        ]
    },
    // Add more products as needed
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let user = JSON.parse(localStorage.getItem('user')) || null;
let addresses = JSON.parse(localStorage.getItem('addresses')) || [];

// --- Core Functions ---
document.addEventListener('DOMContentLoaded', () => {
    loadIncludes();
    updateCounts();
    if (user) {
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('sign-in-link').style.display = 'none';
        document.getElementById('profile-link').style.display = 'block';
    }

    const pathname = window.location.pathname;
    if (pathname.includes('index.html') || pathname === '/') initHeroCarousel();
    if (pathname.includes('category.html')) initCategoryPage();
    if (pathname.includes('product.html')) initProductDetailPage();
    if (pathname.includes('cart.html')) initCartPage();
    if (pathname.includes('checkout.html')) initCheckoutPage();
    if (pathname.includes('orders.html')) initOrdersPage();
    if (pathname.includes('wishlist.html')) initWishlistPage();
    if (pathname.includes('login.html')) initLoginPage();
    if (pathname.includes('register.html')) initRegisterPage();
    if (pathname.includes('profile.html')) initProfilePage();
    initGlobalListeners();
    initStickyHeader();
});

// Load header and footer
function loadIncludes() {
    fetch('header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('header-placeholder').innerHTML = html;
            initHeaderListeners();
        })
        .catch(error => console.error('Error loading header:', error));

    fetch('footer.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('footer-placeholder').innerHTML = html;
            initFooterListeners();
        })
        .catch(error => console.error('Error loading footer:', error));
}

// Initialize header listeners
function initHeaderListeners() {
    updateCounts();
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    if (searchInput && searchResults) {
        searchInput.addEventListener('input', debounce(() => {
            const query = searchInput.value.toLowerCase();
            if (query.length > 1) {
                const filteredProducts = products.filter(p => p.name.toLowerCase().includes(query)).slice(0, 5);
                searchResults.innerHTML = filteredProducts.map(p => `<a href="product.html?id=${p.id}" class="fade-in">${p.name}</a>`).join('');
                searchResults.classList.add('show');
            } else {
                searchResults.classList.remove('show');
            }
        }, 300));
        searchInput.addEventListener('blur', () => setTimeout(() => searchResults.classList.remove('show'), 200));
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.length > 1) searchResults.classList.add('show');
        });
    }

    const cartIcon = document.querySelector('.cart');
    const wishlistIcon = document.querySelector('.wishlist');
    const accountLink = document.querySelector('.account');
    if (cartIcon) {
        cartIcon.addEventListener('mouseenter', () => updateCartPreview());
        cartIcon.addEventListener('mouseleave', () => document.getElementById('cart-preview').classList.remove('show'));
    }
    if (wishlistIcon) {
        wishlistIcon.addEventListener('mouseenter', () => updateWishlistPreview());
        wishlistIcon.addEventListener('mouseleave', () => document.getElementById('wishlist-preview').classList.remove('show'));
    }
    if (accountLink) {
        accountLink.addEventListener('mouseenter', () => document.querySelector('.account-dropdown').classList.add('show'));
        accountLink.addEventListener('mouseleave', () => document.querySelector('.account-dropdown').classList.remove('show'));
    }

    document.querySelector('.location').addEventListener('click', showAddressPopup);
    document.querySelector('.hamburger')?.addEventListener('click', toggleSidebar);
}

// Initialize footer listeners
function initFooterListeners() {
    document.querySelectorAll('.footer-section h4').forEach(header => {
        header.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                header.parentElement.classList.toggle('active');
            }
        });
    });
    document.querySelector('.back-to-top')?.addEventListener('click', scrollToTop);
    document.getElementById('language-select')?.addEventListener('change', changeLanguage);
}

// Update cart and wishlist counts
function updateCounts() {
    const cartCountEl = document.getElementById('cart-count');
    const wishlistCountEl = document.getElementById('wishlist-count');
    if (cartCountEl) {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = count;
        animateCounter(cartCountEl, count);
    }
    if (wishlistCountEl) {
        wishlistCountEl.textContent = wishlist.length;
        animateCounter(wishlistCountEl, wishlist.length);
    }
}

// Animate counter
function animateCounter(element, target) {
    let start = parseInt(element.dataset.count || 0);
    element.dataset.count = target;
    if (start !== target) {
        element.classList.add('count-up');
        setTimeout(() => element.classList.remove('count-up'), 300);
    }
}

// Search products
function searchProducts() {
    const query = document.getElementById('search-input').value;
    const category = document.getElementById('search-category').value;
    const url = category === 'all' ? `category.html?search=${query}` : `category.html?category=${category}&search=${query}`;
    window.location.href = url;
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
    document.querySelectorAll('.sub-menu').forEach(menu => {
        menu.classList.remove('active');
    });
}

// Accordion menu
function initAccordionMenus() {
    document.querySelectorAll('.sidebar a.has-sub-menu').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const subMenu = link.nextElementSibling;
            subMenu.classList.toggle('active');
        });
    });
}

// Change language
function changeLanguage() {
    const lang = document.getElementById('language-select').value;
    localStorage.setItem('language', lang);
    alert(`Language changed to ${lang.toUpperCase()}`);
}

// Show address popup
function showAddressPopup() {
    let popup = document.querySelector('.address-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.className = 'address-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <h3>Select Address</h3>
                ${addresses.length ? addresses.map((addr, i) => `<label class="fade-in"><input type="radio" name="address" value="${i}">${addr.fullName}, ${addr.address}, ${addr.city}, ${addr.postalCode}</label>`).join('') : '<p>No saved addresses</p>'}
                <h4>Add New Address</h4>
                <input type="text" id="new-address-name" placeholder="Full Name">
                <input type="text" id="new-address-line1" placeholder="Address Line 1">
                <input type="text" id="new-address-city" placeholder="City">
                <input type="text" id="new-address-postal" placeholder="Postal Code">
                <button onclick="saveNewAddress()">Save Address</button>
                <button onclick="closeAddressPopup()">Close</button>
            </div>
        `;
        document.body.appendChild(popup);
    }
    popup.classList.add('show');
}

// Save new address
function saveNewAddress() {
    const name = document.getElementById('new-address-name').value;
    const address = document.getElementById('new-address-line1').value;
    const city = document.getElementById('new-address-city').value;
    const postalCode = document.getElementById('new-address-postal').value;
    if (name && address && city && postalCode) {
        addresses.push({ fullName: name, address, city, postalCode });
        localStorage.setItem('addresses', JSON.stringify(addresses));
        closeAddressPopup();
        showAddressPopup();
    } else {
        alert('Please fill all address fields.');
        document.querySelectorAll('.address-popup input').forEach(input => {
            if (!input.value) input.classList.add('error');
            setTimeout(() => input.classList.remove('error'), 500);
        });
    }
}

// Close address popup
function closeAddressPopup() {
    const popup = document.querySelector('.address-popup');
    if (popup) popup.classList.remove('show');
}

// Sign out
function signOut() {
    user = null;
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Update cart preview
function updateCartPreview() {
    const preview = document.getElementById('cart-preview-items');
    if (preview) {
        preview.innerHTML = cart.length ? cart.map(item => {
            const product = products.find(p => p.id === item.productId);
            return `
                <div class="item fade-in">
                    <img src="${product.images[0]}" alt="${product.name}">
                    <div>
                        <p>${product.name}</p>
                        <p>Qty: ${item.quantity}</p>
                    </div>
                </div>
            `;
        }).join('') : '<p>Your cart is empty</p>';
        document.getElementById('cart-preview').classList.add('show');
    }
}

// Update wishlist preview
function updateWishlistPreview() {
    const preview = document.getElementById('wishlist-preview-items');
    if (preview) {
        preview.innerHTML = wishlist.length ? wishlist.map(id => {
            const product = products.find(p => p.id === id);
            return `
                <div class="item fade-in">
                    <img src="${product.images[0]}" alt="${product.name}">
                    <p>${product.name}</p>
                </div>
            `;
        }).join('') : '<p>Your wishlist is empty</p>';
        document.getElementById('wishlist-preview').classList.add('show');
    }
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Sticky header
function initStickyHeader() {
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize hero carousel
function initHeroCarousel() {
    const carousel = document.querySelector('.hero-carousel');
    const dots = document.querySelectorAll('.hero-dot');
    const arrows = document.querySelectorAll('.hero-arrow');
    let current = 0;
    let isPaused = false;

    function updateCarousel() {
        carousel.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[current].classList.add('active');
    }

    arrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            current = arrow.classList.contains('left') ? (current - 1 + 3) % 3 : (current + 1) % 3;
            updateCarousel();
        });
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            current = index;
            updateCarousel();
        });
    });

    carousel.addEventListener('mouseenter', () => isPaused = true);
    carousel.addEventListener('mouseleave', () => isPaused = false);

    // Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    carousel.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            current = (current + 1) % 3;
            updateCarousel();
        } else if (touchEndX - touchStartX > 50) {
            current = (current - 1 + 3) % 3;
            updateCarousel();
        }
    });

    setInterval(() => {
        if (!isPaused) {
            current = (current + 1) % 3;
            updateCarousel();
        }
    }, 5000);
}

// Initialize category page
function initCategoryPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');
    const productGrid = document.querySelector('.product-grid');
    const brandFilters = document.getElementById('brand-filters');
    const priceSlider = document.getElementById('price-slider');
    const priceDisplay = document.getElementById('price-display');
    let page = 1;
    const perPage = 10;

    let filteredProducts = products;
    if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    if (search) {
        filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    const brands = [...new Set(products.map(p => p.brand))];
    brandFilters.innerHTML = brands.map(brand => `<label><input type="checkbox" data-brand="${brand}">${brand}</label>`).join('');

    function renderProducts() {
        const maxPrice = priceSlider.value;
        const selectedBrands = Array.from(brandFilters.querySelectorAll('input:checked')).map(input => input.dataset.brand);
        const selectedRating = document.querySelector('input[data-rating]:checked')?.dataset.rating || 0;
        const inStock = document.querySelector('input[data-stock]:checked')?.dataset.stock === 'true';

        let filtered = filteredProducts.filter(p => p.price <= maxPrice);
        if (selectedBrands.length) filtered = filtered.filter(p => selectedBrands.includes(p.brand));
        if (selectedRating) filtered = filtered.filter(p => p.rating >= parseInt(selectedRating));
        if (inStock) filtered = filtered.filter(p => p.stock > 0);

        productGrid.innerHTML = filtered.slice(0, page * perPage).map(p => `
            <div class="product-card fade-in">
                <img class="product-image lazy" data-src="${p.images[0]}" alt="${p.name}">
                <div class="product-content">
                    <h3>${p.name}</h3>
                    <div class="rating">${renderStars(p.rating)} (${p.rating})</div>
                    <p class="price">$${p.price.toFixed(2)}</p>
                    ${p.prime ? '<span class="sponsored">Sponsored</span>' : ''}
                    <div class="actions">
                        <button onclick="addToCart('${p.id}')">Add to Cart</button>
                        <button class="grey" onclick="addToWishlist('${p.id}')">Add to Wishlist</button>
                    </div>
                </div>
            </div>
        `).join('');

        lazyLoadImages();
    }

    priceSlider.addEventListener('input', () => {
        priceDisplay.textContent = `$${priceSlider.value}`;
        renderProducts();
    });

    brandFilters.addEventListener('change', renderProducts);
    document.querySelectorAll('input[data-rating], input[data-stock]').forEach(input => input.addEventListener('change', renderProducts));

    document.getElementById('sort-select')?.addEventListener('change', (e) => {
        const sort = e.target.value;
        filteredProducts.sort((a, b) => {
            if (sort === 'price-asc') return a.price - b.price;
            if (sort === 'price-desc') return b.price - a.price;
            if (sort === 'rating') return b.rating - a.rating;
            return 0;
        });
        renderProducts();
    });

    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && filteredProducts.length > page * perPage) {
            page++;
            renderProducts();
        }
    });

    renderProducts();
}

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img.lazy');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    images.forEach(img => observer.observe(img));
}

// Render star rating
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(5 - fullStars - halfStar);
}

// Initialize product detail page
function initProductDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.querySelector('.product-title').textContent = product.name;
    document.querySelector('.rating-stars').textContent = renderStars(product.rating);
    document.querySelector('.rating-number').textContent = `(${product.rating})`;
    document.querySelector('.price').textContent = `$${product.price.toFixed(2)}`;
    if (product.oldPrice) document.querySelector('.old-price').textContent = `$${product.oldPrice.toFixed(2)}`;
    document.querySelector('.product-description').textContent = product.shortDescription;
    document.querySelector('.product-long-description').textContent = product.longDescription;
    document.querySelector('.main-product-image').src = product.images[0];
    document.querySelector('.thumbnails').innerHTML = product.images.map((img, i) => `
        <img class="thumbnail ${i === 0 ? 'active' : ''}" src="${img}" alt="Thumbnail ${i + 1}" onclick="changeImage('${img}', this)">
    `).join('');
    document.querySelector('.product-video source').src = product.video;
    document.querySelector('.prime-delivery').textContent = product.prime ? 'Prime: Free One-Day Delivery' : 'Standard Delivery';
    document.querySelector('.in-stock').textContent = product.stock > 0 ? 'In Stock' : 'Out of Stock';

    const specsTab = document.querySelector('#specs ul');
    specsTab.innerHTML = Object.entries(product.specs).map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join('');

    document.querySelector('.reviews').innerHTML = product.reviews.length ? product.reviews.map(r => `
        <div class="review fade-in">
            <p><strong>${r.user}</strong> - ${r.date}</p>
            <p>${renderStars(r.stars)}</p>
            <p><strong>${r.title}</strong></p>
            <p>${r.text}</p>
        </div>
    `).join('') : '<p>No reviews yet</p>';

    const colorVariants = document.querySelector('.color-variants');
    const storageVariants = document.querySelector('.storage-variants');
    if (product.variants.color) {
        colorVariants.innerHTML = product.variants.color.map(c => `<button class="variant-button ${c === product.variants.color[0] ? 'selected' : ''}" onclick="selectVariant('color', '${c}')">${c}</button>`).join('');
    }
    if (product.variants.storage) {
        storageVariants.innerHTML = product.variants.storage.map(s => `<button class="variant-button ${s === product.variants.storage[0] ? 'selected' : ''}" onclick="selectVariant('storage', '${s}')">${s}</button>`).join('');
    }

    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => addToCart(productId));
    document.querySelector('.add-to-wishlist-btn').addEventListener('click', () => addToWishlist(productId));
    document.querySelector('.buy-now-btn').addEventListener('click', () => {
        addToCart(productId);
        window.location.href = 'checkout.html';
    });

    // Image zoom
    const mainImage = document.querySelector('.main-product-image');
    mainImage.addEventListener('mousemove', (e) => {
        const rect = mainImage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mainImage.style.transformOrigin = `${x}px ${y}px`;
        mainImage.classList.add('zoomed');
    });
    mainImage.addEventListener('mouseleave', () => {
        mainImage.classList.remove('zoomed');
    });

    // Sticky add to cart
    const buyBox = document.querySelector('.buy-box');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            buyBox.classList.add('sticky');
        } else {
            buyBox.classList.remove('sticky');
        }
    });
}

// Change product image
function changeImage(src, element) {
    const mainImage = document.querySelector('.main-product-image');
    mainImage.src = src;
    mainImage.classList.add('fade');
    setTimeout(() => mainImage.classList.remove('fade'), 300);
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
}

// Select variant
function selectVariant(type, value) {
    document.querySelectorAll(`.${type}-variants .variant-button`).forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product.stock <= 0) {
        alert('This product is out of stock.');
        return;
    }
    const selectedColor = document.querySelector('.color-variants .selected')?.textContent || '';
    const selectedStorage = document.querySelector('.storage-variants .selected')?.textContent || '';
    const cartItem = cart.find(item => item.productId === productId && item.variant.color === selectedColor && item.variant.storage === selectedStorage);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ productId, quantity: 1, variant: { color: selectedColor, storage: selectedStorage } });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCounts();
    updateCartPreview();
    alert('Added to cart!');
}

// Add to wishlist
function addToWishlist(productId) {
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateCounts();
        updateWishlistPreview();
        alert('Added to wishlist!');
    } else {
        alert('Already in wishlist!');
    }
}

// Initialize cart page
function initCartPage() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = cart.length ? cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        return `
            <div class="cart-item fade-in">
                <img src="${product.images[0]}" alt="${product.name}">
                <div class="cart-item-details">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <p>Variant: ${item.variant.color || ''} ${item.variant.storage || ''}</p>
                    <select class="quantity-select" data-id="${item.productId}" data-variant="${JSON.stringify(item.variant)}">
                        ${[...Array(10).keys()].map(i => `<option value="${i + 1}" ${item.quantity === i + 1 ? 'selected' : ''}>${i + 1}</option>`).join('')}
                    </select>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-item-btn" onclick="removeFromCart('${item.productId}', '${JSON.stringify(item.variant)}')">Remove</button>
                </div>
            </div>
        `;
    }).join('') : '<p>Your cart is empty</p>';

    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + product.price * item.quantity;
    }, 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;

    document.querySelectorAll('.quantity-select').forEach(select => {
        select.addEventListener('change', () => {
            const productId = select.dataset.id;
            const variant = JSON.parse(select.dataset.variant);
            const cartItem = cart.find(item => item.productId === productId && JSON.stringify(item.variant) === JSON.stringify(variant));
            cartItem.quantity = parseInt(select.value);
            localStorage.setItem('cart', JSON.stringify(cart));
            initCartPage();
        });
    });
}

// Remove from cart
function removeFromCart(productId, variant) {
    const itemEl = document.querySelector(`.cart-item[data-id="${productId}"]`);
    if (itemEl) itemEl.classList.add('fade-out');
    setTimeout(() => {
        cart = cart.filter(item => item.productId !== productId || JSON.stringify(item.variant) !== variant);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCounts();
        initCartPage();
    }, 300);
}

// Initialize checkout page
function initCheckoutPage() {
    const cartItems = document.querySelector('.cart-items');
    const checkoutTotal = document.getElementById('checkout-total');
    cartItems.innerHTML = cart.length ? cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        return `
            <div class="cart-item fade-in">
                <img src="${product.images[0]}" alt="${product.name}">
                <div>
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Variant: ${item.variant.color || ''} ${item.variant.storage || ''}</p>
                </div>
            </div>
        `;
    }).join('') : '<p>Your cart is empty</p>';

    let total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + product.price * item.quantity;
    }, 0);
    checkoutTotal.textContent = `$${total.toFixed(2)}`;

    document.querySelectorAll('.checkout-step').forEach(step => {
        step.addEventListener('toggle', () => {
            document.querySelectorAll('.progress-circle').forEach((circle, i) => {
                circle.classList.toggle('active', i <= Array.from(document.querySelectorAll('.checkout-step')).findIndex(s => s.open));
            });
            document.querySelectorAll('.progress-line').forEach((line, i) => {
                line.classList.toggle('active', i < Array.from(document.querySelectorAll('.checkout-step')).findIndex(s => s.open));
            });
        });
    });

    document.querySelector('.place-order-btn').addEventListener('click', () => {
        if (!user) {
            alert('Please sign in to place an order.');
            window.location.href = 'login.html';
            return;
        }
        if (!addresses.length) {
            alert('Please add a shipping address.');
            return;
        }
        const orderId = 'ORD' + Math.floor(Math.random() * 100000);
        orders.push({
            id: orderId,
            date: new Date().toISOString().split('T')[0],
            customer: user.name,
            total,
            status: 'Processing',
            items: cart
        });
        localStorage.setItem('orders', JSON.stringify(orders));
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCounts();
        window.location.href = `order-confirmation.html?orderId=${orderId}`;
    });

    document.querySelectorAll('input[name="payment"]').forEach(input => {
        input.addEventListener('change', () => {
            const deliveryCost = document.getElementById('delivery-cost');
            deliveryCost.textContent = input.value === 'cod' ? '$5.00' : '$0.00';
            checkoutTotal.textContent = `$${input.value === 'cod' ? (total + 5).toFixed(2) : total.toFixed(2)}`;
        });
    });
}

// Save address
function saveAddress() {
    const inputs = document.querySelectorAll('.checkout-step input');
    const [fullName, address, city, postalCode] = inputs;
    if (fullName.value && address.value && city.value && postalCode.value) {
        addresses.push({
            fullName: fullName.value,
            address: address.value,
            city: city.value,
            postalCode: postalCode.value
        });
        localStorage.setItem('addresses', JSON.stringify(addresses));
        inputs.forEach(input => input.value = '');
        document.querySelectorAll('.checkout-step')[0].removeAttribute('open');
        document.querySelectorAll('.checkout-step')[1].setAttribute('open', '');
    } else {
        inputs.forEach(input => {
            if (!input.value) input.classList.add('error');
            setTimeout(() => input.classList.remove('error'), 500);
        });
        alert('Please fill all address fields.');
    }
}

// Save payment
function savePayment() {
    const payment = document.querySelector('input[name="payment"]:checked')?.value;
    if (!payment) {
        alert('Please select a payment method.');
        return;
    }
    localStorage.setItem('payment', payment);
    document.querySelectorAll('.checkout-step')[1].removeAttribute('open');
    document.querySelectorAll('.checkout-step')[2].setAttribute('open', '');
}

// Initialize orders page
function initOrdersPage() {
    const ordersList = document.querySelector('.orders-list');
    ordersList.innerHTML = orders.length ? orders.map(o => `
        <details class="fade-in">
            <summary>Order #${o.id} - ${o.date} - ${o.status}</summary>
            <div class="order-details">
                <p><strong>Customer:</strong> ${o.customer}</p>
                <p><strong>Total:</strong> $${o.total.toFixed(2)}</p>
                <h4>Items:</h4>
                ${o.items.map(item => {
                    const product = products.find(p => p.id === item.productId);
                    return `
                        <div>
                            <img src="${product.images[0]}" alt="${product.name}">
                            <p>${product.name}</p>
                            <p>Quantity: ${item.quantity}</p>
                            <p>Variant: ${item.variant.color || ''} ${item.variant.storage || ''}</p>
                        </div>
                    `;
                }).join('')}
                <button class="track-btn" onclick="trackOrder('${o.id}')">Track</button>
                <button class="cancel-btn" onclick="cancelOrder('${o.id}')">Cancel</button>
            </div>
        </details>
    `).join('') : '<p>No orders found</p>';
}

// Track order
function trackOrder(orderId) {
    window.location.href = `order-tracking.html?orderId=${orderId}`;
}

// Cancel order
function cancelOrder(orderId) {
    if (confirm('Are you sure you want to cancel this order?')) {
        orders = orders.filter(o => o.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(orders));
        initOrdersPage();
    }
}

// Initialize wishlist page
function initWishlistPage() {
    const wishlistGrid = document.querySelector('.wishlist-grid');
    wishlistGrid.innerHTML = wishlist.length ? wishlist.map(id => {
        const product = products.find(p => p.id === id);
        return `
            <div class="product-card fade-in">
                <img class="product-image lazy" data-src="${product.images[0]}" alt="${product.name}">
                <div class="product-content">
                    <h3>${product.name}</h3>
                    <div class="rating">${renderStars(product.rating)} (${product.rating})</div>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <div class="actions">
                        <button onclick="addToCart('${product.id}')">Add to Cart</button>
                        <button class="grey" onclick="removeFromWishlist('${product.id}')">Remove</button>
                    </div>
                </div>
            </div>
        `;
    }).join('') : '<p>Your wishlist is empty</p>';
    lazyLoadImages();
}

// Remove from wishlist
function removeFromWishlist(productId) {
    const card = document.querySelector(`.product-card:has([onclick="removeFromWishlist('${productId}')"])`);
    if (card) card.classList.add('fade-out');
    setTimeout(() => {
        wishlist = wishlist.filter(id => id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateCounts();
        initWishlistPage();
    }, 300);
}

// Initialize login page
function initLoginPage() {
    const form = document.querySelector('.login-form');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.querySelector('.toggle-password');

    togglePassword?.addEventListener('click', () => {
        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
        togglePassword.textContent = passwordInput.type === 'password' ? 'Show' : 'Hide';
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('email').classList.add('error');
            document.querySelector('.error-text').textContent = 'Invalid email format';
            setTimeout(() => {
                document.getElementById('email').classList.remove('error');
                document.querySelector('.error-text').textContent = '';
            }, 500);
            return;
        }
        if (password.length < 6) {
            passwordInput.classList.add('error');
            document.querySelector('.error-text').textContent = 'Password must be at least 6 characters';
            setTimeout(() => {
                passwordInput.classList.remove('error');
                document.querySelector('.error-text').textContent = '';
            }, 500);
            return;
        }
        user = { name: email.split('@')[0], email };
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'profile.html';
    });
}

// Initialize register page
function initRegisterPage() {
    const form = document.querySelector('.register-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const togglePassword = document.querySelector('.toggle-password');
    const toggleConfirmPassword = document.querySelector('.toggle-confirm-password');

    togglePassword?.addEventListener('click', () => {
        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
        togglePassword.textContent = passwordInput.type === 'password' ? 'Show' : 'Hide';
    });
    toggleConfirmPassword?.addEventListener('click', () => {
        confirmPasswordInput.type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
        toggleConfirmPassword.textContent = confirmPasswordInput.type === 'password' ? 'Show' : 'Hide';
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('email').classList.add('error');
            document.querySelector('.error-text').textContent = 'Invalid email format';
            setTimeout(() => {
                document.getElementById('email').classList.remove('error');
                document.querySelector('.error-text').textContent = '';
            }, 500);
            return;
        }
        if (password.length < 6) {
            passwordInput.classList.add('error');
            document.querySelector('.error-text').textContent = 'Password must be at least 6 characters';
            setTimeout(() => {
                passwordInput.classList.remove('error');
                document.querySelector('.error-text').textContent = '';
            }, 500);
            return;
        }
        if (password !== confirmPassword) {
            confirmPasswordInput.classList.add('error');
            document.querySelector('.error-text').textContent = 'Passwords do not match';
            setTimeout(() => {
                confirmPasswordInput.classList.remove('error');
                document.querySelector('.error-text').textContent = '';
            }, 500);
            return;
        }
        user = { name, email };
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'login.html';
    });
}

// Initialize profile page
function initProfilePage() {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;
    const savedAddresses = document.getElementById('saved-addresses');
    savedAddresses.innerHTML = addresses.length ? addresses.map((addr, i) => `
        <div class="address-card fade-in">
            <p><strong>Address ${i + 1}:</strong> ${addr.fullName}, ${addr.address}, ${addr.city}, ${addr.postalCode}</p>
            <button onclick="deleteAddress(${i})">Delete</button>
        </div>
    `).join('') : '<p>No saved addresses</p>';
}

// Add new address (profile)
function addNewAddress() {
    const name = prompt('Enter full name:');
    const address = prompt('Enter address line 1:');
    const city = prompt('Enter city:');
    const postalCode = prompt('Enter postal code:');
    if (name && address && city && postalCode) {
        addresses.push({ fullName: name, address, city, postalCode });
        localStorage.setItem('addresses', JSON.stringify(addresses));
        initProfilePage();
    } else {
        alert('Please fill all address fields.');
    }
}

// Delete address (profile)
function deleteAddress(index) {
    if (confirm('Are you sure you want to delete this address?')) {
        addresses.splice(index, 1);
        localStorage.setItem('addresses', JSON.stringify(addresses));
        initProfilePage();
    }
}

// Global listeners
function initGlobalListeners() {
    document.addEventListener('click', (e) => {
        const searchResults = document.getElementById('search-results');
        const cartPreview = document.getElementById('cart-preview');
        const wishlistPreview = document.getElementById('wishlist-preview');
        const accountDropdown = document.querySelector('.account-dropdown');
        const addressPopup = document.querySelector('.address-popup');
        
        // Close dropdowns and popups if clicking outside
        if (!e.target.closest('.search-bar') && searchResults?.classList.contains('show')) {
            searchResults.classList.remove('show');
        }
        if (!e.target.closest('.cart') && cartPreview?.classList.contains('show')) {
            cartPreview.classList.remove('show');
        }
        if (!e.target.closest('.wishlist') && wishlistPreview?.classList.contains('show')) {
            wishlistPreview.classList.remove('show');
        }
        if (!e.target.closest('.account') && accountDropdown?.classList.contains('show')) {
            accountDropdown.classList.remove('show');
        }
        if (!e.target.closest('.popup-content') && addressPopup?.classList.contains('show') && !e.target.closest('.location')) {
            addressPopup.classList.remove('show');
        }

        // Handle search button click
        if (e.target.closest('.search-bar button')) {
            searchProducts();
        }

        // Handle sidebar sub-menu clicks
        if (e.target.closest('.sidebar a.has-sub-menu')) {
            e.preventDefault();
            const subMenu = e.target.nextElementSibling;
            if (subMenu) {
                subMenu.classList.toggle('active');
            }
        }
    });

    // Handle keyboard accessibility for search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }

    // Handle window resize for responsive adjustments
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            document.getElementById('sidebar')?.classList.remove('active');
            document.querySelectorAll('.footer-section').forEach(section => section.classList.remove('active'));
        }
    });

    // Handle scroll for back-to-top visibility
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });
}