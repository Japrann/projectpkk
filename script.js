// Global Variables
let products = [];
let wishlist = [];
let currentSection = 'home';
let productIdCounter = 1;
let isLoggedIn = false;
let currentUser = null;

// User database with roles - load from localStorage or use defaults
function getUsers() {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        return JSON.parse(storedUsers);
    }
    
    // Default users
    const defaultUsers = [
        { username: 'admin', password: 'admin123', role: 'admin', displayName: 'Administrator', email: 'admin@umkm.com' },
        { username: 'user', password: 'user123', role: 'user', displayName: 'User', email: 'user@umkm.com' }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
    return defaultUsers;
}

let users = getUsers();

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadProductsFromStorage();
    loadWishlistFromStorage();
    checkLoginStatus();
    setupEventListeners();
    setupURLRouting();
    
    // Check URL path for direct access
    handleDirectAccess();
    
    updateWishlistCount();
}

// URL-based Routing
function setupURLRouting() {
    // Listen for browser back/forward
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.section) {
            showSection(event.state.section);
        } else {
            handleDirectAccess();
        }
    });
}

function handleDirectAccess() {
    const path = window.location.pathname;
    const hash = window.location.hash.substring(1);
    
    // Check for hash-based navigation first
    if (hash === 'login') {
        showSection('login');
        return;
    }
    
    if (hash === 'register') {
        if (isLoggedIn) {
            showSection(isLoggedIn && currentUser.role === 'admin' ? 'admin' : 'user');
            showNotification('Anda sudah login!', 'error');
        } else {
            showSection('register');
        }
        return;
    }
    
    // Check for /admin or /user in URL
    if (path.includes('/admin') || hash === 'admin') {
        if (!isLoggedIn) {
            showSection('login');
            showNotification('Silakan login terlebih dahulu untuk mengakses admin panel', 'error');
        } else if (currentUser && currentUser.role !== 'admin') {
            showSection('user');
            showNotification('Akses ditolak! Hanya admin yang bisa mengakses panel ini.', 'error');
        } else {
            showSection('admin');
        }
        return;
    }
    
    if (path.includes('/user') || hash === 'user') {
        if (!isLoggedIn) {
            showSection('login');
            showNotification('Silakan login terlebih dahulu', 'error');
        } else {
            showSection('user');
        }
        return;
    }
    
    // Default behavior
    if (!isLoggedIn) {
        showSection('home');
    } else {
        if (currentUser && currentUser.role === 'admin') {
            showSection('admin');
        } else {
            showSection('user');
        }
    }
}

function navigateToSection(sectionId) {
    // Update URL without page reload
    let url;
    if (sectionId === 'home') {
        url = '/';
    } else if (sectionId === 'login' || sectionId === 'register') {
        url = `#${sectionId}`;
    } else {
        url = `/${sectionId}`;
    }
    window.history.pushState({ section: sectionId }, '', url);
    showSection(sectionId);
}

// Event Listeners Setup
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            navigateToSection(targetId);
        });
    });

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Dark Mode Toggle
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

    // Login Form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Register Form
    document.getElementById('registerForm').addEventListener('submit', handleRegister);

    // Logout Buttons
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('userLogoutBtn').addEventListener('click', handleLogout);

    // Add Product Form
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);

    // HPP Calculator
    document.getElementById('hppCalculator').addEventListener('submit', calculateHPP);
    document.getElementById('resetCalculator').addEventListener('click', resetCalculator);

    // Search and Filter
    document.getElementById('searchInput').addEventListener('input', filterProducts);
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    document.getElementById('sortFilter').addEventListener('change', filterProducts);

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Section Navigation
function showSection(sectionId, updateURL = false) {
    // Check if user is logged in for protected sections
    const protectedSections = ['products', 'calculator', 'admin', 'user', 'about', 'product-detail'];
    const publicSections = ['home', 'login', 'register'];
    
    if (protectedSections.includes(sectionId) && !isLoggedIn) {
        showNotification('Silakan login terlebih dahulu untuk mengakses fitur ini', 'error');
        navigateToSection('home');
        return;
    }

    // Check role-based access
    if (sectionId === 'admin' && currentUser && currentUser.role !== 'admin') {
        showNotification('Akses ditolak! Hanya admin yang bisa mengakses panel ini.', 'error');
        navigateToSection('user');
        return;
    }

    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
    }

    // Update URL if requested
    if (updateURL) {
        const url = sectionId === 'home' ? '/' : `/${sectionId}`;
        window.history.pushState({ section: sectionId }, '', url);
    }

    // Update navigation active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });

    // Load products when navigating to products section
    if (sectionId === 'products') {
        loadAllProducts();
    }

    // Load admin dashboard when navigating to admin section
    if (sectionId === 'admin') {
        loadAdminDashboard();
        loadAdminProductsList();
    }

    // Load user dashboard when navigating to user section
    if (sectionId === 'user') {
        loadUserDashboard();
    }
}

// Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    const icon = document.querySelector('#darkModeToggle i');
    icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
}

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    document.querySelector('#darkModeToggle i').className = 'fas fa-sun';
}

// Product Management
function loadProductsFromStorage() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    } else {
        // Initialize with sample products
        products = [
            {
                id: productIdCounter++,
                name: 'Keripik Pisang Premium',
                price: 25000,
                category: 'makanan',
                description: 'Keripik pisang renyah dengan rasa original, tanpa pengawet, dibuat dari pisang pilihan.',
                image: null,
                whatsapp: '628123456789'
            },
            {
                id: productIdCounter++,
                name: 'Madu Murni Hutan',
                price: 85000,
                category: 'minuman',
                description: 'Madu murni dari hutan, bebas pestisida, kaya akan nutrisi dan enzim alami.',
                image: null,
                whatsapp: '628234567890'
            },
            {
                id: productIdCounter++,
                name: 'Tas Kulit Handmade',
                price: 350000,
                category: 'fashion',
                description: 'Tas kulit asli handmade, desain elegan, awet dan tahan lama.',
                image: null,
                whatsapp: '628345678901'
            },
            {
                id: productIdCounter++,
                name: 'Kerajinan Anyaman Bambu',
                price: 75000,
                category: 'kerajinan',
                description: 'Keranjang anyaman bambu tradisional, ramah lingkungan dan multifungsi.',
                image: null,
                whatsapp: '628456789012'
            }
        ];
        saveProductsToStorage();
    }
}

function saveProductsToStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    const featuredProducts = products.slice(0, 4); // Show first 4 products
    
    featuredContainer.innerHTML = '';
    
    if (featuredProducts.length === 0) {
        featuredContainer.innerHTML = '<p class="no-products">Belum ada produk yang ditambahkan</p>';
        return;
    }
    
    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        featuredContainer.appendChild(productCard);
    });
}

