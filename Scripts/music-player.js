document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Seletores de Elementos e Constantes ---
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const volumeSlider = document.getElementById('volume-slider');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const trackTitleEl = document.getElementById('track-title');
    const trackArtistEl = document.getElementById('track-artist');
    
    // NOVO: Seletor para o ícone de volume, que será interativo
    const volumeIconStatus = document.getElementById('volume-icon-status');

    // NOVO: Constantes com o código SVG dos ícones de play e pause
    const playIconSVG = '<svg role="img" height="20" width="20" aria-hidden="true" viewBox="0 0 16 16" class="icon-play"><path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"></path></svg>';
    const pauseIconSVG = '<svg role="img" height="20" width="20" aria-hidden="true" viewBox="0 0 16 16" class="icon-pause"><path d="M2.7 1a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7H2.7zm8 0a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-2.6z"></path></svg>';

    // --- 2. Playlist ---
    const playlist = [
        { title: 'song 1', artist: 'Lu', src: '../Music/song1.mp3' },
        { title: 'Dreamer', artist: 'Hazy', src: '../Music/Dreamer.mp3' },
        { title: 'Sophie', artist: 'Lu', src: '../Music/Sophie.mp3' },
    ];

    let currentTrackIndex = 0;
    let isPlaying = false;
    let shuffledPlaylist = [...playlist];

    // --- 3. Lógica de Ordem Aleatória ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    shuffleArray(shuffledPlaylist);

    // --- 4. Funções do Player ---
    function loadTrack(trackIndex) {
        const track = shuffledPlaylist[trackIndex];
        trackTitleEl.textContent = track.title;
        trackArtistEl.textContent = track.artist;
        audioPlayer.src = track.src;
        audioPlayer.onloadedmetadata = () => {
            durationEl.textContent = formatTime(audioPlayer.duration);
            progressBar.max = audioPlayer.duration;
        };
    }

    // ALTERADO: Função de tocar atualiza o SVG do botão
    function playTrack() {
        isPlaying = true;
        playPauseBtn.innerHTML = pauseIconSVG; // Usa o SVG de pause
        audioPlayer.play().catch(error => console.log("O usuário precisa interagir com a página primeiro.", error));
    }

    // ALTERADO: Função de pausar atualiza o SVG do botão
    function pauseTrack() {
        isPlaying = false;
        playPauseBtn.innerHTML = playIconSVG; // Usa o SVG de play
        audioPlayer.pause();
    }
    
    function togglePlayPause() {
        isPlaying ? pauseTrack() : playTrack();
    }
    
    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + shuffledPlaylist.length) % shuffledPlaylist.length;
        loadTrack(currentTrackIndex);
        playTrack();
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % shuffledPlaylist.length;
        loadTrack(currentTrackIndex);
        playTrack();
    }

    function updateProgress() {
        progressBar.value = audioPlayer.currentTime;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }

    function setProgress(e) {
        audioPlayer.currentTime = e.target.value;
    }

    // ALTERADO: Função de volume agora atualiza o ícone
    function setVolume(e) {
        audioPlayer.volume = e.target.value;
        // Se o volume for maior que 0, mostra 🔊, senão mostra 🔇
        if (volumeIconStatus) {
             volumeIconStatus.textContent = audioPlayer.volume > 0 ? '🔊' : '🔇';
        }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // --- 5. Event Listeners ---
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextTrack);
    progressBar.addEventListener('input', setProgress);
    volumeSlider.addEventListener('input', setVolume);
    
    // NOVO: Listener para sincronização de tema com a página principal
    window.addEventListener('message', (event) => {
        if (event.data && event.data.theme) {
            document.body.setAttribute('data-theme', event.data.theme);
        }
    });

    // --- 6. Inicialização ---
    loadTrack(currentTrackIndex);
    audioPlayer.volume = volumeSlider.value;
    setVolume({ target: { value: audioPlayer.volume } }); // Garante que o ícone de volume inicial esteja correto
});

//--- 7. SINAL DE PRONTO PARA A PÁGINA PAI ---
// Avisa a página principal que o iframe terminou de carregar e está pronto para receber mensagens.
// Apenas ouve a mensagem da página pai e aplica o tema.
    window.addEventListener('message', (event) => {
        // Verificação de segurança básica
        if (event.source !== window.parent) return;

        if (event.data && typeof event.data.theme !== 'undefined') {
            console.log(`[PLAYER] Tema recebido: ${event.data.theme}`);
            document.body.setAttribute('data-theme', event.data.theme);
        }
    });