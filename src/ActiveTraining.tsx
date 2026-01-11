import React, { useState } from 'react';
import ExerciseCardWithWeights from './ExerciseCardWithWeights';
import TabataTimer from './TabataTimer';
import Confetti from './Confetti';
import type { CardData, TrainingSession, TimerConfig } from './types';
import './ActiveTraining.css';

interface ActiveTrainingProps {
  card: CardData;
  onComplete: (session: TrainingSession) => void;
  onCancel: () => void;
}

const ActiveTraining: React.FC<ActiveTrainingProps> = ({
  card,
  onComplete,
  onCancel,
}) => {
  // Recuperar pesos y configuración del localStorage o estado
  const [weights, setWeights] = useState<{ [key: number]: number }>(() => {
    const saved = sessionStorage.getItem('trainingWeights');
    return saved ? JSON.parse(saved) : {};
  });
  const [timerConfig] = useState<TimerConfig>(() => {
    const saved = sessionStorage.getItem('trainingTimerConfig');
    return saved ? JSON.parse(saved) : {
      prepTime: 5,
      workTime: 20,
      restTime: 10,
      rounds: 1,
      restBetweenExercises: 10,
    };
  });
  const [startTime] = useState(Date.now());
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleWeightChange = (exerciseIndex: number, weight: number) => {
    setWeights(prev => ({
      ...prev,
      [exerciseIndex]: weight,
    }));
  };

  const handleExerciseComplete = (exerciseIndex: number) => {
    setCompletedExercises(prev => new Set([...prev, exerciseIndex]));
  };

  const handleTimerComplete = () => {
    setIsCompleted(true);
  };

  const handleSaveSession = () => {
    const frontExercises = card.front.exercises.filter(e => e.name.trim() !== '');
    const backExercises = card.back.exercises.filter(e => e.name.trim() !== '');
    
    const exerciseList = [
      ...frontExercises.map((exercise, index) => ({
        ...exercise,
        weight: weights[index],
      })),
      ...backExercises.map((exercise, index) => ({
        ...exercise,
        weight: weights[frontExercises.length + index],
      })),
    ];

    const totalTime = Math.floor((Date.now() - startTime) / 1000);

    const session: TrainingSession = {
      id: `session-${Date.now()}`,
      cardId: card.id || 'unknown',
      date: new Date(),
      totalTime,
      exercises: exerciseList,
      timerConfig,
      status: completedExercises.size === allExercises.length ? 'completed' : 'partial',
    };

    // Limpiar sessionStorage
    sessionStorage.removeItem('trainingWeights');
    sessionStorage.removeItem('trainingTimerConfig');
    
    onComplete(session);
  };

  const frontExercises = card.front.exercises.filter(e => e.name.trim() !== '');
  const backExercises = card.back.exercises.filter(e => e.name.trim() !== '');
  const allExercises = [...frontExercises, ...backExercises];

  return (
    <div className="active-training">
      <Confetti active={isCompleted} />
      
      <div className="training-header">
        <button onClick={onCancel} className="cancel-training-btn">✕ Cancelar</button>
        <h1>Entrenamiento en Curso</h1>
      </div>

      <div className="training-layout">
        <div className="training-card-section">
          <ExerciseCardWithWeights
            card={card}
            weights={weights}
            onWeightChange={handleWeightChange}
            completedExercises={completedExercises}
            currentExercise={currentExercise}
            autoFlip={true}
          />
        </div>

        <div className="training-timer-section">
          <TabataTimer
            exercises={allExercises}
            timerConfig={timerConfig}
            onExerciseComplete={(index) => {
              handleExerciseComplete(index);
              setCurrentExercise(index);
            }}
            onComplete={handleTimerComplete}
            currentExercise={currentExercise}
            onExerciseChange={setCurrentExercise}
          />
        </div>
      </div>

      {isCompleted && (
        <div className="training-complete-overlay">
          <div className="complete-modal">
            <div className="complete-icon">🎉</div>
            <h2>¡Entrenamiento Completado!</h2>
            <p>Tiempo total: {Math.floor((Date.now() - startTime) / 1000 / 60)} minutos</p>
            <div className="complete-actions">
              <button onClick={handleSaveSession} className="save-session-btn">
                Guardar Sesión
              </button>
              <button onClick={onCancel} className="cancel-btn">
                Salir sin Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveTraining;

