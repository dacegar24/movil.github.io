/*
 * CHARITY - PLATAFORMA DE TRABAJO
 * Archivo JavaScript principal
 * 
 * Este archivo contiene las funciones comunes utilizadas en toda la aplicación,
 * incluyendo manejo de tiempo, navegación y utilidades generales.
 */

/**
 * Actualiza el reloj en tiempo real
 * Se ejecuta cada segundo para mostrar la hora actual
 */
function actualizarReloj() {
  const ahora = new Date();
  const hora = ahora.getHours().toString().padStart(2, '0');
  const minutos = ahora.getMinutes().toString().padStart(2, '0');
  const tiempoString = `${hora}:${minutos}`;
  
  // Buscar elementos de tiempo en todas las páginas
  const elementosTiempo = document.querySelectorAll('.time, #hora-actual');
  elementosTiempo.forEach(elemento => {
    elemento.textContent = tiempoString;
  });
}

/**
 * Inicializa el reloj cuando se carga la página
 * Configura la actualización automática cada segundo
 */
function inicializarReloj() {
  actualizarReloj(); // Actualización inmediata
  setInterval(actualizarReloj, 1000); // Actualización cada segundo
}

/**
 * Navega a una página específica
 * @param {string} pagina - Nombre del archivo HTML de destino
 */
function navegarA(pagina) {
  window.location.href = pagina;
}

/**
 * Valida si un campo de entrada está vacío
 * @param {string} valor - Valor del campo a validar
 * @returns {boolean} - True si está vacío, False si tiene contenido
 */
function campoVacio(valor) {
  return !valor || valor.trim() === '';
}

/**
 * Muestra un mensaje de alerta personalizado
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de mensaje ('success', 'error', 'warning')
 */
