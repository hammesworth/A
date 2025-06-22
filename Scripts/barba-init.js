// Arquivo: /Scripts/barba-init.js

function configurePage(pageType) {
    document.body.classList.remove('page-hub', 'page-content');
    document.body.classList.add(pageType);

    // Reinicializa os scripts necessários após cada transição do Barba
    if (typeof initThemeToggle === 'function') {
        // Esta chamada garante que o botão de tema funcione em todas as páginas
        initThemeToggle();
    }
    // Adicione outras reinicializações aqui se necessário
}

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

barba.hooks.afterEnter(({ next }) => {
    const namespace = next.namespace;
    const isHub = hubNamespaces.includes(namespace);
    configurePage(isHub ? 'page-hub' : 'page-content');
});

// A função de troca de tema, agora com a lógica do iframe integrada
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    // NOVO: Referência ao iframe do player
    const playerIframe = document.getElementById('meu-player-de-musica');

    if (!toggleBtn) return;
    if (toggleBtn.dataset.bound === "true") return;

    function setTheme(mode) {
        document.body.classList.toggle('dark-mode', mode === 'dark');
        localStorage.setItem('theme', mode);
        toggleBtn.textContent = mode === 'dark' ? '☀️' : '🌙';
        
        // NOVO: Bloco que envia a mensagem para o iframe sempre que o tema muda
        if (playerIframe && playerIframe.contentWindow) {
            playerIframe.contentWindow.postMessage({ theme: mode }, '*');
        }
    }

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
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
    
    // NOVO: Listener para o carregamento do iframe, garante a sincronização inicial
    if (playerIframe) {
        playerIframe.addEventListener('load', () => {
            console.log("Iframe do player carregou. Enviando tema atual.");
            const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            // Re-chamar setTheme não é ideal aqui, vamos enviar a mensagem diretamente
            if (playerIframe.contentWindow) {
                 playerIframe.contentWindow.postMessage({ theme: currentTheme }, '*');
            }
        });
    }

    toggleBtn.dataset.bound = "true";
}

// Chama a inicialização principal no carregamento inicial da página
document.addEventListener('DOMContentLoaded', () => {
    // Como a função configurePage já chama initThemeToggle, podemos otimizar
    // Mas para garantir, vamos manter a chamada inicial aqui também.
    // O guard clause 'data-bound' previne problemas.
    configurePage('page-hub'); // Assume a primeira página é um hub, ajuste se necessário
});