// Scripts/sound-effects.js

document.addEventListener('DOMContentLoaded', () => {
    // Se Tone.js não estiver disponível, o script não faz nada.
    if (typeof Tone === 'undefined') {
        console.error("Tone.js não foi encontrado. Adicione o script da biblioteca ao seu HTML.");
        return;
    }

    // --- 1. Sintetizadores (criados apenas uma vez) ---
    const hoverSound = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0.2, release: 0.1 },
    }).toDestination();
    hoverSound.volume.value = -24;

    const clickSound = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.005, decay: 0.2, sustain: 0, release: 0.1 },
    }).toDestination();
    clickSound.volume.value = -15;

    // Função para iniciar o contexto de áudio de forma segura
    const startAudioContext = () => {
        if (Tone.context.state !== 'running') {
            Tone.start();
        }
    };

    // --- 2. Seletores dos Elementos ---
    // Uma lista de seletores CSS para os elementos que devem ter som.
    const hoverSelectors = '.control-btn, .module-card, #search-bar, input[type="range"], .page-content header nav a, .settings-btn';
    const clickSelectors = '.control-btn, .module-card, .page-content header nav a, .settings-btn';

    // --- 3. Delegação de Eventos ---
    // Anexamos os ouvintes ao body, que é um elemento permanente.

    // Evento de "passar o mouse"
    document.body.addEventListener('mouseenter', (event) => {
        // O método .closest() verifica se o elemento onde o mouse entrou
        // (ou um de seus pais) corresponde ao nosso seletor.
        if (event.target.closest(hoverSelectors)) {
            startAudioContext();
            hoverSound.triggerAttackRelease('C5', '16n');
        }
    }, true); // O 'true' melhora a captura do evento.

    // Evento de "clique"
    document.body.addEventListener('click', (event) => {
        if (event.target.closest(clickSelectors)) {
            startAudioContext();
            clickSound.triggerAttackRelease('G5', '16n');
        }
    });

    console.log("Sistema de efeitos sonoros inicializado com delegação de eventos.");
});
