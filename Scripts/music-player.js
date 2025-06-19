document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Seletores de Elementos do DOM ---
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playPauseIcon = playPauseBtn.querySelector('i');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    // O botão de shuffle foi removido, pois o modo aleatório agora é o padrão.
    const progressBar = document.getElementById('progress-bar');
    const volumeSlider = document.getElementById('volume-slider');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const trackTitleEl = document.getElementById('track-title');
    const trackArtistEl = document.getElementById('track-artist');

    // --- 2. Playlist ---
    const playlist = [
        { 
            title: 'song', 
            artist: 'baby', 
            src: '../music/song1.mp3' 
        },
    ];

    let currentTrackIndex = 0;
    let isPlaying = false;
    
    // --- 3. Lógica de Ordem Aleatória ---

    // Cria uma cópia da playlist original para ser embaralhada.
    let shuffledPlaylist = [...playlist];

    /**
     * Embaralha um array em-place usando o algoritmo Fisher-Yates.
     * @param {Array} array O array a ser embaralhado.
     */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            // Escolhe um índice aleatório antes do elemento atual
            const j = Math.floor(Math.random() * (i + 1));
            // Troca o elemento atual com o elemento do índice aleatório
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Embaralha a playlist assim que o script é carregado.
    shuffleArray(shuffledPlaylist);

    // --- 4. Funções do Player ---

    /**
     * Carrega uma faixa com base no seu índice na playlist embaralhada.
     * @param {number} trackIndex O índice da música na `shuffledPlaylist`.
     */
    function loadTrack(trackIndex) {
        const track = shuffledPlaylist[trackIndex];
        trackTitleEl.textContent = track.title;
        trackArtistEl.textContent = track.artist;
        audioPlayer.src = track.src;
        
        // Garante que a duração seja exibida após os metadados da música serem carregados.
        audioPlayer.onloadedmetadata = () => {
            durationEl.textContent = formatTime(audioPlayer.duration);
            progressBar.max = audioPlayer.duration;
        };
    }

    // Toca a música
    function playTrack() {
        isPlaying = true;
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
        playPauseBtn.classList.remove('play');
        audioPlayer.play().catch(error => console.log("O usuário precisa interagir com a página primeiro.", error));
    }

    // Pausa a música
    function pauseTrack() {
        isPlaying = false;
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
        playPauseBtn.classList.add('play');
        audioPlayer.pause();
    }
    
    // Alterna entre tocar e pausar
    function togglePlayPause() {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    }
    
    // Toca a faixa anterior na lista embaralhada
    function prevTrack() {
        const playlistLength = shuffledPlaylist.length;
        currentTrackIndex = (currentTrackIndex - 1 + playlistLength) % playlistLength;
        loadTrack(currentTrackIndex);
        playTrack();
    }

    // Toca a próxima faixa na lista embaralhada
    function nextTrack() {
        const playlistLength = shuffledPlaylist.length;
        currentTrackIndex = (currentTrackIndex + 1) % playlistLength;
        loadTrack(currentTrackIndex);
        playTrack();
    }

    // Atualiza a barra de progresso
    function updateProgress() {
        progressBar.value = audioPlayer.currentTime;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }

    // Define a posição da música com base na barra de progresso
    function setProgress(e) {
        audioPlayer.currentTime = e.target.value;
    }

    // Ajusta o volume
    function setVolume(e) {
        audioPlayer.volume = e.target.value;
    }

    /**
     * Formata o tempo de segundos para o formato m:ss.
     * @param {number} seconds Tempo em segundos.
     * @returns {string} Tempo formatado.
     */
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
    audioPlayer.addEventListener('ended', nextTrack); // Quando uma música termina, vai para a próxima da lista aleatória
    progressBar.addEventListener('input', setProgress);
    volumeSlider.addEventListener('input', setVolume);
    
    // --- 6. Inicialização e Autoplay ---

    // Função para tentar iniciar a música após a primeira interação do usuário.
    function startAutoplay() {
        playTrack();
        // Remove os listeners para que não sejam acionados novamente.
        document.body.removeEventListener('click', startAutoplay);
        document.body.removeEventListener('keydown', startAutoplay);
    }

    // Adiciona listeners para a primeira interação do usuário.
    document.body.addEventListener('click', startAutoplay);
    document.body.addEventListener('keydown', startAutoplay);

    // Carrega a primeira faixa da playlist JÁ EMBARALHADA.
    loadTrack(currentTrackIndex);
    audioPlayer.volume = volumeSlider.value;
});
