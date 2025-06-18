// Espera o DOM carregar para garantir que o Tone.js (se incluído) esteja pronto.
document.addEventListener('DOMContentLoaded', () => {

    // Verifica se a biblioteca Tone.js foi carregada no HTML.
    if (typeof Tone === 'undefined') {
        console.error("Tone.js não foi encontrado. Adicione o script da biblioteca ao seu HTML.");
        return;
    }

    // --- 1. Inicialização dos Sintetizadores (Geradores de Som) ---
    // Usamos o Tone.js para criar sons sem precisar de arquivos de áudio.

    // Som para quando o mouse passa por cima de um elemento.
    const hoverSound = new Tone.Synth({
        oscillator: {
            type: 'sine' // Onda sonora suave, ideal para um feedback sutil.
        },
        envelope: {
            attack: 0.005,
            decay: 0.1,
            sustain: 0.2,
            release: 0.1,
        },
    }).toDestination();
    hoverSound.volume.value = -24; // Volume baixo para não ser irritante.

    // Som para quando um elemento é clicado.
    const clickSound = new Tone.Synth({
        oscillator: {
            type: 'triangle' // Onda um pouco mais "brilhante" para um clique definido.
        },
        envelope: {
            attack: 0.005,
            decay: 0.2,
            sustain: 0,
            release: 0.1,
        },
    }).toDestination();
    clickSound.volume.value = -15;

    // --- 2. Seleção dos Elementos Interativos ---
    // Selecionamos todos os elementos que devem ter feedback sonoro.
    const elementsWithHoverSound = document.querySelectorAll(
        '.control-btn, .module-card, #search-bar, input[type="range"]'
    );

    const elementsWithClickSound = document.querySelectorAll(
        '.control-btn, .module-card'
    );


    // --- 3. Adicionando os Eventos de Som ---

    // Função para garantir que o contexto de áudio seja iniciado (necessário nos navegadores).
    const startAudioContext = () => {
        if (Tone.context.state !== 'running') {
            Tone.start();
        }
    };

    // Adiciona som ao passar o mouse por cima.
    elementsWithHoverSound.forEach(element => {
        element.addEventListener('mouseenter', () => {
            startAudioContext();
            hoverSound.triggerAttackRelease('C5', '16n'); // Toca uma nota Dó (C) aguda e curta.
        });
    });

    // Adiciona som de clique.
    elementsWithClickSound.forEach(element => {
        element.addEventListener('click', () => {
            startAudioContext();
            clickSound.triggerAttackRelease('G5', '16n'); // Toca uma nota Sol (G) aguda e curta.
            // O som de clique nos cards '.module-card' também serve como som de "transição".
        });
    });
});
