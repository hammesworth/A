// Arquivo: Scripts/barba-init.js (Refatorado com Evento Customizado)
// Responsabilidade: Transições de página + carregamentos dinâmicos de scripts

function configurePage(pageType) {
    document.body.classList.remove('page-hub', 'page-content');
    document.body.classList.add(pageType);
    if (typeof initThemeToggle === 'function') {
        initThemeToggle();
    }
}

// Função para disparar o evento que inicializa os scripts genéricos da página.
function triggerPageLoad() {
    document.dispatchEvent(new CustomEvent('page:load'));
}

// Lista de namespaces que são hubs
const hubNamespaces = [
    'Hub-Principal', 'Cpp-Hub', 'ArquiteturaComp-Hub',
    'DesignWeb-Hub', 'InfoBasica-Hub', 'Jogos-Hub', 'Matematica-Hub'
];

barba.init({
    debug: false,
    transitions: [{
        name: 'default-transition',
        leave: ({ current }) => gsap.to(current.container, { opacity: 0, duration: 0.2 }),
        enter: ({ next }) => gsap.from(next.container, { opacity: 0, duration: 0.2 })
    }]
});

// Após cada transição de página
barba.hooks.afterEnter(async ({ next }) => {
    const namespace = next.namespace;
    const isHub = hubNamespaces.includes(namespace);
    configurePage(isHub ? 'page-hub' : 'page-content');

    // Inicializações genéricas
    triggerPageLoad();

    // 💡 Importa dinamicamente o script do jogo da tabela-verdade, se for a página correta
    if (namespace === 'Arquitetura-Operacoes') {
        try {
            const jogo = await import('/Scripts/Jogos_Internos/truth-table-game.js');
            jogo.runGameInit();
        } catch (err) {
            console.error('Erro ao carregar o jogo da Tabela-Verdade:', err);
        }
    }
});

// Controle de tema
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const playerIframe = document.getElementById('meu-player-de-musica');

    if (!toggleBtn || toggleBtn.dataset.bound === "true") return;
    toggleBtn.dataset.bound = "true";

    function setTheme(mode) {
        document.body.classList.toggle('dark-mode', mode === 'dark');
        localStorage.setItem('theme', mode);
        toggleBtn.textContent = mode === 'dark' ? '☀️' : '🌙';
        if (playerIframe && playerIframe.contentWindow) {
            playerIframe.contentWindow.postMessage({ theme: mode }, '*');
        }
    }

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

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

    if (playerIframe) {
        playerIframe.addEventListener('load', () => {
            const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            if (playerIframe.contentWindow) {
                playerIframe.contentWindow.postMessage({ theme: currentTheme }, '*');
            }
        });
    }
}

// Inicialização ao carregar o site pela primeira vez
document.addEventListener('DOMContentLoaded', () => {
    const initialNamespace = document.querySelector('[data-barba-namespace]')?.getAttribute('data-barba-namespace');
    const isHub = hubNamespaces.includes(initialNamespace);
    configurePage(isHub ? 'page-hub' : 'page-content');

    triggerPageLoad();

    // Também importa dinamicamente o jogo se já estiver na página certa no load inicial
    if (initialNamespace === 'Arquitetura-Operacoes') {
        import('/Scripts/Jogos_Internos/truth-table-game.js')
            .then(mod => mod.runGameInit())
            .catch(err => console.error('Erro ao carregar o jogo (inicial):', err));
    }
});
