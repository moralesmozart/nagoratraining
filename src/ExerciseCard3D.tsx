import React, { useRef, useState, useCallback, useMemo } from 'react';
import './ExerciseCard3D.css';

interface ExerciseCard3DProps {
  title: string;
  subtitle: string;
  exercises: string[];
  topColor?: string; // Color de la sección superior
  intensity?: number; // Intensidad del efecto 3D (0-1)
  perspective?: number; // Distancia de perspectiva en píxeles
  className?: string;
}

const ExerciseCard3D: React.FC<ExerciseCard3DProps> = ({
  title,
  subtitle,
  exercises,
  topColor = '#3b82f6', // Azul por defecto
  intensity = 0.3,
  perspective = 1000,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !wrapperRef.current) return;

    // Cancelar animación anterior si existe
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    // Usar requestAnimationFrame para mejor rendimiento
    rafIdRef.current = requestAnimationFrame(() => {
      if (!containerRef.current || !wrapperRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateY = (mouseX / rect.width) * intensity * 15;
      const rotateX = -(mouseY / rect.height) * intensity * 15;

      // Aplicar transformación directamente al DOM para mejor rendimiento
      wrapperRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    setIsHovered(false);
    if (wrapperRef.current) {
      wrapperRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  // Memoizar el estilo del header para evitar re-renders
  const headerStyle = useMemo(() => ({ backgroundColor: topColor }), [topColor]);

  return (
    <div
      ref={containerRef}
      className={`exercise-card-3d-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ perspective: `${perspective}px` }}
    >
      <div
        ref={wrapperRef}
        className="exercise-card-3d-wrapper"
        style={{
          transition: isHovered ? 'none' : 'transform 0.4s ease-out',
        }}
      >
        <div className="exercise-card-3d">
          {/* Sección superior con color y título */}
          <div 
            className="exercise-card-header"
            style={headerStyle}
          >
            <h2 className="exercise-card-title">{title}</h2>
          </div>
          
          {/* Línea divisoria */}
          <div className="exercise-card-divider"></div>
          
          {/* Contenido principal */}
          <div className="exercise-card-content">
            <p className="exercise-card-subtitle">{subtitle}</p>
            
            {/* Lista de ejercicios */}
            <ul className="exercise-card-list">
              {exercises.map((exercise, index) => (
                <li key={index} className="exercise-card-item">
                  {exercise}
                </li>
              ))}
            </ul>
          </div>

          {/* Indicador de flechas - aparece en hover */}
          <div className={`flip-indicator ${isHovered ? 'visible' : ''}`}>
            <span className="flip-arrow left">←</span>
            <span className="flip-arrow right">→</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard3D;
