import React, { useState, useRef, useCallback } from 'react';
import './ExerciseCardFlip.css';

interface ExerciseCardFlipProps {
  title: string;
  subtitle: string;
  exercises: string[];
  // Contenido del reverso
  backSubtitle?: string;
  backExercises?: string[];
  topColor?: string;
  intensity?: number; // Intensidad del efecto 3D (0-1)
  perspective?: number; // Distancia de perspectiva en píxeles
  className?: string;
}

const ExerciseCardFlip: React.FC<ExerciseCardFlipProps> = ({
  title,
  subtitle,
  exercises,
  backSubtitle,
  backExercises = [],
  topColor = '#3b82f6',
  intensity = 0.3,
  perspective = 1000,
  className = '',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  const handleClick = () => {
    // Cancelar cualquier animación del mouse
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    const newFlippedState = !isFlipped;
    setIsFlipped(newFlippedState);
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

    // Cancelar animación anterior si existe
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    // Usar requestAnimationFrame para mejor rendimiento
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

  const hasBackContent = backExercises.length > 0 || backSubtitle;

  return (
    <div 
      ref={containerRef}
      className={`flip-card ${className} ${isFlipped ? 'flipped' : ''}`}
      onClick={hasBackContent ? handleClick : undefined}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: `${perspective}px` }}
    >
      <div 
        ref={innerRef}
        className="flip-card-inner"
        style={{
          transition: isHovered ? 'none' : 'transform 0.6s ease-in-out',
        }}
      >
        {/* Cara frontal */}
        <div className="flip-card-front">
          <div 
            className="exercise-card-header"
            style={{ backgroundColor: topColor }}
          >
            <h2 className="exercise-card-title">{title}</h2>
          </div>
          
          <div className="exercise-card-divider"></div>
          
          <div className="exercise-card-content">
            <p className="exercise-card-subtitle">{subtitle}</p>
            
            <ul className="exercise-card-list">
              {exercises.map((exercise, index) => (
                <li key={index} className="exercise-card-item">
                  {exercise}
                </li>
              ))}
            </ul>
          </div>

          {/* Indicador de flip */}
          {hasBackContent && (
            <div className="flip-indicator">
              <span className="flip-arrow">⇄</span>
              <span className="flip-text">Haz clic para voltear</span>
            </div>
          )}
        </div>

        {/* Cara trasera */}
        {hasBackContent && (
          <div className="flip-card-back">
            <div 
              className="exercise-card-header"
              style={{ backgroundColor: topColor }}
            >
              <h2 className="exercise-card-title">{title}</h2>
            </div>
            
            <div className="exercise-card-divider"></div>
            
            <div className="exercise-card-content">
              {backSubtitle && (
                <p className="exercise-card-subtitle">{backSubtitle}</p>
              )}
              
              {backExercises.length > 0 && (
                <ul className="exercise-card-list">
                  {backExercises.map((exercise, index) => (
                    <li key={index} className="exercise-card-item">
                      {exercise}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Indicador de flip */}
            <div className="flip-indicator">
              <span className="flip-arrow">⇄</span>
              <span className="flip-text">Haz clic para voltear</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseCardFlip;

