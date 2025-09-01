// Array de productos - se cargará desde el HTML
let products = [];

// Variables globales
let filteredProducts = [...products];
let currentCategory = 'todos';

// Elementos del DOM (se inicializarán cuando el DOM esté listo)
let productsGrid;
let searchInput;
let filterButtons;
let productModal;
let modalBody;
let closeModal;

// Función de prueba para búsqueda
function testSearch() {
    console.log('=== PRUEBA DE BÚSQUEDA ===');
    
    console.log('Estado actual:');
    console.log('- searchInput:', searchInput);
    console.log('- products:', products);
    console.log('- filteredProducts:', filteredProducts);
    console.log('- productsGrid:', productsGrid);
    
    // Probar búsqueda
    if (searchInput) {
        searchInput.value = 'torno';
        console.log('Simulando búsqueda de "torno"');
        handleSearch();
    } else {
        console.error('searchInput no disponible');
    }
    
    console.log('=== FIN DE PRUEBA ===');
}

// Función de prueba para modal
function testModal() {
    console.log('=== PRUEBA DE MODAL ===');
    
    if (products.length > 0) {
        const firstProduct = products[0];
        console.log('Abriendo modal para:', firstProduct);
        viewProduct(firstProduct.id);
    } else {
        console.error('No hay productos para probar');
    }
    
    console.log('=== FIN DE PRUEBA ===');
}

// Inicialización
document.addEventListener('DOMContentLoaded', async function() {
    console.log('=== INICIALIZANDO CATÁLOGO ===');
    
    // Obtener elementos del DOM
    productsGrid = document.getElementById('productsGrid');
    searchInput = document.getElementById('searchInput');
    filterButtons = document.querySelectorAll('.filter-btn');
    productModal = document.getElementById('productModal');
    modalBody = document.querySelector('.modal-body');
    closeModal = document.querySelector('.close');
    
    console.log('Elementos del DOM:');
    console.log('- productsGrid:', productsGrid);
    console.log('- searchInput:', searchInput);
    console.log('- productModal:', productModal);
    
    // Configurar event listeners primero
    setupEventListeners();
    
    // Luego inicializar productos (ahora es async)
    await initializeProducts();
    
    console.log('=== INICIALIZACIÓN COMPLETADA ===');
});

// Configurar event listeners
function setupEventListeners() {
    console.log('Configurando event listeners');
    
    // Búsqueda
    if (searchInput) {
        console.log('Configurando búsqueda en:', searchInput);
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
            }
        });
        console.log('Event listeners de búsqueda configurados');
    } else {
        console.error('searchInput no encontrado para configurar event listeners');
    }
    
    // Filtros de categoría
    filterButtons.forEach(button => {
        button.addEventListener('click', handleCategoryFilter);
    });
    
    // Modal
    closeModal.addEventListener('click', closeProductModal);
    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeProductModal();
        }
    });
    

    
    // Navegación móvil
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
    
    // Smooth scrolling para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Cargar productos desde el HTML
