// Aguarda o carregamento completo do conteúdo da página para executar o script
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona os elementos pelo ID
    const toggleBtn = document.getElementById('toggle-player-btn');
    const playerWrapper = document.getElementById('player-wrapper');
    const btnIcon = toggleBtn.querySelector('i'); // Seleciona o ícone dentro do botão

    // Verifica se os elementos existem na página para evitar erros
    if (toggleBtn && playerWrapper && btnIcon) {

        // Adiciona um "ouvinte" de evento de clique ao botão
        toggleBtn.addEventListener('click', () => {
            // Alterna a classe 'is-hidden' no invólucro do player.
            // Se a classe existe, ela é removida. Se não existe, ela é adicionada.
            playerWrapper.classList.toggle('is-hidden');

            // Atualiza o ícone do botão com base no estado do player
            if (playerWrapper.classList.contains('is-hidden')) {
                // Se o player está escondido, mostra a seta para cima
                btnIcon.classList.remove('fa-chevron-down');
                btnIcon.classList.add('fa-chevron-up');
            } else {
                // Se o player está visível, mostra a seta para baixo
                btnIcon.classList.remove('fa-chevron-up');
                btnIcon.classList.add('fa-chevron-down');
            }
        });
    }
});
