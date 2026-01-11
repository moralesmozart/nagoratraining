// Utilidad para generar sonidos usando Web Audio API

export type SoundType = 'beep' | 'start' | 'work' | 'rest' | 'exercise-change' | 'complete' | 'warning';

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioContext = new AudioContextClass();
    }
  }
  
  // Reactivar el contexto si está suspendido (requerido por algunos navegadores)
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  return audioContext;
};

export const playSound = (type: SoundType, volume: number = 0.3) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  gainNode.gain.value = volume;
  oscillator.type = 'sine';

  switch (type) {
    case 'beep':
      // Beep corto y agudo
      oscillator.frequency.value = 800;
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.1);
      break;

    case 'start':
      // Sonido de inicio (tono ascendente)
      oscillator.frequency.setValueAtTime(400, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.3);
      break;

    case 'work':
      // Sonido de trabajo (tono más fuerte y agudo)
      oscillator.frequency.value = 600;
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.15);
      break;

    case 'rest':
      // Sonido de descanso (tono más suave y bajo)
      oscillator.frequency.value = 400;
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.15);
      break;

    case 'exercise-change':
      // Sonido de cambio de ejercicio (dos beeps)
      oscillator.frequency.value = 500;
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.1);
      
      setTimeout(() => {
        const ctx2 = getAudioContext();
        if (!ctx2) return;
        const oscillator2 = ctx2.createOscillator();
        const gainNode2 = ctx2.createGain();
        oscillator2.connect(gainNode2);
        gainNode2.connect(ctx2.destination);
        gainNode2.gain.value = volume;
        oscillator2.type = 'sine';
        oscillator2.frequency.value = 700;
        oscillator2.start();
        oscillator2.stop(ctx2.currentTime + 0.1);
      }, 150);
      break;

    case 'complete':
      // Sonido de completado (melodía ascendente)
      const notes = [400, 500, 600, 700, 800];
      notes.forEach((freq, index) => {
        setTimeout(() => {
          const ctxNote = getAudioContext();
          if (!ctxNote) return;
          const osc = ctxNote.createOscillator();
          const gain = ctxNote.createGain();
          osc.connect(gain);
          gain.connect(ctxNote.destination);
          gain.gain.value = volume * 0.8;
          osc.type = 'sine';
          osc.frequency.value = freq;
          osc.start();
          osc.stop(ctxNote.currentTime + 0.15);
        }, index * 100);
      });
      break;

    case 'warning':
      // Sonido de advertencia (3 beeps rápidos)
      [0, 100, 200].forEach((delay) => {
        setTimeout(() => {
          const ctxWarn = getAudioContext();
          if (!ctxWarn) return;
          const osc = ctxWarn.createOscillator();
          const gain = ctxWarn.createGain();
          osc.connect(gain);
          gain.connect(ctxWarn.destination);
          gain.gain.value = volume;
          osc.type = 'sine';
          osc.frequency.value = 700;
          osc.start();
          osc.stop(ctxWarn.currentTime + 0.08);
        }, delay);
      });
      break;
  }
};