function mostrarMensaje(mensaje, tipo = 'info') {
  // Crear elemento de mensaje
  const mensajeDiv = document.createElement('div');
  mensajeDiv.className = `mensaje mensaje-${tipo}`;
  mensajeDiv.textContent = mensaje;
  
  // Estilos del mensaje
  mensajeDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    animation: slideInRight 0.3s ease-out;
  `;
  
  // Colores según el tipo
  switch (tipo) {
    case 'success':
      mensajeDiv.style.background = '#28a745';
      break;
    case 'error':
      mensajeDiv.style.background = '#dc3545';
      break;
    case 'warning':
      mensajeDiv.style.background = '#ffc107';
      mensajeDiv.style.color = '#212529';
      break;
    default:
      mensajeDiv.style.background = '#17a2b8';
  }
  
  // Agregar al DOM
  document.body.appendChild(mensajeDiv);
  
  // Remover después de 3 segundos
  setTimeout(() => {
    mensajeDiv.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (mensajeDiv.parentNode) {
        mensajeDiv.parentNode.removeChild(mensajeDiv);
      }
    }, 300);
  }, 3000);
}

/**
 * Formatea una fecha en formato legible
 * @param {Date} fecha - Fecha a formatear
 * @returns {string} - Fecha formateada como "DD/MM/YYYY, HH:MM"
 */
function formatearFecha(fecha) {
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear();
  const hora = fecha.getHours().toString().padStart(2, '0');
  const minutos = fecha.getMinutes().toString().padStart(2, '0');
  
  return `${dia}/${mes}/${año}, ${hora}:${minutos}`;
}

/**
 * Genera un ID único para elementos
 * @returns {string} - ID único basado en timestamp y número aleatorio
 */
function generarIdUnico() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Guarda datos en localStorage con manejo de errores
 * @param {string} clave - Clave para almacenar los datos
 * @param {any} datos - Datos a guardar
 * @returns {boolean} - True si se guardó correctamente, False si hubo error
 */
function guardarEnStorage(clave, datos) {
  try {
    localStorage.setItem(clave, JSON.stringify(datos));
    return true;
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
    mostrarMensaje('Error al guardar los datos', 'error');
    return false;
  }
}

/**
 * Recupera datos de localStorage con manejo de errores
 * @param {string} clave - Clave de los datos a recuperar
 * @param {any} valorPorDefecto - Valor a retornar si no se encuentran datos
 * @returns {any} - Datos recuperados o valor por defecto
 */
function obtenerDeStorage(clave, valorPorDefecto = null) {
  try {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : valorPorDefecto;
  } catch (error) {
    console.error('Error al obtener de localStorage:', error);
    return valorPorDefecto;
  }
}

/**
 * Valida un formulario verificando campos requeridos
 * @param {HTMLFormElement} formulario - Elemento del formulario a validar
 * @returns {boolean} - True si el formulario es válido, False si hay errores
 */
function validarFormulario(formulario) {
  const camposRequeridos = formulario.querySelectorAll('[required]');
  let esValido = true;
  
  camposRequeridos.forEach(campo => {
    if (campoVacio(campo.value)) {
      campo.style.borderColor = '#dc3545';
      esValido = false;
    } else {
      campo.style.borderColor = '';
    }
  });
  
  return esValido;
}

/**
 * Limpia los estilos de error de un formulario
 * @param {HTMLFormElement} formulario - Formulario a limpiar
 */
function limpiarErroresFormulario(formulario) {
  const campos = formulario.querySelectorAll('input, select, textarea');
  campos.forEach(campo => {
    campo.style.borderColor = '';
  });
}

/**
 * Inicialización cuando se carga el documento
 * Configura funciones básicas de la aplicación
 */
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar el reloj
  inicializarReloj();
  
  // Configurar navegación por teclado
  document.addEventListener('keydown', function(e) {
    // Escape para cerrar modales o paneles
    if (e.key === 'Escape') {
      const filtrosPanel = document.getElementById('filtros-panel');
      if (filtrosPanel && filtrosPanel.style.display === 'block') {
        toggleFiltros();
      }
    }
  });
  
  // Mostrar mensaje de bienvenida en la página principal
  if (window.location.pathname.includes('home.html') || window.location.pathname.endsWith('/')) {
    setTimeout(() => {
      mostrarMensaje('¡Bienvenido a Charity!', 'success');
    }, 1000);
  }
  
  // Inicializar gestos táctiles para móviles
  inicializarGestosTactiles();
  
  // Optimizar para dispositivos móviles
  optimizarParaMovil();
});

// Animaciones CSS para mensajes
const estilos = document.createElement('style');
estilos.textContent = `
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
`;
document.head.appendChild(estilos);

/**
 * Inicializa los gestos táctiles para dispositivos móviles
 * Permite navegación por swipe y gestos básicos
 */
function inicializarGestosTactiles() {
  let touchStartY = 0;
  let touchStartX = 0;
  let touchEndY = 0;
  let touchEndX = 0;

  // Detectar inicio del toque
  document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  // Detectar fin del toque
  document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    touchEndX = e.changedTouches[0].screenX;
    manejarGesto();
  }, { passive: true });

  /**
   * Maneja los gestos detectados
   * Swipe hacia arriba: refrescar página
   * Swipe hacia abajo: ir al inicio
   * Swipe izquierda/derecha: navegación
   */
  function manejarGesto() {
    const swipeThreshold = 50;
    const diffY = touchStartY - touchEndY;
    const diffX = touchStartX - touchEndX;
    
    // Solo procesar si el gesto es suficientemente largo
    if (Math.abs(diffY) > swipeThreshold || Math.abs(diffX) > swipeThreshold) {
      
      // Swipe vertical
      if (Math.abs(diffY) > Math.abs(diffX)) {
        if (diffY > 0) {
          // Swipe hacia arriba - Refrescar
          console.log('Swipe hacia arriba - Refrescando...');
          mostrarMensaje('Refrescando...', 'info');
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          // Swipe hacia abajo - Ir al inicio
          console.log('Swipe hacia abajo - Navegando al inicio');
          if (!window.location.pathname.includes('index.html') && !window.location.pathname.endsWith('/')) {
            window.location.href = 'index.html';
          }
        }
      }
      // Swipe horizontal
      else {
        if (diffX > 0) {
          // Swipe hacia la izquierda
          console.log('Swipe izquierda');
          // Aquí puedes añadir navegación específica
        } else {
          // Swipe hacia la derecha
          console.log('Swipe derecha');
          // Aquí puedes añadir navegación específica
        }
      }
    }
  }
}

/**
 * Detecta si el dispositivo es móvil
 * @returns {boolean} - True si es móvil, False si es desktop
 */
function esDispositivoMovil() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Optimiza la experiencia para dispositivos móviles
 * Ajusta elementos según el tipo de dispositivo
 */
function optimizarParaMovil() {
  if (esDispositivoMovil()) {
    // Añadir clase CSS para móviles
    document.body.classList.add('dispositivo-movil');
    
    // Prevenir zoom en inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.style.fontSize = '16px'; // Previene zoom en iOS
    });
    
    // Optimizar botones para touch
    const botones = document.querySelectorAll('button, .btn-index, .btn-auth');
    botones.forEach(boton => {
      boton.style.minHeight = '44px'; // Tamaño mínimo para touch
    });
  }
}

function validarLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Validación básica (solo para demostración)
  if (email === "Danielceron546@gmail.com" && password === "1234") {
    window.location.href = "home.html";
  } else {
    alert("Correo o contraseña incorrectos.");
  }

  return false; // evita que el formulario se recargue
}

document.addEventListener("DOMContentLoaded", () => {
  // Función para manejar "Me gusta"
  document.querySelectorAll(".btn-like").forEach(button => {
    button.addEventListener("click", () => {
      const counter = button.querySelector(".like-count");
      let current = parseInt(counter.textContent);
      counter.textContent = current + 1;
    });
  });

  // Mostrar/ocultar comentarios
  document.querySelectorAll(".btn-toggle-comments").forEach(button => {
    button.addEventListener("click", () => {
      const commentSection = button.nextElementSibling;
      commentSection.style.display =
        commentSection.style.display === "none" ? "block" : "none";
    });
  });

  // Agregar nuevos comentarios
  document.querySelectorAll(".btn-add-comment").forEach(button => {
    button.addEventListener("click", () => {
      const input = button.previousElementSibling;
      const text = input.value.trim();
      if (text !== "") {
        const commentList = button.parentElement.querySelector(".comment-list");
        const newComment = document.createElement("p");
        newComment.innerHTML = `<strong>Tú:</strong> ${text}`;
        commentList.appendChild(newComment);
        input.value = "";

        const count = button.parentElement.previousElementSibling.querySelector(".comment-count");
        count.textContent = parseInt(count.textContent) + 1;
      }
      
    });
  });
});

function actualizarHora() {
  const reloj = document.getElementById("hora-actual");
  const ahora = new Date();

  let horas = ahora.getHours().toString().padStart(2, '0');
  let minutos = ahora.getMinutes().toString().padStart(2, '0');

  reloj.textContent = `${horas}:${minutos}`;
}

// Mostrar hora al cargar
actualizarHora();

// Actualizar cada minuto
setInterval(actualizarHora, 60000);

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".chat-input input");
  const button = document.querySelector(".chat-input button");
  const messages = document.querySelector(".chat-messages");

  button.addEventListener("click", () => {
    const text = input.value.trim();
    if (text !== "") {
      const newMessage = document.createElement("div");
      newMessage.classList.add("message", "enviado");
      newMessage.textContent = text;
      messages.appendChild(newMessage);
      input.value = "";
      messages.scrollTop = messages.scrollHeight;
    }
  });
});

// Datos de ejemplo para simular resultados de búsqueda
const personas = [
  { nombre: "María López", ciudad: "Tula", intereses: "Voluntariado, salud" },
  { nombre: "Carlos Pérez", ciudad: "Pachuca", intereses: "Educación, deportes" }
];

const publicaciones = [
  { titulo: "Se busca voluntario para comedor", desc: "Ayuda en comedor comunitario los sábados." },
  { titulo: "Donación de ropa", desc: "Recibimos ropa en buen estado para familias necesitadas." }
];

const voluntarios = [
  { nombre: "Ana Torres", especialidad: "Psicología" },
  { nombre: "Luis Gómez", especialidad: "Enfermería" }
];

// Función para renderizar resultados
function renderResults(arr, container, type) {
  container.innerHTML = "";
  if (arr.length === 0) {
    container.innerHTML = "<p>No se encontraron resultados.</p>";
    return;
  }
  arr.forEach(item => {
    let html = "";
    if (type === "personas") {
      html = `<div class="search-item"><strong>${item.nombre}</strong><br><span>${item.ciudad}</span><br><small>Intereses: ${item.intereses}</small></div>`;
    } else if (type === "publicaciones") {
      html = `<div class="search-item"><strong>${item.titulo}</strong><br><span>${item.desc}</span></div>`;
    } else if (type === "voluntarios") {
      html = `<div class="search-item"><strong>${item.nombre}</strong><br><small>Especialidad: ${item.especialidad}</small></div>`;
    }
    container.innerHTML += html;
  });
}

// Inicializar con todos los resultados
document.addEventListener("DOMContentLoaded", () => {
  renderResults(personas, document.getElementById("personas-results"), "personas");
  renderResults(publicaciones, document.getElementById("publicaciones-results"), "publicaciones");
  renderResults(voluntarios, document.getElementById("voluntarios-results"), "voluntarios");

  // Tabs animadas
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  // Búsqueda en tiempo real
  document.getElementById("searchInput").addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    renderResults(
      personas.filter(p => p.nombre.toLowerCase().includes(q) || p.ciudad.toLowerCase().includes(q) || p.intereses.toLowerCase().includes(q)),
      document.getElementById("personas-results"),
      "personas"
    );
    renderResults(
      publicaciones.filter(p => p.titulo.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)),
      document.getElementById("publicaciones-results"),
      "publicaciones"
    );
    renderResults(
      voluntarios.filter(v => v.nombre.toLowerCase().includes(q) || v.especialidad.toLowerCase().includes(q)),
      document.getElementById("voluntarios-results"),
      "voluntarios"
    );
  });
});
