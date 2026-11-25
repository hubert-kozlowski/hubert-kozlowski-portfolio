const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('#nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.querySelector('.visually-hidden').textContent = isOpen ? 'Close navigation menu' : 'Open navigation menu';
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.querySelector('.visually-hidden').textContent = 'Open navigation menu';
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.querySelector('.visually-hidden').textContent = 'Open navigation menu';
      navToggle.focus();
    }
  });
}

const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && observedSections.length > 0) {
  const setActiveLink = (id) => {
    sectionLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) {
      setActiveLink(visible.target.id);
    }
  }, {
    rootMargin: '-30% 0px -55% 0px',
    threshold: [0, 0.15, 0.35, 0.6]
  });

  observedSections.forEach((section) => observer.observe(section));
}

const printButton = document.querySelector('#print-page');

if (printButton) {
  printButton.addEventListener('click', () => {
    window.print();
  });
}

window.addEventListener('beforeprint', () => {
  document.querySelectorAll('details').forEach((detail) => {
    detail.dataset.wasOpen = detail.open ? 'true' : 'false';
    detail.open = true;
  });
});

window.addEventListener('afterprint', () => {
  document.querySelectorAll('details').forEach((detail) => {
    detail.open = detail.dataset.wasOpen === 'true';
    delete detail.dataset.wasOpen;
  });
});
