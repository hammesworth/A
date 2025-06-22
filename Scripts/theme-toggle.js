// Arquivo: /Scripts/theme-toggle.js
// Agora é apenas uma função, sem auto-execução.
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const playerIframe = document.getElementById('meu-player-de-musica');
    
    // Se o código já foi iniciado, não faz nada. Evita duplicar listeners.
    if (toggleBtn.dataset.bound === 'true') return;

    console.log('[TEMA] Inicializando listeners de tema e iframe...');

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    function setTheme(mode) {
        document.body.classList.toggle('dark-mode', mode === 'dark');
        // Apenas salva a escolha no localStorage se ela for feita manualmente,
        // não quando é definida inicialmente pelo sistema. O clique faz isso.
        // localStorage.setItem('theme', mode); // Movido para o listener de clique
        toggleBtn.textContent = mode === 'dark' ? '☀️' : '🌙';

        if (playerIframe && playerIframe.contentWindow) {
            playerIframe.contentWindow.postMessage({ theme: mode }, '*');
        }
    }

    // Define o tema inicial baseado no localStorage ou preferência do sistema
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (prefersDark.matches ? 'dark' : 'light');
    setTheme(initialTheme);
    // Sincroniza o texto do botão com o tema inicial
    toggleBtn.textContent = initialTheme === 'dark' ? '☀️' : '🌙';


    // Listener de clique no botão
    toggleBtn.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        // Ao clicar, o usuário faz uma escolha explícita. Salve-a.
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    });

    // ========================================================================
    // NOVA ADIÇÃO: Listener para detectar mudanças no tema do sistema
    // ========================================================================
    prefersDark.addEventListener('change', (e) => {
        console.log('[TEMA] Preferência de tema do sistema alterada.');
        
        // Se o usuário já fez uma escolha manual (salva no localStorage), respeite-a.
        // Não fazemos nada se uma preferência explícita já existe.
        if (localStorage.getItem('theme')) {
            console.log('[TEMA] Escolha manual do usuário encontrada. Ignorando mudança do sistema.');
            return;
        }

        // Se não há escolha manual, aplica o tema do sistema.
        const newSystemTheme = e.matches ? 'dark' : 'light';
        console.log(`[TEMA] Aplicando tema do sistema: ${newSystemTheme}`);
        setTheme(newSystemTheme);
    });
    // ========================================================================


    // Listener para quando o iframe terminar de carregar
    if (playerIframe) {
        playerIframe.addEventListener('load', () => {
            console.log('[TEMA] Iframe carregado. Reenviando tema para garantir.');
            const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            // Usamos o postMessage diretamente para não alterar o localStorage
            if (playerIframe.contentWindow) {
                playerIframe.contentWindow.postMessage({ theme: currentTheme }, '*');
            }
        });
    }
    
    // Marca o botão para sabermos que a inicialização já ocorreu.
    toggleBtn.dataset.bound = 'true';
}