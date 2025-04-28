// Base de datos de productos
const productos = [
    {
        id: 1,
        nombre: "Honda CBR 1000RR",
        precio: 15000,
        categoria: "deportivas",
        imagen: "img/moto1.jpg",
        descripcion: "La Honda CBR1000RR es una motocicleta deportiva de alto rendimiento con un motor de 1000cc que ofrece una potencia excepcional y un manejo preciso. Perfecta para pista y carretera."
    },
    {
        id: 2,
        nombre: "Yamaha MT-07",
        precio: 8500,
        categoria: "urbanas",
        imagen: "img/moto2.jpg",
        descripcion: "La Yamaha MT-07 combina un diseño agresivo con un motor bicilíndrico de 689cc que ofrece un par motor impresionante para la ciudad. Ideal para el día a día."
    },
    {
        id: 3,
        nombre: "Kawasaki Ninja 650",
        precio: 9500,
        categoria: "deportivas",
        imagen: "img/moto3.jpg",
        descripcion: "La Kawasaki Ninja 650 es una moto deportiva versátil con un motor bicilíndrico de 649cc, perfecta para carretera y ciudad con un diseño aerodinámico."
    },
    {
        id: 4,
        nombre: "Ducati Multistrada V4",
        precio: 22000,
        categoria: "aventura",
        imagen: "img/moto4.jpg",
        descripcion: "La Ducati Multistrada V4 es una moto de aventura con un motor V4 de 1158cc y tecnología avanzada para todo tipo de terrenos. La compañera perfecta para viajes largos."
    },
    {
        id: 5,
        nombre: "KTM 390 Duke",
        precio: 6500,
        categoria: "urbanas",
        imagen: "img/moto5.jpg",
        descripcion: "La KTM 390 Duke es una naked bike con un motor monocilíndrico de 373cc, ideal para la ciudad con un diseño agresivo y deportivo. Diversión garantizada."
    },
    {
        id: 6,
        nombre: "BMW R 1250 GS",
        precio: 18500,
        categoria: "aventura",
        imagen: "img/moto6.jpg",
        descripcion: "La BMW R 1250 GS es la reina de las motos de aventura con un motor boxer de 1254cc y tecnología innovadora para viajes largos. Confort y potencia combinados."
    }
];

// Ofertas especiales
const ofertas = [
    {
        id: 7,
        nombre: "Suzuki GSX-R750",
        precio: 12000,
        precioAnterior: 14000,
        categoria: "deportivas",
        imagen: "img/moto7.jpg",
        descripcion: "La Suzuki GSX-R750 es una moto deportiva legendaria con un motor de 750cc que ofrece un equilibrio perfecto entre potencia y manejo. Un clásico moderno."
    },
    {
        id: 8,
        nombre: "Harley-Davidson Street 750",
        precio: 9500,
        precioAnterior: 11000,
        categoria: "urbanas",
        imagen: "img/moto8.jpg",
        descripcion: "La Harley-Davidson Street 750 es una moto cruiser con un motor V-Twin de 749cc, perfecta para la ciudad con estilo clásico. Sonido y presencia inigualables."
    }
];

// Variables globales
let carrito = [];
const gridProductos = document.getElementById('gridProductos');
const carouselOfertas = document.querySelector('.carousel-inner');
const contadorCarrito = document.getElementById('contadorCarrito');
const btnCarrito = document.getElementById('btnCarrito');
const modalProducto = new bootstrap.Modal(document.getElementById('modalProducto'));
const modalCarrito = new bootstrap.Modal(document.getElementById('modalCarrito'));
const toastEl = document.getElementById('liveToast');
const toast = new bootstrap.Toast(toastEl);

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    mostrarProductos(productos);
    mostrarOfertas(ofertas);
    
    // Cargar carrito desde localStorage
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        actualizarContadorCarrito();
    }
    
    // Event listeners
    btnCarrito.addEventListener('click', mostrarCarrito);
    document.getElementById('btnVaciarCarrito').addEventListener('click', vaciarCarrito);
    document.getElementById('btnFinalizarCompra').addEventListener('click', finalizarCompra);
    
    // Filtros
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', filtrarProductos);
    });
});

// Mostrar productos
function mostrarProductos(productosMostrar) {
    gridProductos.innerHTML = '';
    
    productosMostrar.forEach(producto => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
            <div class="card card-producto h-100">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion.substring(0, 100)}...</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <p class="precio mb-0">$${producto.precio.toLocaleString()}</p>
                        <div>
                            <button class="btn btn-sm btn-outline-dark ver-detalle" data-id="${producto.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-danger agregar-carrito" data-id="${producto.id}">
                                <i class="fas fa-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        gridProductos.appendChild(col);
    });
    
    // Event listeners para los botones
    document.querySelectorAll('.agregar-carrito').forEach(btn => {
        btn.addEventListener('click', agregarAlCarrito);
    });
    
    document.querySelectorAll('.ver-detalle').forEach(btn => {
        btn.addEventListener('click', verDetalleProducto);
    });
}