function loadProductsFromHTML() {
    try {
        console.log('Cargando productos desde el HTML...');
        
        // Productos WPC definidos directamente
        products = [
            {
                id: 1,
                name: "Wpc interior nogal con fondo negro",
                description: "WPC (Wood Plastic Composite) para uso interior con acabado nogal y fondo negro. Material resistente y duradero ideal para revestimientos interiores.",
                image: "productos/Wpcinteriornogalconfondonegro.jpg",
                specifications: {
                    "Tipo": "WPC Interior",
                    "Acabado": "Nogal con fondo negro",
                    "Uso": "Interior",
                    "Material": "Wood Plastic Composite"
                }
            },
            {
                id: 2,
                name: "Wpc interior negro",
                description: "WPC (Wood Plastic Composite) para uso interior en color negro. Perfecto para revestimientos interiores modernos y elegantes.",
                image: "productos/Wpcinteriornegro.jpg",
                specifications: {
                    "Tipo": "WPC Interior",
                    "Color": "Negro",
                    "Uso": "Interior",
                    "Material": "Wood Plastic Composite"
                }
            },
            {
                id: 3,
                name: "Wpc exterior negro",
                description: "WPC (Wood Plastic Composite) para uso exterior en color negro. Resistente a la intemperie y perfecto para fachadas y revestimientos exteriores.",
                image: "productos/Wpcexteriornegro.jpg",
                specifications: {
                    "Tipo": "WPC Exterior",
                    "Color": "Negro",
                    "Uso": "Exterior",
                    "Material": "Wood Plastic Composite"
                }
            },
            {
                id: 4,
                name: "Wpc exterior nogal oscuro",
                description: "WPC (Wood Plastic Composite) para uso exterior con acabado nogal oscuro. Ideal para fachadas y revestimientos exteriores con apariencia de madera natural.",
                image: "productos/Wpcexteriornogaloscuro.jpg",
                specifications: {
                    "Tipo": "WPC Exterior",
                    "Acabado": "Nogal oscuro",
                    "Uso": "Exterior",
                    "Material": "Wood Plastic Composite"
                }
            }
        ];
        
        filteredProducts = [...products];
        
        console.log(`Productos WPC cargados exitosamente: ${products.length} productos`);
        
        // Guardar en localStorage como backup
        localStorage.setItem('catalogProducts', JSON.stringify(products));
        localStorage.setItem('catalogLastUpdate', new Date().toISOString());
        
        return true;
    } catch (error) {
        console.error('Error cargando productos desde HTML:', error);
        showNotification('Error cargando productos WPC.', 'error');
        return false;
    }
}

// Inicializar productos
function initializeProducts() {
    console.log('Inicializando productos WPC...');
    
    const success = loadProductsFromHTML();
    if (success) {
        // Los productos ya están en el HTML, no necesitamos renderizar
        console.log('Productos WPC inicializados correctamente');
    } else {
        // Mostrar mensaje de error en la interfaz
        if (productsGrid) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #dc3545; margin-bottom: 1rem;"></i>
                    <h3>Error cargando productos WPC</h3>
                    <p>No se pudieron cargar los productos WPC.</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        <i class="fas fa-refresh"></i> Reintentar
                    </button>
                </div>
            `;
        }
    }
}



// Renderizar productos
function renderProducts() {
    console.log('Renderizando productos');
    console.log('productsGrid:', productsGrid);
    console.log('filteredProducts:', filteredProducts);
    
    if (!productsGrid) {
        console.error('productsGrid no encontrado');
        return;
    }
    
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        console.log('No hay productos para mostrar');
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3>No se encontraron productos</h3>
                <p>Intenta ajustar los filtros o la búsqueda</p>
            </div>
        `;
        return;
    }
    
    console.log(`Renderizando ${filteredProducts.length} productos`);
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    console.log('Productos renderizados correctamente');
}

