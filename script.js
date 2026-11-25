document.documentElement.classList.add('js');

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('#nav-links');
let lastMenuTrigger = null;

function setMenu(open) {
  if (!navToggle || !navLinks) return;
  navLinks.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  if (open) lastMenuTrigger = document.activeElement;
}

navToggle?.addEventListener('click', () => {
  setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
});

navLinks?.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navLinks?.classList.contains('open')) {
    setMenu(false);
    if (lastMenuTrigger instanceof HTMLElement) lastMenuTrigger.focus();
  }
});

document.addEventListener('click', (event) => {
  if (!navLinks?.classList.contains('open')) return;
  if (!event.target.closest('.nav')) setMenu(false);
});

const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const byId = new Map(sectionLinks.map((link) => [link.getAttribute('href').slice(1), link]));
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    sectionLinks.forEach((link) => link.classList.remove('active'));
    byId.get(visible.target.id)?.classList.add('active');
  }, { rootMargin: '-20% 0px -62% 0px', threshold: [0.01, 0.15, 0.35] });
  sections.forEach((section) => observer.observe(section));
}

function printPage() {
  window.print();
}
document.querySelector('#print-page')?.addEventListener('click', printPage);
