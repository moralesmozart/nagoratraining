import React, { useState } from 'react';
import ExerciseCardFlipWood from './ExerciseCardFlipWood';
import type { TrainingSession, CardData } from './types';
import './TrainingHistory.css';

interface TrainingHistoryProps {
  sessions: TrainingSession[];
  card: CardData;
}

const TrainingHistory: React.FC<TrainingHistoryProps> = ({ sessions, card }) => {
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sortedSessions = [...sessions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="training-history">
      <h3 className="history-title">Historial de Sesiones</h3>
      
      <div className="history-sessions">
        {sortedSessions.map((session) => (
          <div 
            key={session.id} 
            className={`history-session-card ${selectedSession?.id === session.id ? 'expanded' : ''}`}
            onClick={() => setSelectedSession(selectedSession?.id === session.id ? null : session)}
          >
            <div className="session-header">
              <div className="session-date">
                📅 {formatDate(session.date)}
              </div>
              <div className="session-time">
                ⏱️ {formatTime(session.totalTime)}
              </div>
              <div className={`session-status ${session.status}`}>
                {session.status === 'completed' ? '✓ Completado' : '○ Parcial'}
              </div>
            </div>

            {selectedSession?.id === session.id && (
              <div className="session-details">
                <div className="session-card-preview">
                  <ExerciseCardFlipWood
                    title={card.front.title || 'Sin título'}
                    subtitle={card.front.subtitle || ''}
                    exercises={session.exercises.map(e => 
                      e.weight ? `${e.name} (${e.weight}kg)` : e.name
                    )}
                    backSubtitle={card.back.subtitle || undefined}
                    backExercises={card.back.exercises
                      .filter(e => e.name.trim() !== '')
                      .map(e => e.repetitions ? `${e.name} (${e.repetitions})` : e.name)}
                    topColor={card.front.color}
                    intensity={0.3}
                    perspective={1000}
                    showFlipIndicator={false}
                  />
                </div>
                
                <div className="session-info">
                  <div className="info-item">
                    <strong>Ejercicios completados:</strong> {session.exercises.length}
                  </div>
                  <div className="info-item">
                    <strong>Configuración del timer:</strong>
                    <ul className="timer-config-list">
                      <li>Trabajo: {session.timerConfig.workTime}s</li>
                      <li>Descanso: {session.timerConfig.restTime}s</li>
                      <li>Rondas: {session.timerConfig.rounds}</li>
                      <li>Descanso entre ejercicios: {session.timerConfig.restBetweenExercises}s</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingHistory;