function loadAllProducts() {
    const allProductsContainer = document.getElementById('allProducts');
    allProductsContainer.innerHTML = '';
    
    if (products.length === 0) {
        allProductsContainer.innerHTML = '<p class="no-products">Belum ada produk yang ditambahkan</p>';
        return;
    }
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        allProductsContainer.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const isInWishlist = wishlist.includes(product.id);
    
    card.innerHTML = `
        <div class="product-image">
            ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '<i class="fas fa-box"></i>'}
        </div>
        <div class="product-info">
            <span class="product-category">${getCategoryLabel(product.category)}</span>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${formatCurrency(product.price)}</p>
            <p class="product-description">${product.description}</p>
            <div class="product-actions">
                <button class="product-btn btn-detail" onclick="showProductDetail(${product.id})">
                    <i class="fas fa-eye"></i> Detail
                </button>
                <button class="product-btn btn-wishlist ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const detailContainer = document.getElementById('productDetailContent');
    detailContainer.innerHTML = `
        <div class="product-detail-image">
            ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '<i class="fas fa-box"></i>'}
        </div>
        <div class="product-detail-info">
            <span class="product-category">${getCategoryLabel(product.category)}</span>
            <h2>${product.name}</h2>
            <p class="product-detail-price">${formatCurrency(product.price)}</p>
            <p class="product-detail-description">${product.description}</p>
            <a href="https://wa.me/${product.whatsapp}?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(product.name)}" 
               class="btn-contact" target="_blank">
                <i class="fab fa-whatsapp"></i> Hubungi Penjual
            </a>
        </div>
    `;
    
    showSection('product-detail');
}

function handleAddProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const price = parseInt(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const description = document.getElementById('productDescription').value;
    const image = document.getElementById('productImage').value;
    const whatsapp = document.getElementById('productWhatsApp').value;
    
    const newProduct = {
        id: productIdCounter++,
        name,
        price,
        category,
        description,
        image: image || null,
        whatsapp
    };
    
    products.push(newProduct);
    saveProductsToStorage();
    
    // Reset form
    document.getElementById('addProductForm').reset();
    
    // Show notification
    showNotification('Produk berhasil ditambahkan!');
    
    // Navigate to products section
    showSection('products');
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    
    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                             product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
    
    // Sort products
    switch(sortFilter) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    // Display filtered products
    const allProductsContainer = document.getElementById('allProducts');
    allProductsContainer.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        allProductsContainer.innerHTML = '<p class="no-products">Tidak ada produk yang ditemukan</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        allProductsContainer.appendChild(productCard);
    });
}

// Wishlist Management
function loadWishlistFromStorage() {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
        wishlist = JSON.parse(storedWishlist);
    }
}

function saveWishlistToStorage() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Produk dihapus dari wishlist');
    } else {
        wishlist.push(productId);
        showNotification('Produk ditambahkan ke wishlist');
    }
    
    saveWishlistToStorage();
    updateWishlistCount();
    
    // Refresh current view
    if (currentSection === 'products') {
        loadAllProducts();
    } else if (currentSection === 'home') {
        loadFeaturedProducts();
    }
}

function updateWishlistCount() {
    document.querySelector('.wishlist-count').textContent = wishlist.length;
}

// HPP Calculator
function calculateHPP(e) {
    e.preventDefault();
    
    const productName = document.getElementById('calcProductName').value;
    const quantity = parseInt(document.getElementById('calcQuantity').value);
    const rawMaterials = parseInt(document.getElementById('calcRawMaterials').value);
    const labor = parseInt(document.getElementById('calcLabor').value);
    const operational = parseInt(document.getElementById('calcOperational').value);
    const margin = parseInt(document.getElementById('calcMargin').value);
    
    // Validasi input
    if (quantity <= 0) {
        showNotification('Jumlah produksi harus lebih dari 0', 'error');
        return;
    }
    
    // Perhitungan
    const totalCost = rawMaterials + labor + operational;
    const hppPerUnit = totalCost / quantity;
    const recommendedPrice = hppPerUnit + (hppPerUnit * margin / 100);
    
    // Tampilkan hasil
    document.getElementById('totalCost').textContent = formatCurrency(totalCost);
    document.getElementById('hppPerUnit').textContent = formatCurrency(hppPerUnit);
    document.getElementById('recommendedPrice').textContent = formatCurrency(recommendedPrice);
    
    // Analisis
    let analysisText = '';
    if (margin < 20) {
        analysisText = 'Margin keuntungan Anda cukup rendah. Pertimbangkan untuk meningkatkan margin atau mengurangi biaya produksi.';
    } else if (margin >= 20 && margin <= 40) {
        analysisText = 'Margin keuntungan Anda sudah cukup baik. Harga jual ini kompetitif di pasar.';
    } else {
        analysisText = 'Margin keuntungan Anda tinggi. Pastikan harga jual masih kompetitif dengan produk sejenis.';
    }
    
    document.getElementById('analysisText').textContent = analysisText;
    
    // Tampilkan hasil section
    document.getElementById('calculatorResults').style.display = 'block';
    
    // Scroll ke hasil
    document.getElementById('calculatorResults').scrollIntoView({ behavior: 'smooth' });
}

function resetCalculator() {
    document.getElementById('hppCalculator').reset();
    document.getElementById('calculatorResults').style.display = 'none';
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function getCategoryLabel(category) {
    const labels = {
        'makanan': 'Makanan',
        'minuman': 'Minuman',
        'fashion': 'Fashion',
        'kerajinan': 'Kerajinan',
        'elektronik': 'Elektronik'
    };
    return labels[category] || category;
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    const icon = notification.querySelector('i');
    
    notificationText.textContent = message;
    
    // Set icon based on type
    if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
        notification.style.background = 'var(--danger-color)';
    } else {
        icon.className = 'fas fa-check-circle';
        notification.style.background = 'var(--success-color)';
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Authentication Functions
function checkLoginStatus() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        isLoggedIn = true;
        updateNavigation();
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Find user in database
    users = getUsers(); // Refresh users array
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        isLoggedIn = true;
        currentUser = {
            username: user.username,
            role: user.role,
            displayName: user.displayName
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showNotification(`Login berhasil! Selamat datang, ${user.displayName}`);
        updateNavigation();
        
        // Redirect to appropriate dashboard
        if (user.role === 'admin') {
            navigateToSection('admin');
        } else {
            navigateToSection('user');
        }
        
        // Reset form
        document.getElementById('loginForm').reset();
    } else {
        showNotification('Username atau password salah!', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const fullName = document.getElementById('regFullName').value.trim();
    
    // Validasi
    if (password !== confirmPassword) {
        showNotification('Password dan konfirmasi password tidak cocok!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password minimal 6 karakter!', 'error');
        return;
    }
    
    // Refresh users array
    users = getUsers();
    
    // Check if username already exists
    if (users.find(u => u.username === username)) {
        showNotification('Username sudah digunakan!', 'error');
        return;
    }
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        showNotification('Email sudah digunakan!', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        username: username,
        email: email,
        password: password,
        fullName: fullName,
        role: 'user',
        displayName: fullName,
        createdAt: new Date().toISOString()
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Reset form
    document.getElementById('registerForm').reset();
    
    showNotification('Registrasi berhasil! Silakan login dengan akun baru Anda.');
    
    // Redirect to login
    navigateToSection('login');
}

function handleLogout() {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    showNotification('Logout berhasil!');
    updateNavigation();
    navigateToSection('home');
}

function updateNavigation() {
    const loginLink = document.getElementById('loginLink');
    
    if (isLoggedIn) {
        if (currentUser && currentUser.role === 'admin') {
            loginLink.textContent = 'Admin';
            loginLink.setAttribute('href', '#admin');
        } else {
            loginLink.textContent = 'Dashboard';
            loginLink.setAttribute('href', '#user');
        }
    } else {
        loginLink.textContent = 'Login';
        loginLink.setAttribute('href', '#login');
    }
}

// User Functions
function loadUserDashboard() {
    document.getElementById('userTotalProducts').textContent = products.length;
    document.getElementById('userWishlistCount').textContent = wishlist.length;
    document.getElementById('userDisplayName').textContent = currentUser ? currentUser.displayName : 'User';
}

// Admin Functions
function loadAdminDashboard() {
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalWishlist').textContent = wishlist.length;
}

function loadAdminProductsList() {
    const tbody = document.getElementById('adminProductsList');
    tbody.innerHTML = '';
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-light);">Belum ada produk</td></tr>';
        return;
    }
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${getCategoryLabel(product.category)}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function deleteProduct(productId) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        products = products.filter(p => p.id !== productId);
        saveProductsToStorage();
        
        // Remove from wishlist if exists
        const wishlistIndex = wishlist.indexOf(productId);
        if (wishlistIndex > -1) {
            wishlist.splice(wishlistIndex, 1);
            saveWishlistToStorage();
            updateWishlistCount();
        }
        
        loadAdminProductsList();
        loadAdminDashboard();
        loadAllProducts();
        loadFeaturedProducts();
        
        showNotification('Produk berhasil dihapus');
    }
}

// Add error styles
const style = document.createElement('style');
style.textContent = `
    input.error, select.error, textarea.error {
        border-color: var(--danger-color) !important;
    }
    
    .no-products {
        text-align: center;
        color: var(--text-light);
        font-style: italic;
        padding: 2rem;
    }
`;
document.head.appendChild(style);
