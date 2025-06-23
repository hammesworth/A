// Scripts/search.js (VERSÃO FINAL SIMPLIFICADA E UNIVERSAL)

// Variáveis para guardar a referência dos listeners e permitir a limpeza.
let inputListener, keydownListener, clickListener;

function initSearch() {
    const searchBar = document.getElementById('search-bar');
    if (!searchBar) return;

    const container = searchBar.closest('.search-container');
    const resultsBox = container.querySelector('.search-results-box');
    if (!container || !resultsBox) return;

    // --- LIMPEZA DE LISTENERS ANTIGOS ---
    // Garante que estamos começando do zero a cada nova página.
    searchBar.removeEventListener('input', inputListener);
    searchBar.removeEventListener('keydown', keydownListener);
    document.removeEventListener('click', clickListener);
    // ------------------------------------

    let searchableItems = [];

    // O "RADAR" UNIVERSAL: Mapeia tudo que é pesquisável na página atual.
    function mapSearchableItems() {
        searchableItems = [];
        const currentContainer = document.querySelector('[data-barba="container"]');
        if (!currentContainer) return;

        // Procura por links de Módulo E links de Navegação
        const links = currentContainer.querySelectorAll('a.module-card, a.nav-link');
        
        links.forEach(link => {
            // Pega o h3 se for um module-card, senão pega o texto do próprio link
            const titleEl = link.querySelector('h3');
            const title = (titleEl ? titleEl.textContent : link.textContent).trim().replace(/\s+/g, ' ');
            const href = link.getAttribute('href');
            
            if (title && href) {
                searchableItems.push({ title, href });
            }
        });
    }

    function getResults(query) {
        if (!query) return [];
        const lowerCaseQuery = query.toLowerCase();
        return searchableItems.filter(item => 
            item.title.toLowerCase().includes(lowerCaseQuery)
        );
    }

    function renderResults(results) {
        resultsBox.innerHTML = '';
        if (results.length === 0) {
            resultsBox.style.display = 'none';
            return;
        }
        results.forEach(result => {
            const item = document.createElement('a');
            item.className = 'search-result-item';
            item.textContent = result.title;
            item.href = result.href;
            resultsBox.appendChild(item);
        });
        resultsBox.style.display = 'block';
    }

    // Define as funções dos listeners
    inputListener = () => {
        const results = getResults(searchBar.value);
        renderResults(results);
    };

    keydownListener = (e) => {
        if (e.key === 'Escape') {
            resultsBox.style.display = 'none';
        }
        // A lógica de setas e Enter pode ser adicionada aqui se necessário
    };
    
    clickListener = (e) => {
        if (!container.contains(e.target)) {
            resultsBox.style.display = 'none';
        }
    };

    // Adiciona os novos listeners
    searchBar.addEventListener('input', inputListener);
    searchBar.addEventListener('keydown', keydownListener);
    document.addEventListener('click', clickListener);

    // Mapeia os itens da página atual.
    mapSearchableItems();
}