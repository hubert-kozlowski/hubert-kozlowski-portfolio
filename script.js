document.documentElement.classList.add('js');

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('#nav-links');

if (navToggle && navLinks) {
  const setMenuState = (isOpen) => {
    navLinks.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.querySelector('.visually-hidden').textContent = isOpen ? 'Close navigation menu' : 'Open navigation menu';
  };

  navToggle.addEventListener('click', () => {
    setMenuState(!navLinks.classList.contains('open'));
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      setMenuState(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navLinks.classList.contains('open')) {
      setMenuState(false);
      navToggle.focus();
    }
  });
}

const progressBar = document.querySelector('#scroll-progress-bar');
let progressFrame = 0;

const updateScrollProgress = () => {
  progressFrame = 0;
  if (!progressBar) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
  progressBar.style.transform = `scaleX(${progress})`;
};

const requestProgressUpdate = () => {
  if (!progressFrame) {
    progressFrame = requestAnimationFrame(updateScrollProgress);
  }
};

window.addEventListener('scroll', requestProgressUpdate, { passive: true });
window.addEventListener('resize', requestProgressUpdate);
updateScrollProgress();

const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const moduleLinks = [...document.querySelectorAll('[data-module-link]')];
const atlasLinks = [...document.querySelectorAll('[data-atlas-node]')];
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

let activeModule = '';

const setActiveModule = (id) => {
  if (!id || id === activeModule) return;
  activeModule = id;

  sectionLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  moduleLinks.forEach((link) => {
    const isActive = link.dataset.moduleLink === id;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  atlasLinks.forEach((link) => {
    const isActive = link.dataset.atlasNode === id;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  window.dispatchEvent(new CustomEvent('career-system:active-module', {
    detail: { id }
  }));
};

let activeFrame = 0;

const updateActiveModule = () => {
  activeFrame = 0;
  if (observedSections.length === 0) return;

  const marker = window.scrollY + window.innerHeight * 0.38;
  let currentId = '';

  observedSections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    if (sectionTop <= marker) {
      currentId = section.id;
    }
  });

  if (currentId) {
    setActiveModule(currentId);
  }
};

const requestActiveUpdate = () => {
  if (!activeFrame) {
    activeFrame = requestAnimationFrame(updateActiveModule);
  }
};

window.addEventListener('scroll', requestActiveUpdate, { passive: true });
window.addEventListener('resize', requestActiveUpdate);
updateActiveModule();

const revealItems = [...document.querySelectorAll('.reveal, .reveal-group')];

if (revealItems.length > 0) {
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.08
    });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
}

const commandDialog = document.querySelector('#command-menu');
const commandOpenButtons = [...document.querySelectorAll('[data-command-open]')];
const commandCloseButton = document.querySelector('[data-command-close]');
const commandFilter = document.querySelector('#command-filter');
const commandList = document.querySelector('#command-list');
const commandItems = commandList ? [...commandList.querySelectorAll('li')] : [];
let commandTrigger = null;
let restoreCommandFocus = true;
let commandEmptyState = null;

if (commandList && commandItems.length > 0) {
  commandEmptyState = document.createElement('p');
  commandEmptyState.className = 'command-empty';
  commandEmptyState.textContent = 'No destinations match your filter.';
  commandEmptyState.hidden = true;
  commandList.insertAdjacentElement('afterend', commandEmptyState);
}

const isCommandDialogOpen = () => commandDialog?.open === true;

const resetCommandFilter = () => {
  if (commandFilter) {
    commandFilter.value = '';
  }
  commandItems.forEach((item) => {
    item.hidden = false;
  });
  if (commandEmptyState) {
    commandEmptyState.hidden = true;
  }
};

const closeCommandMenu = ({ restoreFocus = true } = {}) => {
  if (!commandDialog || !isCommandDialogOpen()) return;
  restoreCommandFocus = restoreFocus;
  commandDialog.close();
};

const openCommandMenu = (trigger) => {
  if (!commandDialog) return;
  commandTrigger = trigger || commandOpenButtons[0] || null;
  restoreCommandFocus = true;
  resetCommandFilter();

  if (typeof commandDialog.showModal === 'function') {
    commandDialog.showModal();
  } else {
    commandDialog.setAttribute('open', '');
  }

  requestAnimationFrame(() => {
    commandFilter?.focus();
  });
};

commandOpenButtons.forEach((button) => {
  button.addEventListener('click', () => openCommandMenu(button));
});

if (commandCloseButton) {
  commandCloseButton.addEventListener('click', () => closeCommandMenu());
}

if (commandDialog) {
  commandDialog.addEventListener('click', (event) => {
    if (event.target === commandDialog) {
      closeCommandMenu();
    }
  });

  commandDialog.addEventListener('close', () => {
    if (restoreCommandFocus && commandTrigger) {
      commandTrigger.focus();
    }
    restoreCommandFocus = true;
  });

  commandDialog.addEventListener('cancel', () => {
    restoreCommandFocus = true;
  });
}

if (commandFilter) {
  commandFilter.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeCommandMenu();
    }
  });

  commandFilter.addEventListener('input', () => {
    const query = commandFilter.value.trim().toLowerCase();
    let visibleCount = 0;

    commandItems.forEach((item) => {
      const matches = !query || item.textContent.toLowerCase().includes(query);
      item.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    if (commandEmptyState) {
      commandEmptyState.hidden = visibleCount !== 0;
    }
  });
}

if (commandList) {
  commandList.addEventListener('click', (event) => {
    const item = event.target.closest('[data-command-item]');
    if (!item) return;

    if (item.matches('[data-print-action]')) {
      closeCommandMenu({ restoreFocus: false });
      window.setTimeout(() => window.print(), 80);
      return;
    }

    closeCommandMenu({ restoreFocus: false });
  });
}

document.addEventListener('keydown', (event) => {
  const isCommandShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
  if (!isCommandShortcut) return;

  event.preventDefault();
  if (isCommandDialogOpen()) {
    closeCommandMenu();
  } else {
    openCommandMenu(commandOpenButtons[0] || null);
  }
});

const platformIsApple = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
if (!platformIsApple) {
  document.querySelectorAll('.command-trigger kbd').forEach((kbd) => {
    kbd.textContent = 'Ctrl K';
  });
}

const printButtons = [...document.querySelectorAll('#print-page')];

printButtons.forEach((button) => {
  button.addEventListener('click', () => {
    window.print();
  });
});

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

const loadAtlas = () => {
  import('./atlas.js')
    .then((module) => {
      if (typeof module.initAtlas === 'function') {
        module.initAtlas();
      }
    })
    .catch((error) => {
      console.warn('Atlas enhancement unavailable.', error);
    });
};

if (document.querySelector('#atlas-canvas')) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(loadAtlas, { timeout: 1800 });
  } else {
    window.setTimeout(loadAtlas, 150);
  }
}
