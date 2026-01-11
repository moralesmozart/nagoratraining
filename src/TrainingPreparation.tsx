import React, { useState } from 'react';
import ExerciseCardWithWeights from './ExerciseCardWithWeights';
import TimerConfig from './TimerConfig';
import type { CardData, TimerConfig as TimerConfigType } from './types';
import './TrainingPreparation.css';

interface TrainingPreparationProps {
  card: CardData;
  onStartTraining: (weights: { [key: number]: number }, timerConfig: TimerConfigType) => void;
  onBack: () => void;
}

const TrainingPreparation: React.FC<TrainingPreparationProps> = ({
  card,
  onStartTraining,
  onBack,
}) => {
  const [weights, setWeights] = useState<{ [key: number]: number }>({});
  const [showTimerConfig, setShowTimerConfig] = useState(false);
  const [timerConfig, setTimerConfig] = useState<TimerConfigType>({
    prepTime: 5,
    workTime: 20,
    restTime: 10,
    rounds: 1,
    restBetweenExercises: 10,
  });

  const handleWeightChange = (exerciseIndex: number, weight: number) => {
    setWeights(prev => ({
      ...prev,
      [exerciseIndex]: weight,
    }));
  };

  const handleStart = () => {
    // Guardar en sessionStorage para que ActiveTraining pueda acceder
    sessionStorage.setItem('trainingWeights', JSON.stringify(weights));
    sessionStorage.setItem('trainingTimerConfig', JSON.stringify(timerConfig));
    onStartTraining(weights, timerConfig);
  };

  return (
    <div className="training-preparation">
      <div className="preparation-header">
        <button onClick={onBack} className="back-button">← Volver</button>
        <h1>Preparación del Entrenamiento</h1>
      </div>

      <div className="preparation-content">
        <div className="preparation-card-container">
          <ExerciseCardWithWeights
            card={card}
            weights={weights}
            onWeightChange={handleWeightChange}
          />
        </div>

        <div className="preparation-controls">
          <button 
            onClick={() => setShowTimerConfig(!showTimerConfig)}
            className="timer-config-btn"
          >
            {showTimerConfig ? 'Ocultar' : 'Configurar'} Timer
          </button>

          {showTimerConfig && (
            <div className="timer-config-panel">
              <TimerConfig
                config={timerConfig}
                onChange={setTimerConfig}
              />
            </div>
          )}

          <button 
            onClick={handleStart}
            className="start-training-main-btn"
          >
            Iniciar Entrenamiento
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingPreparation;

