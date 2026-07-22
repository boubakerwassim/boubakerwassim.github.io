// ==================== DOM INITIALIZATION ==================== 
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

// ==================== NAVIGATION TOGGLE ==================== 
const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLAnchorElement)) return;

    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ==================== SMOOTH SCROLL BEHAVIOR ==================== 
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    if (href === '#' || href === '#top') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ==================== INTERSECTION OBSERVER FOR ANIMATIONS ==================== 
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px',
};

const observerCallback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animationName = entry.target.dataset.animate;
      entry.target.style.animationDuration = 'var(--transition-base)';
      entry.target.style.animationTimingFunction = 'ease-out';
      entry.target.style.animationFillMode = 'forwards';
      observer.unobserve(entry.target);
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

document.querySelectorAll('[data-animate]').forEach((el) => {
  observer.observe(el);
});

// ==================== PARALLAX SCROLL EFFECT ==================== 
const parallaxElements = document.querySelectorAll('[data-parallax]');

if (parallaxElements.length > 0) {
  window.addEventListener('scroll', () => {
    parallaxElements.forEach((el) => {
      const speed = el.dataset.parallax || 0.5;
      const yPos = window.scrollY * speed;
      el.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// ==================== SCROLL-TO-TOP BUTTON ==================== 
const scrollToTopBtn = document.querySelector('.footer__top');

if (scrollToTopBtn) {
  scrollToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ==================== ACTIVE NAVIGATION LINK ==================== 
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav__link');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach((item) => {
    item.classList.remove('active');
    const href = item.getAttribute('href');
    if (href === `#${current}`) {
      item.classList.add('active');
    }
  });
});

// ==================== KEYBOARD NAVIGATION ==================== 
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks?.classList.contains('is-open')) {
    navLinks.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
});

// ==================== COPY TO CLIPBOARD ==================== 
const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

emailLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    // Allow default behavior for actual email client opening
    // Could be enhanced with copy-to-clipboard fallback
  });
});

// ==================== PERFORMANCE OPTIMIZATION ==================== 
// Lazy load images if needed
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });
}

// ==================== PREFETCH LINKS ==================== 
// Prefetch URLs in nav links for faster navigation
if ('prefetch' in document) {
  const linkPrefetcher = () => {
    navItems.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#')) {
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = href;
        document.head.appendChild(prefetchLink);
      }
    });
  };

  // Prefetch on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', linkPrefetcher);
  } else {
    linkPrefetcher();
  }
}

// ==================== REDUCE MOTION SUPPORT ==================== 
// Respect user's motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--transition-fast', '0ms');
  document.documentElement.style.setProperty('--transition-base', '0ms');
  document.documentElement.style.setProperty('--transition-slow', '0ms');
  document.querySelectorAll('[style*="animation"]').forEach((el) => {
    el.style.animation = 'none';
  });
}

// ==================== DARK MODE DETECTION ==================== 
// Already in dark mode by default, but this detects system preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.style.colorScheme = 'dark';
}

// ==================== FORM VALIDATION ==================== 
const emailInput = document.querySelector('input[type="email"]');

if (emailInput) {
  emailInput.addEventListener('blur', () => {
    const email = emailInput.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    if (email && !isValid) {
      emailInput.setAttribute('aria-invalid', 'true');
    } else {
      emailInput.setAttribute('aria-invalid', 'false');
    }
  });
}

// ==================== UTILITIES ==================== 
// Utility function to check if element is in viewport
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Debounce function for scroll events
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

// ==================== CONSOLE MESSAGE ==================== 
console.log('%c🚀 Welcome to Wassim Boubaker\'s Portfolio', 'font-size: 18px; color: #3b82f6; font-weight: bold;');
console.log('%cQA Automation Engineer | Berlin, Germany', 'font-size: 12px; color: #cbd5e1;');


