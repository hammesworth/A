/* ==========================================================================
   SCRIPT UNIFICADO DO MENU - VERSÃO FINAL CORRIGIDA (menu-loader.js)
   - Carrega dinamicamente o HTML do menu.
   - Inicializa funcionalidades do menu (abrir/fechar, submenus).
   - INCLUI a lógica de troca de tema (claro/escuro).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const menuHtmlPath = 'Menu/menu.html';

    async function loadAndInitializeMenu() {

        // --- 1. CARREGAMENTO DO HTML DO MENU ---
        try {
            const response = await fetch(menuHtmlPath);
            if (!response.ok) throw new Error(`Status: ${response.status}`);
            const menuHTML = await response.text();
            document.body.insertAdjacentHTML('beforeend', menuHTML);
        } catch (error) {
            console.error('Microspace Error: Falha ao carregar o menu.html.', error);
            return;
        }

        // --- 2. SELEÇÃO DOS ELEMENTOS (APÓS O CARREGAMENTO) ---
        const hamburgerButton = document.getElementById('hamburgerButton');
        const sideMenu = document.getElementById('sideMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        const submenuToggles = document.querySelectorAll('.submenu-toggle');
        const themeToggleButton = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');

        if (!hamburgerButton || !sideMenu || !themeToggleButton) {
            console.error('Microspace Error: Elementos essenciais não encontrados após carregar o menu.');
            return;
        }
        
        // --- 3. FUNÇÕES DE CONTROLE (DEFINIÇÃO COMPLETA AQUI DENTRO) ---

        // CORREÇÃO: As definições completas das funções vêm para CÁ DENTRO.
        const toggleMenu = () => {
            const isMenuOpen = sideMenu.classList.contains('active');
            sideMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            hamburgerButton.classList.toggle('active');
            hamburgerButton.setAttribute('aria-expanded', !isMenuOpen);
            hamburgerButton.setAttribute('aria-label', isMenuOpen ? 'Abrir menu' : 'Fechar menu');
        };

        const toggleSubmenu = (event) => {
            event.preventDefault();
            const toggle = event.currentTarget;
            const submenu = toggle.nextElementSibling;
            const isSubmenuOpen = toggle.classList.contains('active');
            
            toggle.classList.toggle('active');
            toggle.setAttribute('aria-expanded', !isSubmenuOpen);

            if (submenu.style.maxHeight) {
                submenu.style.maxHeight = null;
            } else {
                submenu.style.maxHeight = submenu.scrollHeight + 'px';
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape' && sideMenu.classList.contains('active')) {
                toggleMenu();
            }
        };

        const setTheme = (mode) => {
            document.body.classList.toggle('dark-mode', mode === 'dark');
            localStorage.setItem('theme', mode);
            if (themeIcon) {
                themeIcon.textContent = mode === 'dark' ? '☀️' : '🌙';
            }
        };

        const initializeTheme = () => {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            const savedTheme = localStorage.getItem('theme');

            if (savedTheme) {
                setTheme(savedTheme);
            } else {
                setTheme(prefersDark.matches ? 'dark' : 'light');
            }
            
            // Adiciona o listener para mudanças no sistema operacional
            prefersDark.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) { // Só muda se o usuário não tiver uma preferência salva
                    setTheme(e.matches ? 'dark' : 'light');
                }
            });
        };

        // --- 4. VINCULAÇÃO DOS EVENT LISTENERS ---
        hamburgerButton.addEventListener('click', toggleMenu);
        menuOverlay.addEventListener('click', toggleMenu);
        document.addEventListener('keydown', handleEscapeKey);

        submenuToggles.forEach(toggle => {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.addEventListener('click', toggleSubmenu);
        });

        themeToggleButton.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark-mode');
            setTheme(isDark ? 'light' : 'dark');
        });

        // --- 5. INICIALIZAÇÃO ---
        initializeTheme();
        console.log('Microspace: Menu e Tema inicializados com sucesso.');
    }

    loadAndInitializeMenu();
});