// Crear tarjeta de producto
function createProductCard(product) {
    console.log('Creando tarjeta para producto:', product);
    
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Determinar qué imagen mostrar
    let imageContent = '';
    if (product.hasMultipleImages && product.images && product.images.length > 0) {
        // Mostrar la primera imagen como principal, con indicador de múltiples imágenes
        imageContent = `
            <div class="product-image multiple-images">
                <img src="${product.images[0].base64}" alt="${product.name}" class="product-custom-image">
                <div class="image-counter">+${product.images.length - 1}</div>
            </div>
        `;
    } else if (product.hasCustomImage) {
        imageContent = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" class="product-custom-image">
            </div>
        `;
    } else {
        imageContent = `
            <div class="product-image">
                <i class="${product.image}"></i>
            </div>
        `;
    }
    
    card.innerHTML = `
        ${imageContent}
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-actions">
                ${product.hasMultipleImages && product.images && product.images.length > 0 ? `
                    <button class="btn btn-primary btn-small" onclick="openImageZoomFromCard(${product.id})">
                        <i class="fas fa-eye"></i> Ver Detalles
                    </button>
                ` : `
                    <button class="btn btn-primary btn-small" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye"></i> Ver Detalles
                    </button>
                `}
            </div>
        </div>
    `;
    
    console.log('Tarjeta creada correctamente');
    return card;
}

// Manejar búsqueda
function handleSearch() {
    console.log('Búsqueda iniciada');
    
    if (!searchInput) {
        console.error('searchInput no encontrado');
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    console.log('Término de búsqueda:', searchTerm);
    
    // Verificar si se escribió "abrir" para acceso administrativo
    if (searchTerm === 'abrir' || searchTerm === 'admin' || searchTerm === 'administrador') {
        showNotification('Acceso administrativo detectado. Abriendo panel...', 'info');
        setTimeout(() => {
            showAuthModal();
        }, 1000);
        return;
    }
    
    if (searchTerm === '') {
        console.log('Búsqueda vacía, mostrando todos los productos');
        filteredProducts = [...products];
    } else {
        console.log('Filtrando productos por término:', searchTerm);
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    console.log('Productos filtrados:', filteredProducts.length);
    renderProducts();
}



// Ver producto en modal
function viewProduct(productId) {
    console.log('=== ABRIENDO MODAL ===');
    console.log('Producto ID solicitado:', productId);
    console.log('Productos disponibles:', products);
    console.log('productModal elemento:', productModal);
    console.log('modalBody elemento:', modalBody);
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('❌ Producto no encontrado con ID:', productId);
        alert('Producto no encontrado');
        return;
    }
    
    console.log('✅ Producto encontrado:', product);
    
    // Crear contenido de imágenes
    let imageContent = '';
    if (product.hasMultipleImages && product.images && product.images.length > 0) {
        // Galería de múltiples imágenes
        imageContent = `
            <div class="image-gallery">
                <div class="gallery-thumbnails">
                    ${product.images.map((img, index) => `
                        <div class="gallery-thumbnail ${index === 0 ? 'active' : ''}" onclick="showImage(${index})">
                            <img src="${img.base64}" alt="${img.name}" title="${img.name}">
                        </div>
                    `).join('')}
                </div>
                <div class="main-image-container">
                    <img src="${product.images[0].base64}" alt="${product.name}" id="mainProductImage" class="main-product-image" onclick="openImageZoom()">
                    <div class="image-info">
                        <span class="image-name">${product.images[0].name}</span>
                        <span class="image-counter">1 / ${product.images.length}</span>
                    </div>
                </div>
                ${product.images.length > 1 ? `
                    <div class="image-navigation">
                        <button class="nav-btn prev" onclick="changeImage(-1)">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="nav-btn next" onclick="changeImage(1)">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    } else if (product.hasCustomImage) {
        imageContent = `
            <div class="modal-image">
                <img src="${product.image}" alt="${product.name}" class="product-modal-custom-image">
            </div>
        `;
    } else if (product.image && product.image.startsWith('productos/')) {
        // Imagen de producto WPC
        imageContent = `
            <div class="modal-image">
                <img src="${product.image}" alt="${product.name}" class="product-modal-image">
            </div>
        `;
    } else {
        imageContent = `
            <div class="modal-image">
                <i class="${product.image}"></i>
            </div>
        `;
    }
    
    modalBody.innerHTML = `
        <div class="product-modal">
            <div class="product-modal-header">
                <h2>${product.name}</h2>
            </div>
            <div class="product-modal-content">
                ${imageContent}
                <div class="product-modal-details">
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-specifications">
                        <h4>Especificaciones Técnicas:</h4>
                        <ul>
                            ${Object.entries(product.specifications).map(([key, value]) => 
                                `<li><strong>${key}:</strong> ${value}</li>`
                            ).join('')}
                        </ul>
                    </div>
                    
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="closeProductModal()">
                            <i class="fas fa-times"></i> Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Guardar referencia a las imágenes del producto actual
    window.currentProductImages = product.hasMultipleImages ? product.images : null;
    window.currentImageIndex = 0;
    
    console.log('Modal configurado, mostrando...');
    console.log('productModal:', productModal);
    console.log('modalBody.innerHTML length:', modalBody.innerHTML.length);
    
    if (productModal) {
        productModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('✅ Modal mostrado correctamente');
        console.log('Modal display style:', productModal.style.display);
    } else {
        console.error('❌ productModal no está disponible');
        alert('Error: Modal no disponible');
    }
}

// Cerrar modal
function closeProductModal() {
    productModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Limpiar variables globales
    window.currentProductImages = null;
    window.currentImageIndex = 0;
}

// Funciones para el modal de imagen ampliada
function openImageZoom() {
    if (!window.currentProductImages || window.currentImageIndex === undefined) return;
    
    const currentImage = window.currentProductImages[window.currentImageIndex];
    const imageZoomModal = document.getElementById('imageZoomModal');
    const imageZoomImage = document.getElementById('imageZoomImage');
    const imageZoomInfo = document.getElementById('imageZoomInfo');
    const imageZoomNav = document.getElementById('imageZoomNav');
    
    // Configurar imagen ampliada
    imageZoomImage.src = currentImage.base64;
    imageZoomInfo.innerHTML = `
        <strong>${currentImage.name}</strong><br>
        <small>${window.currentImageIndex + 1} / ${window.currentProductImages.length}</small>
    `;
    
    // Configurar navegación si hay múltiples imágenes
    if (window.currentProductImages.length > 1) {
        imageZoomNav.innerHTML = `
            <button class="nav-btn" onclick="changeZoomImage(-1)">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="nav-btn" onclick="changeZoomImage(1)">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
    } else {
        imageZoomNav.innerHTML = '';
    }
    
    // Mostrar modal
    imageZoomModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Función para abrir modal de imagen ampliada desde la tarjeta del producto
function openImageZoomFromCard(productId) {
    console.log('Abriendo modal de imagen ampliada para producto ID:', productId);
    
    const product = products.find(p => p.id === productId);
    if (!product || !product.hasMultipleImages || !product.images || product.images.length === 0) {
        console.error('Producto no encontrado o sin múltiples imágenes');
        return;
    }
    
    // Configurar variables globales para el modal
    window.currentProductImages = product.images;
    window.currentImageIndex = 0;
    
    // Abrir el modal de imagen ampliada
    openImageZoom();
}

function closeImageZoom() {
    const imageZoomModal = document.getElementById('imageZoomModal');
    imageZoomModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function changeZoomImage(direction) {
    if (!window.currentProductImages) return;
    
    let newIndex = window.currentImageIndex + direction;
    
    if (newIndex < 0) {
        newIndex = window.currentProductImages.length - 1;
    } else if (newIndex >= window.currentProductImages.length) {
        newIndex = 0;
    }
    
    // Cambiar imagen en el modal ampliado
    window.currentImageIndex = newIndex;
    const currentImage = window.currentProductImages[newIndex];
    const imageZoomImage = document.getElementById('imageZoomImage');
    const imageZoomInfo = document.getElementById('imageZoomInfo');
    
    imageZoomImage.src = currentImage.base64;
    imageZoomInfo.innerHTML = `
        <strong>${currentImage.name}</strong><br>
        <small>${newIndex + 1} / ${window.currentProductImages.length}</small>
    `;
    
    // Actualizar también la imagen en el modal principal
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = currentImage.base64;
    }
    
    // Actualizar galería activa
    const galleryThumbnails = document.querySelectorAll('.gallery-thumbnail');
    galleryThumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === newIndex);
    });
    
    // Actualizar contador en el modal principal
    const imageCounter = document.querySelector('.image-counter');
    const imageName = document.querySelector('.image-name');
    
    if (imageCounter) {
        imageCounter.textContent = `${newIndex + 1} / ${window.currentProductImages.length}`;
    }
    
    if (imageName) {
        imageName.textContent = currentImage.name;
    }
}

// Cerrar modal de imagen ampliada al hacer clic fuera
document.addEventListener('click', function(event) {
    const imageZoomModal = document.getElementById('imageZoomModal');
    if (event.target === imageZoomModal) {
        closeImageZoom();
    }
});

// Cerrar modal de imagen ampliada con tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeImageZoom();
    }
});

// Funciones para navegar entre imágenes
function showImage(index) {
    if (!window.currentProductImages || index < 0 || index >= window.currentProductImages.length) return;
    
    window.currentImageIndex = index;
    const mainImage = document.getElementById('mainProductImage');
    const imageCounter = document.querySelector('.image-counter');
    const imageName = document.querySelector('.image-name');
    
    if (mainImage) {
        mainImage.src = window.currentProductImages[index].base64;
    }
    
    if (imageCounter) {
        imageCounter.textContent = `${index + 1} / ${window.currentProductImages.length}`;
    }
    
    if (imageName) {
        imageName.textContent = window.currentProductImages[index].name;
    }
    
    // Actualizar galería activa
    const galleryThumbnails = document.querySelectorAll('.gallery-thumbnail');
    galleryThumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function changeImage(direction) {
    if (!window.currentProductImages) return;
    
    let newIndex = window.currentImageIndex + direction;
    
    if (newIndex < 0) {
        newIndex = window.currentProductImages.length - 1;
    } else if (newIndex >= window.currentProductImages.length) {
        newIndex = 0;
    }
    
    showImage(newIndex);
}







// Mostrar notificación
function showNotification(message, type = 'info') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Estilos de la notificación
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        maxWidth: '300px',
        animation: 'slideInRight 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Función para recargar productos (útil para actualizaciones)
function reloadProducts() {
    console.log('Recargando productos WPC...');
    showNotification('Actualizando catálogo WPC...', 'info');
    
    const success = loadProductsFromHTML();
    if (success) {
        // Los productos ya están en el HTML, no necesitamos renderizar
        showNotification('Catálogo WPC actualizado correctamente', 'success');
    } else {
        showNotification('Error al actualizar el catálogo WPC', 'error');
    }
}

// Guardar productos en localStorage
function saveProductsToStorage() {
    localStorage.setItem('catalogProducts', JSON.stringify(products));
}

// Funciones para el panel de administrador
function addProduct(productData) {
    const newProduct = {
        id: Date.now(),
        ...productData,
        specifications: productData.specifications || {},
        stock: parseInt(productData.stock) || 0
    };
    
    products.push(newProduct);
    filteredProducts = [...products];
    renderProducts();
    saveProductsToStorage();
    
    // Actualizar contadores y estadísticas
    updateCategoryCounts();
    updateProductCounter();
    
    showNotification('Producto agregado correctamente', 'success');
}

function updateProduct(productId, productData) {
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        products[index] = { ...products[index], ...productData };
        filteredProducts = [...products];
        renderProducts();
        saveProductsToStorage();
        
        showNotification('Producto actualizado correctamente', 'success');
    }
}

function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        products = products.filter(p => p.id !== productId);
        filteredProducts = filteredProducts.filter(p => p.id !== productId);
        renderProducts();
        saveProductsToStorage();
        
        showNotification('Producto eliminado correctamente', 'success');
    }
}

// Animaciones CSS adicionales
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .product-modal {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
    
    .product-modal-header {
        border-bottom: 2px solid var(--primary-color);
        padding-bottom: 1rem;
    }
    
    .product-modal-content {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 2rem;
    }
    
    .product-modal-image {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8rem;
        color: var(--primary-color);
        background: var(--secondary-bg);
        border-radius: 12px;
        padding: 2rem;
        overflow: hidden;
        position: relative;
    }
    
    .product-modal-custom-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 12px;
    }
    
    .product-specifications {
        margin: 1.5rem 0;
    }
    
    .product-specifications ul {
        list-style: none;
        padding: 0;
    }
    
    .product-specifications li {
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-color);
    }
    
    .product-stock {
        font-size: 1.1rem;
        color: #666;
        margin-bottom: 1rem;
    }
    
    .no-products {
        text-align: center;
        padding: 3rem;
        grid-column: 1 / -1;
    }
    
    .no-products h3 {
        margin-bottom: 1rem;
        color: #666;
    }
    
    .no-products p {
        color: #999;
    }
    
    @media (max-width: 768px) {
        .product-modal-content {
            grid-template-columns: 1fr;
        }
        
        .product-modal-image {
            font-size: 4rem;
        }
        
        .product-modal-custom-image {
            max-height: 200px;
        }
    }
`;

document.head.appendChild(style);

// ===== SISTEMA DE ACCESO SECRETO AL ADMIN =====

// Contraseña del admin (primera capa de seguridad - acceso secreto)
const ADMIN_PASSWORD = "1990";

// Variables para el modal de autenticación
let authModal, authForm, adminPasswordInput, authClose, authCancel;

// Inicializar sistema de acceso secreto
function initializeSecretAccess() {
    // Obtener elementos del modal de autenticación
    authModal = document.getElementById('authModal');
    authForm = document.getElementById('authForm');
    adminPasswordInput = document.getElementById('adminPassword');
    authClose = document.querySelector('.auth-close');
    authCancel = document.querySelector('.auth-cancel');
    
    // Configurar event listeners
    if (authForm) {
        authForm.addEventListener('submit', handleAuthSubmit);
    }
    
    if (authClose) {
        authClose.addEventListener('click', closeAuthModal);
    }
    
    if (authCancel) {
        authCancel.addEventListener('click', closeAuthModal);
    }
    
    // Cerrar modal al hacer clic fuera
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                closeAuthModal();
            }
        });
    }
    
    // Configurar combinación de teclas secreta (Ctrl + Shift + A)
    document.addEventListener('keydown', handleSecretKeyCombination);
    
    // Verificar si ya se accedió al admin y mostrar el botón
    checkAdminAccess();
}

