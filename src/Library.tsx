import React, { useState, useMemo } from 'react';
import ExerciseCardFlipWood from './ExerciseCardFlipWood';
import TrainingHistory from './TrainingHistory';
import TrainingContributionGraph from './TrainingContributionGraph';
import type { CardData, TrainingSession } from './types';
import './Library.css';

const nagoraLogo = `${import.meta.env.BASE_URL}nagora-logo.png`;

interface LibraryProps {
  cards: CardData[];
  sessions: TrainingSession[];
  onCreateCard: () => void;
  onPickTraining: (card: CardData) => void;
  getSessionCount: (cardId: string) => number;
}

const Library: React.FC<LibraryProps> = ({ 
  cards, 
  sessions,
  onCreateCard, 
  onPickTraining,
  getSessionCount 
}) => {
  const [historyCardId, setHistoryCardId] = useState<string | null>(null);

  const openHistory = (cardId: string) => {
    setHistoryCardId(cardId);
  };

  const closeHistory = () => {
    setHistoryCardId(null);
  };

  // Parsear fechas de las sesiones (pueden venir como strings desde localStorage)
  const parsedSessions = useMemo(() => {
    return sessions.map(session => ({
      ...session,
      date: session.date instanceof Date ? session.date : new Date(session.date),
    }));
  }, [sessions]);

  return (
    <div className="library-container">
      <div className="library-mirror-background"></div>
      <div className="library-content">
        <div className="library-header">
          <img src={nagoraLogo} alt="Nagora" className="nagora-logo" />
          <h1 className="library-title">Nāgora</h1>
        </div>
        
        <div className="library-actions-top">
          <button onClick={onCreateCard} className="create-card-button-top">
            ➕ Crear Nuevo Entrenamiento
          </button>
        </div>
        
        {cards.length === 0 ? (
          <div className="library-empty">
            <p className="empty-message">No hay tarjetas guardadas</p>
            <button onClick={onCreateCard} className="create-card-button">
              Crear tu Tarjeta de Entrenamiento
            </button>
          </div>
        ) : (
          <div className="library-cards-grid">
            {cards.map((card) => {
              const cardId = card.id || `card-${cards.indexOf(card)}`;
              const sessionCount = getSessionCount(cardId);

              return (
                <div key={cardId} className="library-card-wrapper">
                  <div className="library-card-container">
                    <ExerciseCardFlipWood
                      title={card.front.title || 'Sin título'}
                      subtitle={card.front.subtitle || ''}
                      exercises={card.front.exercises
                        .filter(e => e.name.trim() !== '')
                        .map(e => e.repetitions ? `${e.name} (${e.repetitions})` : e.name)}
                      backSubtitle={card.back.subtitle || undefined}
                      backExercises={card.back.exercises
                        .filter(e => e.name.trim() !== '')
                        .map(e => e.repetitions ? `${e.name} (${e.repetitions})` : e.name)}
                      topColor={card.front.color}
                      intensity={0.3}
                      perspective={1000}
                      showFlipIndicator={false}
                    />
                    
                    <div className="library-card-actions">
                      {sessionCount > 0 && (
                        <div className="session-badge">
                          {sessionCount} {sessionCount === 1 ? 'sesión' : 'sesiones'}
                        </div>
                      )}
                      <button 
                        onClick={() => onPickTraining(card)}
                        className="start-training-btn"
                      >
                        Iniciar Entrenamiento
                      </button>
                      {sessionCount > 0 && (
                        <button 
                          onClick={() => openHistory(cardId)}
                          className="view-history-btn"
                        >
                          Ver Historial
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Gráfico de contribuciones */}
        {parsedSessions.length > 0 && (
          <TrainingContributionGraph 
            sessions={parsedSessions}
            cards={cards}
          />
        )}
      </div>

      {/* Modal de Historial */}
      {historyCardId && (() => {
        const selectedCard = cards.find(c => (c.id || `card-${cards.indexOf(c)}`) === historyCardId);
        const cardSessions = sessions.filter(s => s.cardId === historyCardId);
        if (!selectedCard || cardSessions.length === 0) return null;
        
        return (
          <div className="history-modal-overlay" onClick={closeHistory}>
            <div className="history-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="history-modal-close" onClick={closeHistory}>✕</button>
              <h2 className="history-modal-title">Historial de Entrenamientos</h2>
              <TrainingHistory 
                sessions={cardSessions}
                card={selectedCard}
              />
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default Library;