// Mostrar ofertas en carousel
function mostrarOfertas(ofertasMostrar) {
    carouselOfertas.innerHTML = '';
    
    ofertasMostrar.forEach((oferta, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        item.innerHTML = `
            <div class="carousel-oferta p-4">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <img src="${oferta.imagen}" class="img-fluid rounded" alt="${oferta.nombre}">
                    </div>
                    <div class="col-md-6">
                        <h3>${oferta.nombre}</h3>
                        <p class="precio-anterior">Antes: $${oferta.precioAnterior.toLocaleString()}</p>
                        <p class="precio">Ahora: $${oferta.precio.toLocaleString()}</p>
                        <p>${oferta.descripcion}</p>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-dark ver-detalle" data-id="${oferta.id}">
                                <i class="fas fa-eye me-2"></i>Ver detalles
                            </button>
                            <button class="btn btn-danger agregar-carrito" data-id="${oferta.id}">
                                <i class="fas fa-cart-plus me-2"></i>Agregar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        carouselOfertas.appendChild(item);
    });
    
    // Event listeners para los botones de ofertas
    document.querySelectorAll('.carousel-oferta .agregar-carrito').forEach(btn => {
        btn.addEventListener('click', agregarAlCarrito);
    });
    
    document.querySelectorAll('.carousel-oferta .ver-detalle').forEach(btn => {
        btn.addEventListener('click', verDetalleProducto);
    });
}

// Filtrar productos
function filtrarProductos(e) {
    // Actualizar botones activos
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    const categoria = e.target.dataset.categoria;
    
    if (categoria === 'todas') {
        mostrarProductos(productos);
    } else {
        const productosFiltrados = productos.filter(p => p.categoria === categoria);
        mostrarProductos(productosFiltrados);
    }
}

// Agregar al carrito
function agregarAlCarrito(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    
    // Buscar producto en productos u ofertas
    let producto = productos.find(p => p.id === id) || ofertas.find(o => o.id === id);
    
    if (producto) {
        // Verificar si ya está en el carrito
        const itemExistente = carrito.find(item => item.id === id);
        
        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            carrito.push({...producto, cantidad: 1});
        }
        
        // Actualizar localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Actualizar UI
        actualizarContadorCarrito();
        
        // Mostrar notificación
        mostrarNotificacion(`${producto.nombre} agregado al carrito`);
    }
}

// Ver detalle del producto
function verDetalleProducto(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const producto = productos.find(p => p.id === id) || ofertas.find(o => o.id === id);
    
    if (producto) {
        // Configurar modal
        document.getElementById('modalProductoTitle').textContent = producto.nombre;
        
        const modalBody = document.getElementById('modalProductoBody');
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${producto.imagen}" class="img-fluid modal-producto-img" alt="${producto.nombre}">
                </div>
                <div class="col-md-6">
                    ${producto.precioAnterior ? 
                        `<p class="precio-anterior">Antes: $${producto.precioAnterior.toLocaleString()}</p>
                        <p class="precio">Ahora: $${producto.precio.toLocaleString()}</p>` : 
                        `<p class="precio">$${producto.precio.toLocaleString()}</p>`
                    }
                    <p>${producto.descripcion}</p>
                    <div class="mt-4">
                        <h5>Especificaciones</h5>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">Categoría: ${producto.categoria.charAt(0).toUpperCase() + producto.categoria.slice(1)}</li>
                            <li class="list-group-item">Garantía: 2 años</li>
                            <li class="list-group-item">Envío gratuito</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        // Configurar botón de agregar
        document.getElementById('btnAgregarModal').dataset.id = producto.id;
        document.getElementById('btnAgregarModal').onclick = agregarAlCarrito;
        
        // Mostrar modal
        modalProducto.show();
    }
}

// Mostrar carrito
function mostrarCarrito() {
    const carritoItems = document.getElementById('carritoItems');
    carritoItems.innerHTML = '';
    
    if (carrito.length === 0) {
        document.getElementById('modalCarritoBody').innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
                <h4>Tu carrito está vacío</h4>
                <p>Agrega algunos productos para comenzar</p>
            </div>
        `;
    } else {
        let total = 0;
        
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.imagen}" width="50" height="50" class="rounded me-3" alt="${item.nombre}">
                        <span>${item.nombre}</span>
                    </div>
                </td>
                <td>$${item.precio.toLocaleString()}</td>
                <td>
                    <div class="input-group input-group-sm" style="width: 120px;">
                        <button class="btn btn-outline-secondary disminuir-cantidad" type="button" data-id="${item.id}">-</button>
                        <input type="text" class="form-control text-center" value="${item.cantidad}" readonly>
                        <button class="btn btn-outline-secondary aumentar-cantidad" type="button" data-id="${item.id}">+</button>
                    </div>
                </td>
                <td>$${subtotal.toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger eliminar-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            carritoItems.appendChild(tr);
        });
        
        document.getElementById('carritoTotal').textContent = `$${total.toLocaleString()}`;
        
        // Event listeners para los botones del carrito
        document.querySelectorAll('.aumentar-cantidad').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                const item = carrito.find(item => item.id === id);
                if (item) {
                    item.cantidad++;
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    mostrarCarrito();
                    actualizarContadorCarrito();
                }
            });
        });
        
        document.querySelectorAll('.disminuir-cantidad').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                const item = carrito.find(item => item.id === id);
                if (item) {
                    if (item.cantidad > 1) {
                        item.cantidad--;
                    } else {
                        carrito = carrito.filter(item => item.id !== id);
                    }
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    mostrarCarrito();
                    actualizarContadorCarrito();
                }
            });
        });
        
        document.querySelectorAll('.eliminar-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                carrito = carrito.filter(item => item.id !== id);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarCarrito();
                actualizarContadorCarrito();
            });
        });
    }
    
    modalCarrito.show();
}

// Vaciar carrito
function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem('carrito');
    actualizarContadorCarrito();
    mostrarCarrito();
}

// Finalizar compra
function finalizarCompra() {
    if (carrito.length > 0) {
        // Aquí iría la lógica para procesar el pago
        // Por ahora solo mostramos un mensaje
        mostrarNotificacion('Compra realizada con éxito. ¡Gracias por tu compra!');
        vaciarCarrito();
        modalCarrito.hide();
    }
}

// Actualizar contador del carrito
function actualizarContadorCarrito() {
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    contadorCarrito.textContent = totalItems;
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
    document.getElementById('toastMessage').textContent = mensaje;
    toast.show();
}