// Manejar combinación de teclas secreta
function handleSecretKeyCombination(e) {
    // Ctrl + Shift + A
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        showAuthModal();
    }
}

// Mostrar modal de autenticación
function showAuthModal() {
    if (authModal) {
        authModal.style.display = 'block';
        adminPasswordInput.focus();
        
        // Limpiar campo de contraseña
        adminPasswordInput.value = '';
        
        // Agregar clase para animación
        setTimeout(() => {
            authModal.classList.add('show');
        }, 10);
    }
}

// Cerrar modal de autenticación
function closeAuthModal() {
    if (authModal) {
        authModal.classList.remove('show');
        setTimeout(() => {
            authModal.style.display = 'none';
        }, 300);
    }
}

// Verificar si ya se accedió al admin
function checkAdminAccess() {
    const hasAccessedAdmin = localStorage.getItem('adminAccessed');
    const adminLink = document.querySelector('.admin-link');
    
    if (hasAccessedAdmin === 'true' && adminLink) {
        // Mostrar el botón de admin
        adminLink.classList.add('visible');
        
        // Agregar event listener para el botón visible
        adminLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthModal();
        });
    } else if (adminLink) {
        // Ocultar enlace admin si no se ha accedido
        adminLink.classList.remove('visible');
    }
}

// Marcar que se accedió al admin
function markAdminAccessed() {
    const wasFirstTime = !localStorage.getItem('adminAccessed');
    localStorage.setItem('adminAccessed', 'true');
    
    if (wasFirstTime) {
        showNotification('Panel de administrador habilitado. El botón estará visible en futuras visitas.', 'success');
    }
    
    checkAdminAccess();
}

