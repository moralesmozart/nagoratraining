import React, { useState, useEffect, useRef } from 'react';
import './SimpleTimer.css';

interface SimpleTimerProps {
  initialTime: number;
  type: 'normal' | 'reverse';
  onComplete?: () => void;
}

const SimpleTimer: React.FC<SimpleTimerProps> = ({ initialTime, type, onComplete }) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setTime(prev => {
          if (type === 'normal') {
            return prev + 1;
          } else {
            // Reverse counter
            if (prev <= 0) {
              setIsRunning(false);
              onComplete?.();
              return 0;
            }
            return prev - 1;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, type, onComplete]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTime(initialTime);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="simple-timer">
      <div className="simple-timer-display">
        <div className="timer-time">{formatTime(time)}</div>
        <div className="timer-type-label">
          {type === 'normal' ? 'Contador Normal' : 'Contador Reverso'}
        </div>
      </div>

      <div className="simple-timer-controls">
        {!isRunning ? (
          <button onClick={handleStart} className="timer-btn start-btn">
            ▶ Iniciar
          </button>
        ) : (
          <>
            <button onClick={handlePause} className="timer-btn pause-btn">
              {isPaused ? '▶ Reanudar' : '⏸ Pausar'}
            </button>
            <button onClick={handleReset} className="timer-btn reset-btn">
              ↻ Reiniciar
            </button>
            <button onClick={() => onComplete?.()} className="timer-btn finish-btn">
              ✓ Finalizar Entrenamiento
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SimpleTimer;

