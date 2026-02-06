import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  initFiltering();
  initMobileMenu();
  initSmoothScroll();
  initScrollSpy();
  initCopyBibtex();
  initTabs();
});

/* ── Tag Filtering ── */
function initFiltering() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('.problem-card');
  const activeFilters = new Set();

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      if (filter === 'all') {
        activeFilters.clear();
        filterBtns.forEach(b => b.classList.remove('active-filter'));
        btn.classList.add('active-filter');
      } else {
        const allBtn = document.querySelector('[data-filter="all"]');
        allBtn?.classList.remove('active-filter');

        if (activeFilters.has(filter)) {
          activeFilters.delete(filter);
          btn.classList.remove('active-filter');
          if (activeFilters.size === 0) {
            allBtn?.classList.add('active-filter');
          }
        } else {
          activeFilters.add(filter);
          btn.classList.add('active-filter');
        }
      }

      applyFilters(cards, activeFilters);
    });
  });
}

function applyFilters(cards, activeFilters) {
  cards.forEach(card => {
    const tags = card.dataset.tags.split(' ');
    const visible = activeFilters.size === 0 || tags.some(t => activeFilters.has(t));
    card.classList.toggle('card-hidden', !visible);
  });

  // Show/hide phase sections based on whether they have visible cards
  document.querySelectorAll('.phase-section').forEach(section => {
    const visibleCards = section.querySelectorAll('.problem-card:not(.card-hidden)');
    section.style.display = visibleCards.length > 0 ? '' : 'none';
  });
}

/* ── Mobile Menu ── */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');

  toggle?.addEventListener('click', () => {
    menu?.classList.toggle('hidden');
  });

  menu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });
}

/* ── Smooth Scroll ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 24;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ── Scroll Spy for Nav ── */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('text-slate-900', isActive);
          link.classList.toggle('text-slate-500', !isActive);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ── Copy BibTeX ── */
function initCopyBibtex() {
  const btn = document.getElementById('copy-bibtex');
  const bibtex = document.getElementById('bibtex-content');

  btn?.addEventListener('click', () => {
    const text = bibtex?.textContent || '';
    navigator.clipboard.writeText(text).then(() => {
      const original = btn.innerHTML;
      btn.innerHTML = `<svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>Copied!`;
      setTimeout(() => { btn.innerHTML = original; }, 2000);
    });
  });
}

/* ── CTA Tabs ── */
function initTabs() {
  const tabBtns = document.querySelectorAll('[data-tab]');
  const tabPanels = document.querySelectorAll('[data-tab-panel]');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      tabBtns.forEach(b => {
        b.classList.toggle('tab-active', b.dataset.tab === tab);
      });

      tabPanels.forEach(panel => {
        panel.classList.toggle('hidden', panel.dataset.tabPanel !== tab);
      });
    });
  });
}