// Resetear acceso al admin
function resetAdminAccess() {
    if (confirm('¿Estás seguro de que quieres ocultar el botón de administrador? Podrás volver a acceder usando Ctrl + Shift + A.')) {
        localStorage.removeItem('adminAccessed');
        checkAdminAccess();
        closeAuthModal();
        showNotification('Botón de administrador ocultado. Usa Ctrl + Shift + A para volver a acceder.', 'info');
    }
}

// Manejar envío del formulario de autenticación
function handleAuthSubmit(e) {
    e.preventDefault();
    
    const password = adminPasswordInput.value.trim();
    
    if (password === ADMIN_PASSWORD) {
        // Contraseña correcta - marcar acceso y redirigir
        markAdminAccessed();
        showNotification('Acceso autorizado. Redirigiendo...', 'success');
        setTimeout(() => {
            window.location.href = 'admin-access.html';
        }, 1500);
    } else {
        // Contraseña incorrecta
        showNotification('Contraseña incorrecta. Intente nuevamente.', 'error');
        adminPasswordInput.value = '';
        adminPasswordInput.focus();
        
        // Agregar efecto de shake
        authForm.classList.add('shake');
        setTimeout(() => {
            authForm.classList.remove('shake');
        }, 500);
    }
}

// Agregar efecto de shake para contraseña incorrecta
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .shake {
        animation: shake 0.5s ease-in-out;
    }
    
    .auth-modal.show {
        animation: fadeIn 0.3s ease-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
`;

document.head.appendChild(shakeStyle);

// Inicializar sistema de acceso secreto cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initializeSecretAccess();
}); 