/**
 * PEZOX CONTADORES - LOGICA INTERACTIVA CORPORATIVA
 * Estudio Contable en Mala, Cañete, Lima
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initPricingCalculator();
  initTeamFilters();
  initContactForm();
  initSmoothScroll();
});

/* ==========================================================================
   MENU MOVIL RESPONSIVE
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen
      ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
      : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
  });

  // Cerrar al hacer clic en un enlace
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      if (toggleBtn) {
        toggleBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      }
    });
  });
}

/* ==========================================================================
   CALCULADORA INTERACTIVA DE PRECIOS SEGÚN VENTAS
   ========================================================================== */
function initPricingCalculator() {
  const slider = document.getElementById('salesSlider');
  const salesValDisplay = document.getElementById('calcSalesVal');
  const planRecName = document.getElementById('calcRecPlan');
  const planRecPrice = document.getElementById('calcRecPrice');
  const whatsappQuoteBtn = document.getElementById('calcWhatsappBtn');

  if (!slider) return;

  const cardEmprendedor = document.getElementById('card-emprendedor');
  const cardPyme = document.getElementById('card-pyme');
  const cardCorporativo = document.getElementById('card-corporativo');

  function updateCalculator() {
    const sales = parseInt(slider.value, 10);
    const formattedSales = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      maximumFractionDigits: 0
    }).format(sales);

    if (salesValDisplay) {
      salesValDisplay.textContent = formattedSales + ' / mes';
    }

    // Resetear clases activas
    [cardEmprendedor, cardPyme, cardCorporativo].forEach(c => {
      if (c) c.classList.remove('featured');
    });

    let selectedPlan = '';
    let monthlyCost = '';
    let targetCard = null;

    if (sales <= 25000) {
      selectedPlan = 'Plan Emprendedor (Microempresa)';
      monthlyCost = 'S/ 180 / mes';
      targetCard = cardEmprendedor;
    } else if (sales <= 80000) {
      selectedPlan = 'Plan Crecimiento (Pyme Comercial)';
      monthlyCost = 'S/ 380 / mes';
      targetCard = cardPyme;
    } else {
      selectedPlan = 'Plan Corporativo & Proyectos';
      monthlyCost = 'S/ 750 / mes';
      targetCard = cardCorporativo;
    }

    if (targetCard) {
      targetCard.classList.add('featured');
    }

    if (planRecName) planRecName.textContent = selectedPlan;
    if (planRecPrice) planRecPrice.textContent = monthlyCost;

    if (whatsappQuoteBtn) {
      const msg = encodeURIComponent(
        `Hola PEZOX Contadores en Mala. Mis ventas mensuales estimadas son de aprox. ${formattedSales}. Deseo contratar el ${selectedPlan} (${monthlyCost}). ¿Podrían asesorarme?`
      );
      whatsappQuoteBtn.href = `https://wa.me/51987654321?text=${msg}`;
    }
  }

  slider.addEventListener('input', updateCalculator);
  updateCalculator(); // Ejecutar valor inicial
}

/* ==========================================================================
   FILTROS DE COLABORADORES Y EQUIPO
   ========================================================================== */
function initTeamFilters() {
  const filterBtns = document.querySelectorAll('.team-filter-btn');
  const teamCards = document.querySelectorAll('.team-card');

  if (!filterBtns.length || !teamCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      teamCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'todos' || filter === cat) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   FORMULARIO DE CONTACTO Y TOAST
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('consultationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value || 'Estimado cliente';
    const rubro = form.querySelector('[name="rubro"]')?.value || 'General';
    const phone = form.querySelector('[name="phone"]')?.value || '';
    const message = form.querySelector('[name="message"]')?.value || '';

    // Mostrar Toast de éxito
    showToast(`¡Gracias ${name}! Su solicitud para el rubro ${rubro} ha sido recibida con éxito.`);

    // Crear enlace directo a WhatsApp opcional
    const sendWsp = confirm(
      `¡Gracias ${name}!\n\nHemos registrado su consulta para PEZOX Contadores en Mala.\n\n¿Desea abrir WhatsApp ahora mismo para hablar directamente con el CPC de guardia?`
    );

    if (sendWsp) {
      const msg = encodeURIComponent(
        `Hola PEZOX Contadores. Mi nombre es ${name}. Mi negocio es del rubro: ${rubro}. Mi teléfono es: ${phone}. Consulta: ${message}`
      );
      window.open(`https://wa.me/51987654321?text=${msg}`, '_blank');
    }

    form.reset();
  });
}

function showToast(message) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d8af3a" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <div>
      <h5 style="font-weight:700; color:#fff; font-size:0.92rem; margin-bottom:2px;">Solicitud Registrada</h5>
      <p style="font-size:0.82rem; color:#cbd5e1;">${message}</p>
    </div>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ==========================================================================
   SCROLL SUAVE
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
