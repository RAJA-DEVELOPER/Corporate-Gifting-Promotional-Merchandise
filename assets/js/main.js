/* ============================================================
   GiftCraft – Corporate Gifting & Promotional Merchandise
   Main JavaScript
   ============================================================ */

'use strict';

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', function () {
  initNavbar();
  initThemeToggle();
  initRTLToggle();
  initScrollAnimations();
  initBackToTop();
  initCounters();
  initHeroBg();
  initFileUpload();
  initFormValidation();
  initTabs();
  initCountdown();
  initMobileMenu();
  initGiftFilter();
  initArticleImage();
  initBlogCardLinks();
});

/* ── Navbar Scroll Behaviour ── */
function initNavbar() {
  const navbar = document.querySelector('.navbar-giftcraft');
  if (!navbar) return;

  const isLightBg = navbar.classList.contains('navbar-light-bg');

  function handleScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      if (isLightBg) navbar.classList.add('scrolled-light');
    } else {
      navbar.classList.remove('scrolled', 'scrolled-light');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ── Dark / Light Theme Toggle ── */
function initThemeToggle() {
  const toggleBtns = document.querySelectorAll('.btn-theme-toggle');
  if (!toggleBtns.length) return;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const saved = localStorage.getItem('giftcraft-theme');
  const current = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(current);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('giftcraft-theme', next);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
    btn.innerHTML = theme === 'dark'
      ? '<i class="bi bi-sun-fill"></i>'
      : '<i class="bi bi-moon-fill"></i>';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

/* ── RTL Toggle ── */
function initRTLToggle() {
  const toggleBtns = document.querySelectorAll('.btn-rtl-toggle');
  if (!toggleBtns.length) return;

  const savedDir = localStorage.getItem('giftcraft-dir') || 'ltr';
  applyDir(savedDir);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
      applyDir(next);
      localStorage.setItem('giftcraft-dir', next);
    });
  });
}

function applyDir(dir) {
  const safeDir = dir === 'rtl' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', safeDir);
  document.querySelectorAll('.btn-rtl-toggle').forEach(btn => {
    const label = btn.querySelector('.rtl-label');
    const text = safeDir === 'rtl' ? 'LTR' : 'RTL';
    if (label) label.textContent = text;
    else btn.textContent = text;
    btn.setAttribute('aria-label', safeDir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
  });
}

/* ── Scroll-triggered Animations ── */
function initScrollAnimations() {
  const targets = document.querySelectorAll('.fade-up, .fade-in');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ── Back To Top ── */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Animated Counters ── */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-counter'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = prefix + Math.round(eased * target).toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ── Hero Background Zoom ── */
function initHeroBg() {
  const bg = document.querySelector('.hero-bg');
  if (!bg) return;
  setTimeout(() => bg.classList.add('animated'), 100);
}

/* ── File Upload Zone ── */
function initFileUpload() {
  const zone = document.querySelector('.file-upload-zone');
  if (!zone) return;

  const input = zone.querySelector('input[type="file"]');

  zone.addEventListener('click', () => input && input.click());

  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    if (input && e.dataTransfer.files.length) {
      input.files = e.dataTransfer.files;
      updateFileLabel(zone, e.dataTransfer.files);
    }
  });

  if (input) {
    input.addEventListener('change', () => updateFileLabel(zone, input.files));
  }
}

function updateFileLabel(zone, files) {
  const label = zone.querySelector('.file-label');
  if (!label) return;
  if (files.length === 1) {
    const name = files[0].name;
    label.textContent = name.length > 42 ? `${name.slice(0, 39)}…` : name;
    label.title = name;
  } else if (files.length > 1) {
    label.textContent = `${files.length} files selected`;
    label.removeAttribute('title');
  }
}

/* ── Form Validation ── */
function initFormValidation() {
  const forms = document.querySelectorAll('.needs-validation');
  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');

      if (form.checkValidity()) {
        e.preventDefault();
        showFormSuccess(form);
      }
    });
  });
}

function showFormSuccess(form) {
  const existing = form.querySelector('.form-success-msg');
  if (existing) existing.remove();

  const msg = document.createElement('div');
  msg.className = 'form-success-msg';
  msg.innerHTML = '<i class="bi bi-check-circle me-2"></i>Thank you! Your enquiry has been submitted. We\'ll contact you within 24 hours.';
  form.appendChild(msg);

  setTimeout(() => { form.reset(); form.classList.remove('was-validated'); msg.remove(); }, 6000);
}

/* ── Tabs ── */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      const parent = btn.closest('[data-tabs-container]') || btn.parentElement.parentElement;

      btn.closest('.tab-nav-custom').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      parent.querySelectorAll('.tab-pane-custom').forEach(p => {
        p.style.display = p.id === target ? 'block' : 'none';
      });
    });
  });
}

/* ── Countdown Timer ── */
function initCountdown() {
  const countdowns = document.querySelectorAll('[data-countdown]');
  countdowns.forEach(el => {
    const target = new Date(el.getAttribute('data-countdown')).getTime();

    function update() {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        el.innerHTML = '<span class="countdown-number text-gold">Launched!</span>';
        return;
      }

      const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      function block(n, label) {
        return `<div class="countdown-block"><span class="countdown-number">${String(n).padStart(2,'0')}</span><span class="countdown-label">${label}</span></div>`;
      }

      el.innerHTML = block(days,'Days') + block(hours,'Hours') + block(minutes,'Mins') + block(seconds,'Secs');
    }

    update();
    setInterval(update, 1000);
  });
}

