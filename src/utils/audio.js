let audioContext = null;

export const playTone = (frequency, duration, type = 'sine') => {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
};

export const playBackgroundMusic = (style) => {
    if (style === 'happy') {
        const notes = [264, 264, 297, 264, 352, 330, 264, 264, 297, 264, 396, 352];
        notes.forEach((freq, i) => {
            setTimeout(() => playTone(freq, 0.4, 'sine'), i * 400);
        });
    } else if (style === 'romantic') {
        const notes = [330, 392, 494, 392, 330, 392, 494, 523];
        notes.forEach((freq, i) => {
            setTimeout(() => playTone(freq, 0.8, 'triangle'), i * 600);
        });
    } else {
        const notes = [262, 330, 392, 330, 262, 196];
        notes.forEach((freq, i) => {
            setTimeout(() => playTone(freq, 1.2, 'sine'), i * 800);
        });
    }
};
