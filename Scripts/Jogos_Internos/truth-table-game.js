// Arquivo: /Scripts/truth-table-game.js
// Módulo ES6 - Responsável por configurar o jogo da Tabela-Verdade

function initTabelaVerdade(container) {
    const corpoTabela = container.querySelector('#game-rows');
    const botaoVerificar = container.querySelector('#verificar-btn');
    const feedbackEl = container.querySelector('#feedback');

    if (botaoVerificar.dataset.listener === 'true') return;
    botaoVerificar.dataset.listener = 'true';

    const combinacoes = [
        [0, 0, 0], [0, 0, 1],
        [0, 1, 0], [0, 1, 1],
        [1, 0, 0], [1, 0, 1],
        [1, 1, 0], [1, 1, 1]
    ];

    const saidasCorretas = combinacoes.map(([A, B, C]) => ((A && B) || C) ? 1 : 0);

    function criarTabela() {
        corpoTabela.innerHTML = '';
        combinacoes.forEach(([a, b, c], i) => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${a}</td>
                <td>${b}</td>
                <td>${c}</td>
                <td>
                    <input 
                        type="text"
                        maxlength="1"
                        class="saida-input"
                        data-index="${i}"
                        style="width: 40px; text-align: center; border-radius: 5px; border: 1px solid #ccc; padding: 5px;"
                    >
                </td>
            `;
            corpoTabela.appendChild(linha);
        });
    }

    function verificarTabela() {
        const inputs = corpoTabela.querySelectorAll('.saida-input');
        let acertos = 0;

        inputs.forEach(input => {
            const i = parseInt(input.dataset.index);
            const valorUsuario = input.value.trim();
            input.style.backgroundColor = "";

            if (valorUsuario === "0" || valorUsuario === "1") {
                if (parseInt(valorUsuario) === saidasCorretas[i]) {
                    input.style.backgroundColor = "#d4edda";
                    acertos++;
                } else {
                    input.style.backgroundColor = "#f8d7da";
                }
            } else {
                input.style.backgroundColor = "#fff3cd";
            }
        });

        if (acertos === saidasCorretas.length) {
            feedbackEl.textContent = "🎉 Você acertou tudo! Parabéns!";
            feedbackEl.style.color = "green";
        } else {
            feedbackEl.textContent = `Você acertou ${acertos} de ${saidasCorretas.length}. Corrija os campos em vermelho.`;
            feedbackEl.style.color = "#d9534f";
        }
    }

    corpoTabela.addEventListener("input", (e) => {
        if (e.target.matches(".saida-input")) {
            e.target.value = e.target.value.replace(/[^01]/g, '');
        }
    });

    botaoVerificar.addEventListener("click", verificarTabela);
    criarTabela();
}

// Exporta a função principal de inicialização
export function runGameInit() {
    const gameContainer = document.querySelector('#truth-table-game');
    if (gameContainer) {
        initTabelaVerdade(gameContainer);
    }
}
