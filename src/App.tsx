import { useState } from 'react'
import EditableCardPreview from './EditableCardPreview'
import ExerciseCardFlipWood from './ExerciseCardFlipWood'
import Library from './Library'
import TrainingPreparation from './TrainingPreparation'
import ActiveTraining from './ActiveTraining'
import type { CardData, TrainingSession, Exercise } from './types'
import './App.css'

const nagoraLogo = `${import.meta.env.BASE_URL}nagora-logo.png`;

function App() {
  const [currentView, setCurrentView] = useState<'editor' | 'library' | 'preparation' | 'training'>('library');
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [cardData, setCardData] = useState<CardData>({
    front: {
      color: '#3b82f6',
      title: '',
      subtitle: '',
      exercises: [{ name: '', repetitions: '' }],
    },
    back: {
      color: '#3b82f6',
      title: '',
      subtitle: '',
      exercises: [{ name: '', repetitions: '' }],
    },
  });

  const [showModal, setShowModal] = useState(false);
  const [savedCards, setSavedCards] = useState<CardData[]>(() => {
    const saved = localStorage.getItem('trainingCards');
    if (saved) {
      const cards = JSON.parse(saved);
      // Asegurar que cada tarjeta tenga un ID
      return cards.map((card: CardData, index: number) => ({
        ...card,
        id: card.id || `card-${Date.now()}-${index}`,
      }));
    }
    return [];
  });

  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>(() => {
    const saved = localStorage.getItem('trainingSessions');
    return saved ? JSON.parse(saved) : [];
  });

  const updateFront = (field: keyof CardData['front'], value: string | string[] | Exercise[]) => {
    setCardData(prev => ({
      ...prev,
      front: {
        ...prev.front,
        [field]: value,
      },
    }));
  };

  const updateBack = (field: keyof CardData['back'], value: string | string[] | Exercise[]) => {
    setCardData(prev => ({
      ...prev,
      back: {
        ...prev.back,
        [field]: value,
      },
    }));
  };

  const addExercise = (side: 'front' | 'back') => {
    if (side === 'front') {
      setCardData(prev => ({
        ...prev,
        front: {
          ...prev.front,
          exercises: [...prev.front.exercises, { name: '', repetitions: '' }],
        },
      }));
    } else {
      setCardData(prev => ({
        ...prev,
        back: {
          ...prev.back,
          exercises: [...prev.back.exercises, { name: '', repetitions: '' }],
        },
      }));
    }
  };

  const updateExercise = (side: 'front' | 'back', index: number, field: 'name' | 'repetitions', value: string) => {
    if (side === 'front') {
      const newExercises = [...cardData.front.exercises];
      newExercises[index] = { ...newExercises[index], [field]: value };
      updateFront('exercises', newExercises);
    } else {
      const newExercises = [...cardData.back.exercises];
      newExercises[index] = { ...newExercises[index], [field]: value };
      updateBack('exercises', newExercises);
    }
  };

  const removeExercise = (side: 'front' | 'back', index: number) => {
    if (side === 'front') {
      const newExercises = cardData.front.exercises.filter((_, i) => i !== index);
      updateFront('exercises', newExercises.length > 0 ? newExercises : [{ name: '', repetitions: '' }]);
    } else {
      const newExercises = cardData.back.exercises.filter((_, i) => i !== index);
      updateBack('exercises', newExercises.length > 0 ? newExercises : [{ name: '', repetitions: '' }]);
    }
  };

  const handleCreateCard = () => {
    console.log('Card Data:', cardData);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSendToLibrary = () => {
    const cardWithId = {
      ...cardData,
      id: cardData.id || `card-${Date.now()}`,
    };
    const newCards = [...savedCards, cardWithId];
    setSavedCards(newCards);
    localStorage.setItem('trainingCards', JSON.stringify(newCards));
    setShowModal(false);
    // Resetear el formulario
    setCardData({
      front: {
        color: '#3b82f6',
        title: '',
        subtitle: '',
        exercises: [{ name: '', repetitions: '' }],
      },
      back: {
        color: '#3b82f6',
        title: '',
        subtitle: '',
        exercises: [{ name: '', repetitions: '' }],
      },
    });
    alert('Tarjeta guardada en la biblioteca!');
  };

  const handlePickTraining = (card: CardData) => {
    setSelectedCard(card);
    setCurrentView('preparation');
  };

  const handleStartTraining = (_weights: { [key: number]: number }, _timerConfig: any) => {
    setCurrentView('training');
    // Los datos se pasarán al componente ActiveTraining
  };

  const handleSaveSession = (session: TrainingSession) => {
    const newSessions = [...trainingSessions, session];
    setTrainingSessions(newSessions);
    localStorage.setItem('trainingSessions', JSON.stringify(newSessions));
    setCurrentView('library');
    setSelectedCard(null);
  };

  const getSessionCount = (cardId: string) => {
    return trainingSessions.filter(s => s.cardId === cardId).length;
  };

  if (currentView === 'library') {
    return (
      <Library 
        cards={savedCards}
        sessions={trainingSessions}
        onCreateCard={() => setCurrentView('editor')}
        onPickTraining={handlePickTraining}
        getSessionCount={getSessionCount}
      />
    );
  }

  if (currentView === 'preparation' && selectedCard) {
    return (
      <TrainingPreparation
        card={selectedCard}
        onStartTraining={handleStartTraining}
        onBack={() => setCurrentView('library')}
      />
    );
  }

  if (currentView === 'training' && selectedCard) {
    return (
      <ActiveTraining
        card={selectedCard}
        onComplete={handleSaveSession}
        onCancel={() => setCurrentView('library')}
      />
    );
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="app-header-brand">
          <img src={nagoraLogo} alt="Nagora" className="app-logo" />
          <h1>Editor de Tarjetas</h1>
        </div>
        <button 
          onClick={() => setCurrentView('library')}
          className="library-button"
        >
          🏠 Nagora
        </button>
      </div>
      <p className="subtitle">Haz clic en cualquier elemento de la tarjeta para editarlo</p>
      
      <div className="preview-section-main">
        <div className="preview-card-wrapper">
          <h2 className="preview-label">Front</h2>
          <EditableCardPreview
            title={cardData.front.title}
            subtitle={cardData.front.subtitle}
            exercises={cardData.front.exercises.map(e => ({ name: e.name, repetitions: e.repetitions }))}
            topColor={cardData.front.color}
            onTitleChange={(value) => updateFront('title', value)}
            onSubtitleChange={(value) => updateFront('subtitle', value)}
            onExerciseChange={(index, field, value) => updateExercise('front', index, field, value)}
            onExerciseAdd={() => addExercise('front')}
            onExerciseRemove={(index) => removeExercise('front', index)}
            onColorChange={(color) => updateFront('color', color)}
            side="front"
          />
        </div>

        <div className="preview-card-wrapper">
          <h2 className="preview-label">Back</h2>
          <EditableCardPreview
            title={cardData.back.title}
            subtitle={cardData.back.subtitle}
            exercises={cardData.back.exercises.map(e => ({ name: e.name, repetitions: e.repetitions }))}
            topColor={cardData.back.color}
            onTitleChange={(value) => updateBack('title', value)}
            onSubtitleChange={(value) => updateBack('subtitle', value)}
            onExerciseChange={(index, field, value) => updateExercise('back', index, field, value)}
            onExerciseAdd={() => addExercise('back')}
            onExerciseRemove={(index) => removeExercise('back', index)}
            onColorChange={(color) => updateBack('color', color)}
            side="back"
          />
        </div>
      </div>

      {/* Botón de crear tarjeta */}
      <div className="create-button-container">
        <button onClick={handleCreateCard} className="create-card-btn">
          Crear Tarjeta de Entrenamiento
        </button>
      </div>

      {/* Modal con la tarjeta generada */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>×</button>
            <h2 className="modal-title">Tarjeta Generada</h2>
            <div className="modal-card-container">
              <ExerciseCardFlipWood
                title={cardData.front.title || 'Título'}
                subtitle={cardData.front.subtitle || 'Subtítulo'}
                exercises={cardData.front.exercises.filter(e => e.name.trim() !== '').map(e => e.repetitions ? `${e.name} (${e.repetitions})` : e.name)}
                backSubtitle={cardData.back.subtitle || undefined}
                backExercises={cardData.back.exercises.filter(e => e.name.trim() !== '').map(e => e.repetitions ? `${e.name} (${e.repetitions})` : e.name)}
                topColor={cardData.front.color}
                intensity={0.3}
                perspective={1000}
              />
            </div>
            <div className="modal-actions">
              <button onClick={closeModal} className="modal-close-action-btn">
                Cerrar
              </button>
              <button onClick={handleSendToLibrary} className="modal-send-btn">
                Enviar a Biblioteca
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
