// Aguarda o conteúdo da página ser totalmente carregado
document.addEventListener('DOMContentLoaded', function() {
    
    const searchBar = document.getElementById('search-bar');
    if (!searchBar) return;

    // --- SETUP INICIAL DO DOM ---
    // Cria um container para a barra e os resultados para posicionamento relativo
    const container = document.createElement('div');
    container.className = 'search-container';
    searchBar.parentNode.insertBefore(container, searchBar);
    container.appendChild(searchBar);

    // Cria a caixa que mostrará os resultados
    const resultsBox = document.createElement('div');
    resultsBox.className = 'search-results-box';
    container.appendChild(resultsBox);

    // Cria o span para o texto do autocomplete
    const autocompleteSuggestionEl = document.createElement('span');
    autocompleteSuggestionEl.id = 'autocomplete-suggestion';
    container.appendChild(autocompleteSuggestionEl);

    // --- VARIÁVEIS DE ESTADO ---
    let searchTimeout;
    let currentSuggestion = '';
    let activeIndex = -1; // -1 significa nenhum item selecionado
    const navLinks = Array.from(document.querySelectorAll('nav a[href$=".html"]'));

    // --- FUNÇÕES PRINCIPAIS ---

    /**
     * Busca por um termo nos links de navegação e no conteúdo das páginas externas.
     * @param {string} query - O termo a ser buscado.
     * @returns {Promise<Array<{title: string, href: string}>>} - Uma lista de resultados.
     */
    async function performSearch(query) {
        if (query.length < 2) return [];

        const localItemsToFilter = document.querySelectorAll('.filterable-section, .module-card, main section');
        const allResults = [];

        // 1. Busca nos itens da PÁGINA ATUAL
        localItemsToFilter.forEach(item => {
            if (item.textContent.toLowerCase().includes(query)) {
                // Pega o primeiro h2 ou h3 como título
                const titleEl = item.querySelector('h2, h3');
                allResults.push({
                    title: `Nesta página: "${titleEl ? titleEl.textContent : 'Seção'}"`,
                    href: `#${item.id}`
                });
            }
        });

        // 2. Busca nos LINKS DE NAVEGAÇÃO e PÁGINAS EXTERNAS
        const externalSearchPromises = navLinks.map(async (link) => {
            const linkHref = link.getAttribute('href');
            const linkText = link.textContent;

            // Prioriza correspondência no nome do link
            if (linkText.toLowerCase().includes(query)) {
                return { title: linkText, href: linkHref };
            }

            // Evita buscar na própria página
            if (window.location.href.endsWith(linkHref)) return null;

            try {
                const response = await fetch(link.href);
                if (!response.ok) return null;
                const htmlText = await response.text();
                if (htmlText.toLowerCase().includes(query)) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(htmlText, 'text/html');
                    return { title: doc.querySelector('title')?.textContent || linkText, href: linkHref };
                }
            } catch (error) { console.error(`Erro ao buscar ${linkHref}:`, error); }
            return null;
        });

        const externalResults = (await Promise.all(externalSearchPromises)).filter(Boolean);
        allResults.push(...externalResults);
        
        // Remove duplicatas baseadas no href
        return allResults.reduce((acc, current) => {
            if (!acc.some(item => item.href === current.href)) {
                acc.push(current);
            }
            return acc;
        }, []);
    }

    /**
     * Renderiza os resultados da busca na caixa de resultados.
     * @param {Array<{title: string, href: string}>} results - A lista de resultados.
     */
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
        activeIndex = -1; // Reseta o índice ativo
        updateAutocompleteSuggestion(results);
    }
    
    /**
     * Atualiza o texto de sugestão do autocompletar.
     * @param {Array<{title: string, href: string}>} results - A lista de resultados.
     */
    function updateAutocompleteSuggestion(results) {
        const query = searchBar.value.toLowerCase();
        currentSuggestion = '';
        autocompleteSuggestionEl.textContent = '';

        if (query.length > 0) {
            // Encontra o primeiro resultado que começa com o texto digitado
            const suggestionResult = results.find(r => r.title.toLowerCase().startsWith(query));
            if (suggestionResult) {
                currentSuggestion = suggestionResult.title;
                // Mostra apenas a parte que completa o texto
                autocompleteSuggestionEl.textContent = searchBar.value + currentSuggestion.substring(query.length);
            }
        }
    }

    // --- EVENT LISTENERS ---

    searchBar.addEventListener('input', () => {
        // Usa debounce para não sobrecarregar com buscas a cada tecla digitada
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            const query = searchBar.value.toLowerCase();
            if (query) {
                const results = await performSearch(query);
                renderResults(results);
            } else {
                resultsBox.style.display = 'none';
                autocompleteSuggestionEl.textContent = '';
            }
        }, 250); // Atraso de 250ms
    });

    searchBar.addEventListener('focus', () => {
        // Mostra resultados se já houver texto ao focar
        if (searchBar.value) {
            resultsBox.style.display = 'block';
        }
    });

    searchBar.addEventListener('keydown', (e) => {
        const items = resultsBox.querySelectorAll('.search-result-item');
        if (items.length === 0 && e.key !== 'Tab') return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                activeIndex = (activeIndex + 1) % items.length;
                break;
            case 'ArrowUp':
                e.preventDefault();
                activeIndex = (activeIndex - 1 + items.length) % items.length;
                break;
            case 'Enter':
                e.preventDefault();
                if (activeIndex > -1) {
                    items[activeIndex].click(); // Simula o clique no item ativo
                }
                break;
            case 'Tab':
                if (currentSuggestion) {
                    e.preventDefault(); // Impede o comportamento padrão do Tab
                    searchBar.value = currentSuggestion;
                    autocompleteSuggestionEl.textContent = '';
                    // Dispara a busca novamente com o valor completo
                    searchBar.dispatchEvent(new Event('input', { bubbles:true }));
                }
                break;
            case 'Escape':
                resultsBox.style.display = 'none';
                break;
        }

        // Atualiza a classe 'active' para feedback visual
        items.forEach((item, index) => {
            item.classList.toggle('active', index === activeIndex);
        });
    });

    // Fecha a caixa de resultados se clicar fora dela
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            resultsBox.style.display = 'none';
        }
    });

});
