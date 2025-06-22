// Aguarda o carregamento completo do conteúdo da página para executar o script
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona os elementos essenciais pelo ID
    const toggleBtn = document.getElementById('toggle-player-btn');
    const playerWrapper = document.getElementById('player-wrapper');

    // Verifica apenas se o botão e o player existem
    if (toggleBtn && playerWrapper) {

        // Adiciona o "ouvinte" de evento de clique ao botão
        toggleBtn.addEventListener('click', () => {
            // Simplesmente alterna a classe 'is-hidden' no player.
            // É o CSS que faz a mágica da animação.
            playerWrapper.classList.toggle('is-hidden');
        });
    }
});