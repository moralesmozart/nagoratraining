import React from 'react';
import type { TimerConfig as TimerConfigType } from './types';
import './TimerConfig.css';

interface TimerConfigProps {
  config: TimerConfigType;
  onChange: (config: TimerConfigType) => void;
}

const TimerConfig: React.FC<TimerConfigProps> = ({ config, onChange }) => {
  const updateField = (field: keyof TimerConfigType, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value) || 0;
    onChange({
      ...config,
      [field]: numValue,
    });
  };

  return (
    <div className="timer-config">
      <h3 className="timer-config-title">Configuración Tabata</h3>
      
      <div className="timer-config-grid">
        <div className="config-item">
          <label>Tiempo de Preparación (seg)</label>
          <input
            type="number"
            min="0"
            max="30"
            value={config.prepTime || ''}
            onChange={(e) => updateField('prepTime', e.target.value)}
            className="config-input"
            placeholder="0"
          />
        </div>

        <div className="config-item">
          <label>Tiempo de Trabajo (seg)</label>
          <input
            type="number"
            min="0"
            max="120"
            value={config.workTime || ''}
            onChange={(e) => updateField('workTime', e.target.value)}
            className="config-input"
            placeholder="20"
          />
        </div>

        <div className="config-item">
          <label>Tiempo de Descanso (seg)</label>
          <input
            type="number"
            min="0"
            max="120"
            value={config.restTime || ''}
            onChange={(e) => updateField('restTime', e.target.value)}
            className="config-input"
            placeholder="10"
          />
        </div>

        <div className="config-item">
          <label>Rondas</label>
          <input
            type="number"
            min="0"
            max="20"
            value={config.rounds || ''}
            onChange={(e) => updateField('rounds', e.target.value)}
            className="config-input"
            placeholder="1"
          />
        </div>

        <div className="config-item">
          <label>Descanso entre Ejercicios (seg)</label>
          <input
            type="number"
            min="0"
            max="120"
            value={config.restBetweenExercises || ''}
            onChange={(e) => updateField('restBetweenExercises', e.target.value)}
            className="config-input"
            placeholder="10"
          />
        </div>
      </div>

      <div className="timer-preview">
        <p className="preview-text">
          <strong>Vista previa:</strong> {config.workTime || 0}s trabajo / {config.restTime || 0}s descanso × {config.rounds || 0} rondas
        </p>
      </div>
    </div>
  );
};

export default TimerConfig;

