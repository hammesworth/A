// Scripts/barba-init.js

function configurePage(pageType) {
  document.body.classList.remove('page-hub', 'page-content');
  document.body.classList.add(pageType);

  // Reaplica o tema salvo (se essa função existir)
  if (typeof applySavedTheme === 'function') {
    applySavedTheme();
  }

  // Reinicializa os scripts da página
  if (typeof initSearch === 'function') {
    initSearch();
  }

  if (typeof initializeSoundEffects === 'function') {
    initializeSoundEffects();
  }

  // Inicializa ou reinicializa o botão de troca de tema
  if (typeof initThemeToggle === 'function') {
    initThemeToggle();
  }
}

const hubNamespaces = [
  'Hub-Principal',
  'Cpp-Hub',
  'ArquiteturaComp-Hub',
  'DesignWeb-Hub',
  'InfoBasica-Hub',
  'Jogos-Hub',
  'Matematica-Hub'
];

barba.init({
  debug: false,
  transitions: [{
    name: 'default-transition',
    leave: ({ current }) => gsap.to(current.container, { opacity: 0, duration: 0.2 }),
    enter: ({ next }) => gsap.from(next.container, { opacity: 0, duration: 0.2 })
  }]
});

barba.hooks.afterEnter(({ next }) => {
  const namespace = next.namespace;
  const isHub = hubNamespaces.includes(namespace);
  configurePage(isHub ? 'page-hub' : 'page-content');
});

// Chama initThemeToggle no carregamento da página para ativar o botão logo na primeira carga
document.addEventListener('DOMContentLoaded', () => {
  if (typeof initThemeToggle === 'function') {
    initThemeToggle();
  }
});


function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  if (!toggleBtn) return;

  // Evita duplicar listeners
  if (toggleBtn.dataset.bound === "true") return;

  function setTheme(mode) {
    document.body.classList.toggle('dark-mode', mode === 'dark');
    localStorage.setItem('theme', mode);
    if (themeIcon) {
      themeIcon.textContent = mode === 'dark' ? '☀️' : '🌙';
    }
  }

  // Lê o tema salvo, só aceita valores válidos, senão usa preferência do sistema
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    setTheme(savedTheme);
  } else {
    setTheme(prefersDark.matches ? 'dark' : 'light');
  }

  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  toggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    setTheme(isDark ? 'light' : 'dark');
  });

  toggleBtn.dataset.bound = "true";
}
