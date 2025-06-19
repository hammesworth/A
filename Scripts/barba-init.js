// Scripts/barba-init.js

/**
 * Configura a classe do body e inicializa os scripts da página.
 * Esta função é o ponto central de controle após cada transição do Barba.
 * @param {string} pageType - A classe a ser aplicada ao body ('page-hub' ou 'page-content').
 */
function configurePage(pageType) {
    document.body.className = pageType;

    // Reinicializa os scripts necessários para a nova página.
    if (typeof initSearch === 'function') {
        initSearch();
    }
    
    // [SOLUÇÃO] Chama a função para reaplicar os efeitos sonoros.
    if (typeof initializeSoundEffects === 'function') {
        initializeSoundEffects();
    }
}

barba.init({
    debug: false,
    transitions: [{
        name: 'default-transition',
        leave: ({ current }) => gsap.to(current.container, { opacity: 0, duration: 0.2 }),
        enter: ({ next }) => gsap.from(next.container, { opacity: 0, duration: 0.2 })
    }],
    views: [
        // Adicione uma view para cada página do seu site, como já fizemos.
        { namespace: 'Hub-Principal',      afterEnter() { configurePage('page-hub'); } },
        { namespace: 'Cpp-Hub',            afterEnter() { configurePage('page-hub'); } },
        { namespace: 'ArquiteturaComp-Hub',afterEnter() { configurePage('page-hub'); } },
        { namespace: 'DesignWeb-Hub',      afterEnter() { configurePage('page-hub'); } },
        { namespace: 'InfoBasica-Hub',     afterEnter() { configurePage('page-hub'); } },
        { namespace: 'Jogos-Hub',          afterEnter() { configurePage('page-hub'); } },
        { namespace: 'Matematica-Hub',     afterEnter() { configurePage('page-hub'); } },
        // ... adicione seus outros Hubs
        
        { namespace: 'Cpp-Basico',         afterEnter() { configurePage('page-content'); } },
        { namespace: 'Cpp-WhileVetores',         afterEnter() { configurePage('page-content'); } },
        { namespace: 'Cpp-While',          afterEnter() { configurePage('page-content'); } }
        // ... adicione suas outras páginas de conteúdo
    ]
});
