import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { TimerConfig, Exercise } from './types';
import { playSound } from './sounds';
import './TabataTimer.css';

interface TabataTimerProps {
  exercises: Exercise[];
  timerConfig: TimerConfig;
  onExerciseComplete: (exerciseIndex: number) => void;
  onComplete: () => void;
  currentExercise?: number;
  onExerciseChange?: (index: number) => void;
}

type TimerState = 'prep' | 'work' | 'rest' | 'restBetween' | 'finished';

const TabataTimer: React.FC<TabataTimerProps> = ({
  exercises,
  timerConfig,
  onExerciseComplete,
  onComplete,
  currentExercise: externalCurrentExercise,
  onExerciseChange,
}) => {
  const [currentExercise, setCurrentExercise] = useState(externalCurrentExercise ?? 0);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(timerConfig.prepTime);
  const [state, setState] = useState<TimerState>('prep');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const handleNextPhase = useCallback(() => {
    if (state === 'prep') {
      setState('work');
      setTimeLeft(timerConfig.workTime);
      playSound('work', 0.4); // Sonido cuando empieza el trabajo
    } else if (state === 'work') {
      setState('rest');
      setTimeLeft(timerConfig.restTime);
      playSound('rest', 0.3); // Sonido cuando empieza el descanso
    } else if (state === 'rest') {
      if (currentRound < timerConfig.rounds) {
        setCurrentRound(prev => prev + 1);
        setState('work');
        setTimeLeft(timerConfig.workTime);
        playSound('work', 0.4); // Sonido cuando empieza nueva ronda de trabajo
      } else {
        // Ronda completada, pasar al siguiente ejercicio
        onExerciseComplete(currentExercise);
        if (currentExercise < exercises.length - 1) {
          const nextExercise = currentExercise + 1;
          setCurrentExercise(nextExercise);
          if (onExerciseChange) {
            onExerciseChange(nextExercise);
          }
          setCurrentRound(1);
          setState('restBetween');
          setTimeLeft(timerConfig.restBetweenExercises);
          playSound('exercise-change', 0.4); // Sonido cuando cambia de ejercicio
        } else {
          // Todos los ejercicios completados
          setState('finished');
          setIsRunning(false);
          playSound('complete', 0.5); // Sonido de completado
          onComplete();
        }
      }
    } else if (state === 'restBetween') {
      setState('prep');
      setTimeLeft(timerConfig.prepTime);
      playSound('beep', 0.3); // Sonido cuando empieza la preparación
    }
  }, [state, currentRound, currentExercise, timerConfig, exercises.length, onExerciseComplete, onComplete, onExerciseChange]);

  useEffect(() => {
    if (isRunning && !isPaused && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning && state !== 'finished') {
      handleNextPhase();
    }
  }, [timeLeft, isRunning, state, handleNextPhase]);

  // Sonido de advertencia cuando quedan 3 segundos
  useEffect(() => {
    if (isRunning && !isPaused && timeLeft === 3 && (state === 'work' || state === 'rest')) {
      playSound('warning', 0.3);
    }
  }, [timeLeft, isRunning, isPaused, state]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    playSound('start', 0.4); // Sonido cuando inicia el entrenamiento
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentExercise(0);
    setCurrentRound(1);
    setState('prep');
    setTimeLeft(timerConfig.prepTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStateLabel = () => {
    switch (state) {
      case 'prep':
        return 'Preparación';
      case 'work':
        return 'Trabajo';
      case 'rest':
        return 'Descanso';
      case 'restBetween':
        return 'Descanso entre Ejercicios';
      case 'finished':
        return 'Completado';
      default:
        return '';
    }
  };

  const getStateColor = () => {
    switch (state) {
      case 'prep':
        return '#f59e0b';
      case 'work':
        return '#737f4c';
      case 'rest':
      case 'restBetween':
        return '#10b981';
      case 'finished':
        return '#737f4c';
      default:
        return '#666';
    }
  };

  return (
    <div className="tabata-timer">
      <div className="timer-display" style={{ borderColor: getStateColor() }}>
        <div className="timer-state" style={{ color: getStateColor() }}>
          {getStateLabel()}
        </div>
        <div className="timer-time" style={{ color: getStateColor() }}>
          {formatTime(timeLeft)}
        </div>
        <div className="timer-info">
          <div className="timer-exercise">
            Ejercicio {currentExercise + 1} de {exercises.length}
          </div>
          <div className="timer-round">
            Ronda {currentRound} de {timerConfig.rounds}
          </div>
        </div>
      </div>

      <div className="timer-controls">
        {!isRunning ? (
          <button onClick={handleStart} className="timer-btn start-btn">
            ▶ Iniciar
          </button>
        ) : isPaused ? (
          <>
            <button onClick={handleResume} className="timer-btn resume-btn">
              ▶ Continuar
            </button>
            <button onClick={handleReset} className="timer-btn reset-btn">
              ↻ Reiniciar
            </button>
          </>
        ) : (
          <>
            <button onClick={handlePause} className="timer-btn pause-btn">
              ⏸ Pausar
            </button>
            <button onClick={handleReset} className="timer-btn reset-btn">
              ↻ Reiniciar
            </button>
          </>
        )}
      </div>

      <div className="timer-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${((exercises.length - currentExercise - 1) / exercises.length) * 100}%`,
              backgroundColor: getStateColor()
            }}
          />
        </div>
        <div className="progress-text">
          {exercises.length - currentExercise - 1} ejercicios restantes
        </div>
      </div>
    </div>
  );
};

export default TabataTimer;

