// Scripts/barba-init.js (Versão Correta e Final)

function configurePage(pageType) {
    document.body.className = pageType;
    initSearch(); // Chama o script de busca para a nova página
}

// A lista de todos os seus namespaces que são do tipo "Hub"
const hubNamespaces = [
    'Hub-Principal', 
    'CppHub', 
    'ArquiteturaHub', 
    'Design_Web_Hub'
];

barba.init({
    debug: false,
    transitions: [{
        name: 'default-transition',
        leave: ({ current }) => gsap.to(current.container, { opacity: 0, duration: 0.2 }),
        enter: ({ next }) => gsap.from(next.container, { opacity: 0, duration: 0.2 })
    }],
    views: [
        // Adicione uma view para cada página do seu site, como já fizemos.
        { namespace: 'Hub-Principal', afterEnter() { configurePage('page-hub'); } },
        { namespace: 'CppHub', afterEnter() { configurePage('page-hub'); } },
        // ... adicione seus outros Hubs
        
        { namespace: 'Cpp-Basico', afterEnter() { configurePage('page-content'); } }
        // ... adicione suas outras páginas de conteúdo
    ]
});