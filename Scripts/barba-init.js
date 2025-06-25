// Arquivo: Scripts/barba-init.js
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
    'DesignWeb-Hub', 'InfoBasica-Hub', 'Jogos-Hub', 'Matematica-Hub', 'Avaliacoes-Hub', 'Biologia-Hub', 'Historia-Hub', 'Cpp-Provas-Hub',
];

// Módulo da prova que está ativo no momento.
// Usamos isso para poder chamar a função de limpeza ao sair da página.
let activeQuizModule = null;

// Função para inicializar módulos dinâmicos
async function initializeDynamicModules(namespace) {
    // Carrega o jogo da Tabela-Verdade
    if (namespace === 'Arquitetura-Operacoes') {
        try {
            const gameModule = await import('https://hammesworth.github.io/Microspace/Scripts/Jogos_Internos/truth-table-game.js');
            gameModule.runGameInit();
        } catch (err) {
            console.error('Erro ao carregar o jogo da Tabela-Verdade:', err);
        }
    }

    // Carrega o motor da prova
    // Usamos .includes('Prova') para funcionar em "Cpp-While-Prova1", "Cpp-While-Prova2", etc.
    if (namespace.includes('Prova')) {
        try {
            // Importa o módulo e o armazena na variável 'activeQuizModule'
            activeQuizModule = await import('/provas.js'); // VERIFIQUE SE O CAMINHO ESTÁ CORRETO!
            // Chama a função de inicialização do motor, passando o namespace da página atual
            activeQuizModule.quizEngine.init(namespace);
        } catch (err) {
            console.error('Erro ao carregar o motor da prova:', err);
        }
    }
}

barba.init({
    debug: false,
    transitions: [{
        name: 'default-transition',
        leave: ({ current }) => {
            // Antes de sair, se um módulo de prova estava ativo, chama sua função de limpeza
            if (activeQuizModule && current.namespace.includes('Prova')) {
                activeQuizModule.quizEngine.cleanup();
                activeQuizModule = null; // Limpa a referência
            }
            return gsap.to(current.container, { opacity: 0, duration: 0.2 });
        },
        enter: ({ next }) => {
            next.container.style.opacity = 0; // Garante que o container comece invisível
            return gsap.to(next.container, { opacity: 1, duration: 0.2 });
        }
    }]
});

// Após cada transição de página
barba.hooks.afterEnter(({ next }) => {
    const namespace = next.namespace;
    const isHub = hubNamespaces.includes(namespace);
    configurePage(isHub ? 'page-hub' : 'page-content');

    // Inicializações genéricas
    triggerPageLoad();

    // Chama a função que carrega os módulos específicos da página
    initializeDynamicModules(namespace);
});

// Controle de tema (seu código original, sem alterações)
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn || toggleBtn.dataset.bound === "true") return;
    toggleBtn.dataset.bound = "true";

    function setTheme(mode) {
        document.body.classList.toggle('dark-mode', mode === 'dark');
        localStorage.setItem('theme', mode);
        toggleBtn.textContent = mode === 'dark' ? '☀️' : '🌙';
    }

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    setTheme(savedTheme || (prefersDark.matches ? 'dark' : 'light'));
    
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    toggleBtn.addEventListener('click', () => {
        setTheme(document.body.classList.contains('dark-mode') ? 'light' : 'dark');
    });
}


// Inicialização ao carregar o site pela primeira vez
document.addEventListener('DOMContentLoaded', () => {
    const initialNamespace = document.querySelector('[data-barba-namespace]')?.getAttribute('data-barba-namespace');
    if (initialNamespace) {
        const isHub = hubNamespaces.includes(initialNamespace);
        configurePage(isHub ? 'page-hub' : 'page-content');
        triggerPageLoad();
        initializeDynamicModules(initialNamespace);
    }
});