/* ── Mobile Menu ── */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const overlay = document.querySelector('.mobile-overlay');
  const close = document.querySelector('.mobile-menu-close');
  const menu = document.querySelector('.mobile-menu');

  if (!toggle || !menu) return;

  let previousOverflow = '';

  function syncToggleIcon() {
    const icon = toggle.querySelector('i');
    if (icon) icon.className = menu.classList.contains('open') ? 'bi bi-x-lg' : 'bi bi-list fs-4';
  }

  function openMenu() {
    previousOverflow = document.body.style.overflow;
    menu.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    syncToggleIcon();
  }
  function closeMenu() {
    menu.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = previousOverflow;
    syncToggleIcon();
  }

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('open')) closeMenu();
    else openMenu();
  });
  if (close) close.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && menu.classList.contains('open')) closeMenu();
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  // Sub-menu toggles in mobile
  menu.querySelectorAll('.mobile-nav-parent').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const sub = item.nextElementSibling;
      if (sub && sub.classList.contains('mobile-sub-menu')) {
        sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
        item.classList.toggle('open');
      }
    });
  });
}

/* ── Gift Category Filter ── */
function initGiftFilter() {
  const filterBtns = document.querySelectorAll('[data-filter-btn]');
  if (!filterBtns.length) return;

  const filterItems = document.querySelectorAll('[data-filter-item]');
  const countEl = document.getElementById('blog-filter-count');

  function applyFilter(filter) {
    filterBtns.forEach(btn => {
      const active = btn.getAttribute('data-filter-btn') === filter;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    let visible = 0;
    filterItems.forEach(item => {
      const show = filter === 'all' || item.getAttribute('data-filter-item') === filter;
      item.hidden = !show;
      item.style.display = show ? '' : 'none';
      if (show) {
        item.classList.add('visible');
        visible += 1;
      }
    });

    if (countEl) countEl.textContent = `${visible} article${visible === 1 ? '' : 's'}`;
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.getAttribute('data-filter-btn')));
  });

  const initial = document.querySelector('[data-filter-btn].active');
  applyFilter(initial ? initial.getAttribute('data-filter-btn') : 'all');
}

function initBlogCardLinks() {
  const page = window.location.pathname.split('/').pop();
  if (page !== 'blog.html' && page !== 'blog-details.html') return;

  document.querySelectorAll('a[href="blog-details.html"]').forEach(link => {
    const scope = link.classList.contains('btn-primary-custom')
      ? link.closest('.row')
      : (link.closest('.blog-card') || link.closest('.collection-showcase') || link);
    const image = scope.querySelector('img');
    if (!image) return;

    const match = image.src.match(/photo-\d+-[a-f0-9]+/);
    if (match) link.href = `blog-details.html?img=${match[0]}`;
  });

  if (page === 'blog.html') {
    document.querySelectorAll('.blog-card').forEach(card => {
      const link = card.querySelector('a[href^="blog-details.html"]');
      if (!link) return;

      card.classList.add('blog-card-clickable');
      card.setAttribute('role', 'link');
      card.setAttribute('tabindex', '0');

      card.addEventListener('click', event => {
        if (event.target.closest('a')) return;
        window.location.href = link.href;
      });

      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          window.location.href = link.href;
        }
      });
    });
  }
}

function initArticleImage() {
  const img = document.getElementById('article-featured-image');
  if (!img) return;

  const requested = new URLSearchParams(window.location.search).get('img');
  if (!requested || !/^photo-\d+-[a-f0-9]+$/.test(requested)) return;

  img.src = `https://images.unsplash.com/${requested}?w=1600&q=80`;
  img.alt = 'Selected article image';
}

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
document.addEventListener('mousemove', (e) => {
  if (!finePointer.matches || window.innerWidth < 768) return;
  document.querySelectorAll('.gift-card-3d').forEach(card => {
    if (card.hidden || card.offsetParent === null) return;
    const rect = card.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    if (e.clientX < rect.left - 40 || e.clientX > rect.right + 40 || e.clientY < rect.top - 40 || e.clientY > rect.bottom + 40) {
      card.style.transform = '';
      return;
    }
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const clamp = value => Math.max(-4, Math.min(4, value));
    const rotateX = clamp(((e.clientY - rect.top - cy) / cy) * -4);
    const rotateY = clamp(((e.clientX - rect.left - cx) / cx) * 4);
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
  });
});
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.gift-card-3d').forEach(card => {
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const bars = document.querySelectorAll('.progress-bar-custom[data-width]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const width = Number(e.target.getAttribute('data-width'));
        e.target.style.width = `${Number.isFinite(width) ? Math.max(0, Math.min(100, width)) : 0}%`;
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(b => { b.style.width = '0'; obs.observe(b); });
});

/* ── Notify bar dismiss ── */
const notifyClose = document.querySelector('.notify-close');
if (notifyClose) {
  notifyClose.addEventListener('click', () => {
    const bar = notifyClose.closest('.notify-bar');
    if (bar) bar.style.display = 'none';
  });
}
