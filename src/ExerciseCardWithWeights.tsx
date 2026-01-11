import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { CardData } from './types';
import './ExerciseCardWithWeights.css';

interface ExerciseCardWithWeightsProps {
  card: CardData;
  weights: { [key: number]: number };
  onWeightChange: (exerciseIndex: number, weight: number) => void;
  completedExercises?: Set<number>;
  currentExercise?: number;
  autoFlip?: boolean; // Nueva prop para controlar el flip automático
}

const ExerciseCardWithWeights: React.FC<ExerciseCardWithWeightsProps> = ({
  card,
  weights,
  onWeightChange,
  completedExercises = new Set(),
  currentExercise = -1,
  autoFlip = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingWeight, setIsEditingWeight] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const weightInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const lastAutoFlippedExerciseRef = useRef<number>(-1); // Rastrear el último ejercicio que activó el flip automático
  const intensity = 0.3;
  const perspective = 1000;

  const hasBackContent = card.back.exercises.length > 0 || card.back.subtitle;
  
  const frontExercises = card.front.exercises.filter(e => e.name.trim() !== '');
  const backExercises = card.back.exercises.filter(e => e.name.trim() !== '');
  
  // Efecto para rotar automáticamente cuando el ejercicio actual está en el back
  // Solo se activa cuando cambia el ejercicio, no cuando el usuario rota manualmente
  useEffect(() => {
    if (autoFlip && currentExercise >= 0 && hasBackContent) {
      // Solo hacer flip automático si el ejercicio cambió
      if (currentExercise !== lastAutoFlippedExerciseRef.current) {
        const shouldBeFlipped = currentExercise >= frontExercises.length;
        setIsFlipped(shouldBeFlipped);
        lastAutoFlippedExerciseRef.current = currentExercise;
        
        if (innerRef.current) {
          innerRef.current.style.transition = 'transform 0.6s ease-in-out';
          if (shouldBeFlipped) {
            innerRef.current.style.transform = 'rotateY(180deg)';
          } else {
            innerRef.current.style.transform = 'rotateY(0deg)';
          }
        }
      }
    }
  }, [autoFlip, currentExercise, frontExercises.length, hasBackContent]);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // No hacer flip si se hace clic en elementos interactivos
    // Verificar primero los elementos más específicos
    if (
      target.tagName === 'INPUT' ||
      target.classList.contains('weight-display') ||
      target.classList.contains('weight-input')
    ) {
      return;
    }
    
    // Verificar si el clic fue en cualquier elemento dentro del contenedor de peso
    const weightContainer = target.closest('.exercise-weight-container');
    if (weightContainer) {
      return;
    }
    
    if (!hasBackContent) return;
    
    // Cancelar cualquier animación del mouse
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    const newFlippedState = !isFlipped;
    setIsFlipped(newFlippedState);
    // Cuando el usuario rota manualmente, actualizar la referencia para evitar que el auto-flip sobrescriba
    if (autoFlip) {
      lastAutoFlippedExerciseRef.current = -1; // Resetear para permitir que el usuario tenga control manual
    }
    // Resetear transformación del mouse y aplicar solo el flip
    if (innerRef.current) {
      innerRef.current.style.transition = 'transform 0.6s ease-in-out';
      if (newFlippedState) {
        innerRef.current.style.transform = 'rotateY(180deg)';
      } else {
        innerRef.current.style.transform = 'rotateY(0deg)';
      }
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !innerRef.current) return;

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      if (!containerRef.current || !innerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateY = (mouseX / rect.width) * intensity * 15;
      const rotateX = -(mouseY / rect.height) * intensity * 15;

      // Combinar el efecto 3D del mouse con el flip si está volteada
      const flipTransform = isFlipped ? 'rotateY(180deg)' : '';
      innerRef.current.style.transform = `${flipTransform} rotateX(${rotateX}deg) rotateY(${rotateY}deg)`.trim();
    });
  }, [intensity, isFlipped]);

  const handleMouseLeave = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    setIsHovered(false);
    if (innerRef.current) {
      // Mantener el flip pero resetear el efecto 3D del mouse
      if (isFlipped) {
        innerRef.current.style.transform = 'rotateY(180deg)';
      } else {
        innerRef.current.style.transform = '';
      }
    }
  }, [isFlipped]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleWeightClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Prevenir el flip cuando se hace clic en el peso
    setIsEditingWeight(index);
    setTimeout(() => {
      weightInputRefs.current[index]?.focus();
      weightInputRefs.current[index]?.select();
    }, 100);
  };

  const handleWeightBlur = (index: number, value: string) => {
    const weight = parseFloat(value) || 0;
    onWeightChange(index, weight);
    setIsEditingWeight(null);
  };
  
  // Calcular índices para los ejercicios del back (continúan después de los del front)
  const getBackExerciseIndex = (backIndex: number) => {
    return frontExercises.length + backIndex;
  };

  return (
    <div 
      ref={containerRef}
      className={`exercise-card-with-weights ${isFlipped ? 'flipped' : ''}`}
      onClick={hasBackContent ? handleClick : undefined}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: `${perspective}px` }}
    >
      <div 
        ref={innerRef}
        className="exercise-card-inner"
        style={{
          transition: isHovered ? 'none' : 'transform 0.6s ease-in-out',
        }}
      >
        <div className="exercise-card-front">
          {card.front.title && (
            <>
              <div 
                className="exercise-card-header"
                style={{ backgroundColor: card.front.color }}
              >
                <h2 className="exercise-card-title">{card.front.title}</h2>
              </div>
              <div className="exercise-card-divider"></div>
            </>
          )}
          
          <div className="exercise-card-content">
            {card.front.subtitle && (
              <p className="exercise-card-subtitle">{card.front.subtitle}</p>
            )}
            
            <ul className="exercise-card-list">
              {frontExercises.map((exercise, index) => {
                const isCompleted = completedExercises.has(index);
                const isCurrent = currentExercise === index;
                
                return (
                  <li 
                    key={index} 
                    className={`exercise-card-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                  >
                    <div className="exercise-item-content">
                      <span className="exercise-name">
                        {isCompleted && <span className="checkmark">✓</span>}
                        {exercise.name}
                        {exercise.repetitions && (
                          <span className="exercise-reps"> ({exercise.repetitions})</span>
                        )}
                      </span>
                      <div className="exercise-weight-container">
                        {isEditingWeight === index ? (
                          <input
                            ref={(el) => weightInputRefs.current[index] = el}
                            type="number"
                            defaultValue={weights[index] || ''}
                            onBlur={(e) => handleWeightBlur(index, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.blur();
                              }
                            }}
                            className="weight-input"
                            placeholder="0"
                            min="0"
                            step="0.5"
                          />
                        ) : (
                          <span 
                            className={`weight-display ${weights[index] ? 'has-weight' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleWeightClick(e, index);
                            }}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            {weights[index] ? `${weights[index]}kg` : 'Peso'}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Cara trasera */}
        {hasBackContent && (
          <div className="exercise-card-back">
            {card.back.title && card.back.title === card.front.title ? (
              <>
                {card.back.title && (
                  <>
                    <div 
                      className="exercise-card-header"
                      style={{ backgroundColor: card.front.color }}
                    >
                      <h2 className="exercise-card-title">{card.back.title}</h2>
                    </div>
                    <div className="exercise-card-divider"></div>
                  </>
                )}
              </>
            ) : card.back.title ? (
              <>
                <div 
                  className="exercise-card-header"
                  style={{ backgroundColor: card.front.color }}
                >
                  <h2 className="exercise-card-title">{card.back.title}</h2>
                </div>
                <div className="exercise-card-divider"></div>
              </>
            ) : null}
            
            <div className="exercise-card-content">
              {card.back.subtitle && (
                <p className="exercise-card-subtitle">{card.back.subtitle}</p>
              )}
              
              {backExercises.length > 0 && (
                <ul className="exercise-card-list">
                  {backExercises.map((exercise, backIndex) => {
                    const exerciseIndex = getBackExerciseIndex(backIndex);
                    const isCompleted = completedExercises.has(exerciseIndex);
                    const isCurrent = currentExercise === exerciseIndex;
                    
                    return (
                      <li 
                        key={backIndex} 
                        className={`exercise-card-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                      >
                        <div className="exercise-item-content">
                          <span className="exercise-name">
                            {isCompleted && <span className="checkmark">✓</span>}
                            {exercise.name}
                            {exercise.repetitions && (
                              <span className="exercise-reps"> ({exercise.repetitions})</span>
                            )}
                          </span>
                          <div className="exercise-weight-container">
                            {isEditingWeight === exerciseIndex ? (
                              <input
                                ref={(el) => weightInputRefs.current[exerciseIndex] = el}
                                type="number"
                                defaultValue={weights[exerciseIndex] || ''}
                                onBlur={(e) => handleWeightBlur(exerciseIndex, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.currentTarget.blur();
                                  }
                                }}
                                className="weight-input"
                                placeholder="0"
                                min="0"
                                step="0.5"
                              />
                            ) : (
                              <span 
                                className={`weight-display ${weights[exerciseIndex] ? 'has-weight' : ''}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleWeightClick(e, exerciseIndex);
                                }}
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                {weights[exerciseIndex] ? `${weights[exerciseIndex]}kg` : 'Peso'}
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseCardWithWeights;

