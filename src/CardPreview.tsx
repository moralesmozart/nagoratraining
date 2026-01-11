import React from 'react';
import './CardPreview.css';

interface CardPreviewProps {
  title: string;
  subtitle: string;
  exercises: string[];
  topColor: string;
}

const CardPreview: React.FC<CardPreviewProps> = ({
  title,
  subtitle,
  exercises,
  topColor,
}) => {
  return (
    <div className="card-preview">
      <div 
        className="card-preview-header"
        style={{ backgroundColor: topColor }}
      >
        <h2 className="card-preview-title">{title || 'Título'}</h2>
      </div>
      
      <div className="card-preview-divider"></div>
      
      <div className="card-preview-content">
        <p className="card-preview-subtitle">{subtitle || 'Subtítulo'}</p>
        
        <ul className="card-preview-list">
          {exercises.length > 0 ? (
            exercises.map((exercise, index) => (
              <li key={index} className="card-preview-item">
                {exercise}
              </li>
            ))
          ) : (
            <li className="card-preview-item empty">Ejercicio 1</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CardPreview;

