import React from 'react';
import ExerciseCardFlipWood from './ExerciseCardFlipWood';
import './Library.css';

interface Exercise {
  name: string;
  repetitions?: string;
}

interface CardData {
  front: {
    color: string;
    title: string;
    subtitle: string;
    exercises: Exercise[];
  };
  back: {
    color: string;
    title: string;
    subtitle: string;
    exercises: Exercise[];
  };
}

interface LibraryProps {
  cards: CardData[];
  onCreateCard: () => void;
}

const Library: React.FC<LibraryProps> = ({ cards, onCreateCard }) => {
  return (
    <div className="library-container">
      <div className="library-mirror-background"></div>
      <div className="library-content">
        <h1 className="library-title">Biblioteca de Entrenamientos</h1>
        
        {cards.length === 0 ? (
          <div className="library-empty">
            <p className="empty-message">No hay tarjetas guardadas</p>
            <button onClick={onCreateCard} className="create-card-button">
              Crear tu Tarjeta de Entrenamiento
            </button>
          </div>
        ) : (
          <div className="library-cards-grid">
            {cards.map((card, index) => (
              <div key={index} className="library-card-wrapper">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;

