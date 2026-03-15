/**
 * 24h Fitness - Scripts Interativos
 * JavaScript Vanilla (sem dependências externas)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initCarousel();
  initCountUp();
  initSmoothScroll();
});

/* ========== Navbar - Efeito de Scroll ========== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  function handleNavbarScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();
}

/* ========== Menu Mobile (Hamburguer) ========== */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('navbar-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });

  // Fecha o menu ao clicar em um link
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Fecha o menu ao clicar fora dele
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ========== Animações de Scroll (IntersectionObserver) ========== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  if (!('IntersectionObserver' in window)) {
    // Fallback: mostra todos os elementos
    animatedElements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Adiciona delay escalonado para elementos em grid
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  // Adiciona delays escalonados para cards em grids
  const grids = document.querySelectorAll(
    '.diferenciais-grid, .servicos-grid, .aulas-grid, .planos-grid'
  );

  grids.forEach(grid => {
    const cards = grid.querySelectorAll('.fade-in');
    cards.forEach((card, index) => {
      card.dataset.delay = index * 100;
    });
  });

  animatedElements.forEach(el => observer.observe(el));
}

/* ========== Carrossel de Depoimentos ========== */
function initCarousel() {
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');

  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const slides = track.querySelectorAll('.depoimento-slide');
  const dots = dotsContainer.querySelectorAll('.carousel-dot');
  let currentIndex = 0;
  let autoplayInterval = null;

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Atualiza dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Autoplay
  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  // Event listeners
  prevBtn.addEventListener('click', () => {
    prevSlide();
    startAutoplay(); // Reinicia autoplay após interação
  });

  nextBtn.addEventListener('click', () => {
    nextSlide();
    startAutoplay();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index, 10);
      goToSlide(index);
      startAutoplay();
    });
  });

  // Suporte a swipe no mobile
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    startAutoplay();
  }, { passive: true });

  // Pausa autoplay no hover
  const carousel = document.getElementById('carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();
}

/* ========== Contagem Animada (Hero Stats) ========== */
function initCountUp() {
  const statNumbers = document.querySelectorAll('.hero-stat-number[data-count]');

  if (!statNumbers.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => observer.observe(el));
}

function animateCount(element) {
  const target = parseInt(element.dataset.count, 10);
  const duration = 2000; // 2 segundos
  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing: ease-out-cubic
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    const currentValue = Math.floor(easedProgress * target);

    // Formata o número com separador de milhar
    if (target >= 1000) {
      element.textContent = currentValue.toLocaleString('pt-BR') + '+';
    } else {
      element.textContent = currentValue + '+';
    }

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    }
  }

  requestAnimationFrame(updateCount);
}

/* ========== Smooth Scroll (Links Internos) ========== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      const navbarHeight = document.getElementById('navbar').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}
