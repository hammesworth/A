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

  // Lê o tema salvo ou detecta padrão do sistema
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
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
