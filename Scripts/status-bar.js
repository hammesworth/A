// Aguarda o conteúdo da página ser totalmente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // =================================================================================
    // CONFIGURAÇÃO IMPORTANTE: Chave da API de Clima
    // =================================================================================
    // Para obter os dados de clima, você precisa de uma chave de API gratuita do OpenWeatherMap.
    // 1. Crie uma conta em: https://openweathermap.org/
    // 2. Acesse a sua área de "API keys" e copie a chave padrão.
    // 3. Cole a sua chave abaixo, substituindo 'SUA_CHAVE_API_AQUI'.
    const WEATHER_API_KEY = '3c4c8d24bc981f803c3b95b51c1a5c3d'; 
    // =================================================================================

    // Seleciona o rodapé para adicionar a barra de status
    const footer = document.querySelector('footer');
    if (!footer) {
        console.error('Elemento <footer> não encontrado no documento.');
        return;
    }

    // Cria o container para a barra de status
    const statusBar = document.createElement('div');
    statusBar.id = 'status-bar';
    statusBar.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
    statusBar.style.fontSize = '1.1em';
    statusBar.style.color = 'var(--text-title)';
    statusBar.style.marginTop = '0';
    statusBar.style.marginBottom = '4px';
    statusBar.style.textAlign = 'center';
    statusBar.textContent = 'Carregando status...';

    // Adiciona a barra de status ao rodapé, antes do copyright
    const copyright = footer.querySelector('.copyright');
    if (copyright) {
        footer.insertBefore(statusBar, copyright);
    } else {
        footer.appendChild(statusBar);
    }

    /**
     * Retorna o emoji correspondente à fase da lua para a data atual.
     * O cálculo é uma aproximação baseada em ciclos lunares.
     * @returns {string} Emoji da fase da lua.
     */
    function getMoonPhaseEmoji() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        // Fórmula de cálculo aproximado da idade da lua
        let age = (((year - 2000) * 12.3685) + month + day) % 29.53058867;
        if (age < 0) age += 29.53058867;

        // Mapeia a idade da lua para um dos 8 emojis de fase
        if (age < 1.84566) return '🌑'; // Nova
        if (age < 5.53699) return '🌒'; // Crescente Côncava
        if (age < 9.22831) return '🌓'; // Quarto Crescente
        if (age < 12.91963) return '🌔'; // Crescente Gibosa
        if (age < 16.61096) return '🌕'; // Cheia
        if (age < 20.30228) return '🌖'; // Minguante Gibosa
        if (age < 23.99361) return '🌗'; // Quarto Minguante
        if (age < 27.68493) return '🌘'; // Minguante Côncava
        return '🌑'; // Nova
    }
    
    /**
     * Converte o código do clima da API em um emoji correspondente.
     * @param {string} weatherId - Código do clima (ex: "Clouds", "Rain").
     * @returns {string} Emoji do clima.
     */
    function getWeatherEmoji(weatherId) {
        const mainCondition = (weatherId || 'clear').toLowerCase();
        switch (mainCondition) {
            case 'thunderstorm': return '⛈️';
            case 'drizzle': return '🌦️';
            case 'rain': return '🌧️';
            case 'snow': return '🌨️';
            case 'mist': return '🌫️';
            case 'smoke': return '🌫️';
            case 'haze': return '🌫️';
            case 'dust': return '🌫️';
            case 'fog': return '🌫️';
            case 'sand': return 'Areia 🟨⁉️';
            case 'ash': return '🌫️';
            case 'squall': return '⛈️';
            case 'tornado': return '🌪️';
            case 'clear': return '☀️';
            case 'clouds': return '☁️';
            default: return '🌌';
        }
    }

    /**
     * Função principal que busca dados e atualiza a barra de status.
     */
    async function updateStatusBar() {
        // 1. Atualiza a Hora
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

        // 2. Obtém a Fase da Lua
        const moonPhase = getMoonPhaseEmoji();

        // 3. Obtém Clima e Temperatura (assíncrono)
        let weatherString = 'Clima indisponível 📍';

        // Verifica se a chave da API foi inserida
        if (WEATHER_API_KEY === 'SUA_CHAVE_API_AQUI' || !WEATHER_API_KEY) {
             console.warn('A chave da API do OpenWeatherMap não foi configurada.');
             weatherString = 'API Key necessária';
        } else if (navigator.geolocation) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });

                const { latitude, longitude } = position.coords;
                const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=pt_br`;
                
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
                
                const data = await response.json();
                const temp = Math.round(data.main.temp);
                const weatherEmoji = getWeatherEmoji(data.weather[0].main);

                weatherString = `${temp}°C ${weatherEmoji}`;

            } catch (error) {
                console.error("Erro ao obter dados de clima:", error);
                weatherString = 'Clima indisponível';
            }
        }
        
        // 4. Monta e exibe a string final na barra de status
        statusBar.textContent = `${timeString} · ${weatherString} · ${moonPhase}`
;
    }

    // Atualiza a barra de status imediatamente e depois a cada 10 segundos
    updateStatusBar();
    setInterval(updateStatusBar, 10000); // 10 segundos
});
