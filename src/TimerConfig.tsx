import React from 'react';
import type { TimerConfig as TimerConfigType, TimerType } from './types';
import './TimerConfig.css';

interface TimerConfigProps {
  config: TimerConfigType;
  onChange: (config: TimerConfigType) => void;
}

const TimerConfig: React.FC<TimerConfigProps> = ({ config, onChange }) => {
  const updateField = (field: keyof TimerConfigType, value: string | number) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  const handleTypeChange = (type: TimerType) => {
    const newConfig: TimerConfigType = {
      ...config,
      type,
    };
    
    // Si cambia a normal/reverse, establecer valores por defecto
    if (type === 'normal' || type === 'reverse') {
      newConfig.initialTime = config.initialTime || 0;
    }
    
    onChange(newConfig);
  };

  return (
    <div className="timer-config">
      <h3 className="timer-config-title">Configuración del Timer</h3>
      
      {/* Selector de tipo de timer */}
      <div className="timer-type-selector">
        <button
          className={`timer-type-btn ${config.type === 'tabata' ? 'active' : ''}`}
          onClick={() => handleTypeChange('tabata')}
        >
          Configuración Tabata
        </button>
        <button
          className={`timer-type-btn ${config.type === 'normal' ? 'active' : ''}`}
          onClick={() => handleTypeChange('normal')}
        >
          Contador Normal
        </button>
        <button
          className={`timer-type-btn ${config.type === 'reverse' ? 'active' : ''}`}
          onClick={() => handleTypeChange('reverse')}
        >
          Contador Reverso
        </button>
      </div>

      {/* Configuración Tabata */}
      {config.type === 'tabata' && (
        <div className="timer-config-grid">
          <div className="config-item">
            <label>Tiempo de Preparación (seg)</label>
            <input
              type="number"
              min="0"
              max="30"
              value={config.prepTime || ''}
              onChange={(e) => updateField('prepTime', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
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
              onChange={(e) => updateField('workTime', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
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
              onChange={(e) => updateField('restTime', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
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
              onChange={(e) => updateField('rounds', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
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
              onChange={(e) => updateField('restBetweenExercises', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
              className="config-input"
              placeholder="10"
            />
          </div>
        </div>
      )}

      {/* Configuración Normal/Reverse Counter */}
      {(config.type === 'normal' || config.type === 'reverse') && (
        <div className="timer-config-simple">
          <div className="config-item">
            <label>Tiempo Inicial (segundos)</label>
            <input
              type="number"
              min="0"
              value={config.initialTime || ''}
              onChange={(e) => updateField('initialTime', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
              className="config-input"
              placeholder="0"
            />
            <p className="config-help">
              {config.type === 'normal' 
                ? 'El contador comenzará en 0 y aumentará' 
                : 'El contador comenzará en este valor y disminuirá'}
            </p>
          </div>
        </div>
      )}

      {/* Vista previa */}
      {config.type === 'tabata' && (
        <div className="timer-preview">
          <p className="preview-text">
            <strong>Vista previa:</strong> {config.workTime || 0}s trabajo / {config.restTime || 0}s descanso × {config.rounds || 0} rondas
          </p>
        </div>
      )}
    </div>
  );
};

export default TimerConfig;
