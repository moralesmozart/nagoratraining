import React, { useState, useRef, useEffect } from 'react';
import './EditableCardPreview.css';

interface Exercise {
  name: string;
  repetitions?: string;
}

interface EditableCardPreviewProps {
  title: string;
  subtitle: string;
  exercises: Exercise[];
  topColor: string;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onExerciseChange: (index: number, field: 'name' | 'repetitions', value: string) => void;
  onExerciseAdd: () => void;
  onExerciseRemove: (index: number) => void;
  onColorChange: (color: string) => void;
  side?: 'front' | 'back';
}

const EditableCardPreview: React.FC<EditableCardPreviewProps> = ({
  title,
  subtitle,
  exercises,
  topColor,
  onTitleChange,
  onSubtitleChange,
  onExerciseChange,
  onExerciseAdd,
  onExerciseRemove,
  onColorChange,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);
  const [isEditingExercise, setIsEditingExercise] = useState<number | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const subtitleInputRef = useRef<HTMLInputElement>(null);
  const exerciseInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const titleJustActivatedRef = useRef(false);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      // Usar requestAnimationFrame para asegurar que el DOM esté listo
      requestAnimationFrame(() => {
        if (titleInputRef.current) {
          titleInputRef.current.focus();
          // Solo seleccionar el texto cuando se activa la edición por primera vez
          if (titleJustActivatedRef.current) {
            if (title && title.length > 0) {
              titleInputRef.current.select();
            } else {
              const length = titleInputRef.current.value.length;
              titleInputRef.current.setSelectionRange(length, length);
            }
            titleJustActivatedRef.current = false;
          } else {
            // Si ya estaba editando, mantener el cursor al final
            const length = titleInputRef.current.value.length;
            titleInputRef.current.setSelectionRange(length, length);
          }
        }
      });
    }
  }, [isEditingTitle, title]);

  useEffect(() => {
    if (isEditingSubtitle && subtitleInputRef.current) {
      subtitleInputRef.current.focus();
      subtitleInputRef.current.select();
    }
  }, [isEditingSubtitle]);

  useEffect(() => {
    if (isEditingExercise !== null && exerciseInputRefs.current[isEditingExercise]) {
      exerciseInputRefs.current[isEditingExercise]?.focus();
      exerciseInputRefs.current[isEditingExercise]?.select();
    }
  }, [isEditingExercise]);

  // Cerrar el color picker cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // No cerrar si se hace clic en el trigger del color picker o dentro del popup
      if (colorPickerRef.current && !colorPickerRef.current.contains(target) && !target.closest('.color-picker-trigger')) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      // Usar un pequeño delay para evitar que se cierre inmediatamente al abrir
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showColorPicker]);

  const handleTitleClick = () => {
    titleJustActivatedRef.current = true;
    setIsEditingTitle(true);
  };

  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // No cerrar si el focus se movió al color picker
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && (relatedTarget.closest('.color-picker-popup') || relatedTarget.closest('.color-picker-trigger'))) {
      return;
    }
    setIsEditingTitle(false);
  };

  const handleSubtitleClick = () => {
    setIsEditingSubtitle(true);
  };

  const handleSubtitleBlur = () => {
    setIsEditingSubtitle(false);
  };

  const handleExerciseClick = (index: number) => {
    setIsEditingExercise(index);
  };

  const handleExerciseBlur = (e: React.FocusEvent) => {
    // Esperar un poco para verificar si el focus se movió a otro campo del mismo ejercicio
    setTimeout(() => {
      const activeElement = document.activeElement;
      const exerciseRow = e.currentTarget.closest('.exercise-edit-row');
      if (exerciseRow && exerciseRow.contains(activeElement)) {
        // El focus está todavía dentro del mismo ejercicio, no cerrar
        return;
      }
      setIsEditingExercise(null);
    }, 100);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleSubtitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleExerciseKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="editable-card-preview">
      {title ? (
        <>
          <div 
            className="card-preview-header"
            style={{ backgroundColor: topColor || '#3b82f6' }}
          >
            <div 
              className="color-picker-trigger" 
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setShowColorPicker(!showColorPicker);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              🎨
            </div>
            {showColorPicker && (
              <div ref={colorPickerRef} className="color-picker-popup" onClick={(e) => e.stopPropagation()}>
                <input
                  type="color"
                  value={topColor || '#3b82f6'}
                  onChange={(e) => {
                    const newColor = e.target.value;
                    onColorChange(newColor);
                  }}
                  className="color-picker-input"
                />
                <input
                  type="text"
                  value={topColor || '#3b82f6'}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                      if (value.match(/^#[0-9A-Fa-f]{6}$/)) {
                        onColorChange(value);
                      } else if (value.length === 0 || value === '#') {
                        // Permitir borrar o empezar a escribir
                      }
                    }
                  }}
                  onBlur={(e) => {
                    // Si el valor no es válido al perder el foco, restaurar el color anterior
                    const value = e.target.value;
                    if (!value.match(/^#[0-9A-Fa-f]{6}$/)) {
                      e.target.value = topColor || '#3b82f6';
                    }
                  }}
                  className="color-text-input"
                  placeholder="#3b82f6"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowColorPicker(false);
                  }} 
                  className="close-picker-btn"
                >
                  ✓
                </button>
              </div>
            )}
            
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                value={title || ''}
                onChange={(e) => {
                  onTitleChange(e.target.value);
                }}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="editable-title-input"
                placeholder="Título"
                autoFocus
              />
            ) : (
              <h2 
                className="card-preview-title editable"
                onClick={handleTitleClick}
              >
                {title}
              </h2>
            )}
          </div>
          
          <div className="card-preview-divider"></div>
        </>
      ) : (
        <div className="card-preview-header-empty">
          <div 
            className="color-picker-trigger" 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setShowColorPicker(!showColorPicker);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            🎨
          </div>
          {showColorPicker && (
            <div ref={colorPickerRef} className="color-picker-popup" onClick={(e) => e.stopPropagation()}>
              <input
                type="color"
                value={topColor || '#3b82f6'}
                onChange={(e) => {
                  const newColor = e.target.value;
                  onColorChange(newColor);
                }}
                className="color-picker-input"
              />
              <input
                type="text"
                value={topColor || '#3b82f6'}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                    if (value.match(/^#[0-9A-Fa-f]{6}$/)) {
                      onColorChange(value);
                    }
                  }
                }}
                onBlur={(e) => {
                  // Si el valor no es válido al perder el foco, restaurar el color anterior
                  const value = e.target.value;
                  if (!value.match(/^#[0-9A-Fa-f]{6}$/)) {
                    e.target.value = topColor || '#3b82f6';
                  }
                }}
                className="color-text-input"
                placeholder="#3b82f6"
              />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowColorPicker(false);
                }} 
                className="close-picker-btn"
              >
                ✓
              </button>
            </div>
          )}
          
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={title || ''}
              onChange={(e) => {
                onTitleChange(e.target.value);
              }}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="editable-title-input-empty"
              placeholder="Título (click para editar)"
              autoFocus
            />
          ) : (
            <h2 
              className="card-preview-title editable empty"
              onClick={handleTitleClick}
            >
              Título (click para editar)
            </h2>
          )}
        </div>
      )}
      
      <div className="card-preview-content">
        {isEditingSubtitle ? (
          <input
            ref={subtitleInputRef}
            type="text"
            value={subtitle || ''}
            onChange={(e) => onSubtitleChange(e.target.value)}
            onBlur={handleSubtitleBlur}
            onKeyDown={handleSubtitleKeyDown}
            className="editable-subtitle-input"
            placeholder="Subtítulo"
          />
        ) : subtitle ? (
          <p 
            className="card-preview-subtitle editable"
            onClick={handleSubtitleClick}
          >
            {subtitle}
          </p>
        ) : (
          <p 
            className="card-preview-subtitle editable empty"
            onClick={handleSubtitleClick}
          >
            Subtítulo (click para editar)
          </p>
        )}
        
        <ul className="card-preview-list">
          {exercises.length > 0 ? (
            exercises.map((exercise, index) => (
              <li key={index} className="card-preview-item">
                {isEditingExercise === index ? (
                  <div className="exercise-edit-row">
                    <input
                      ref={(el) => { exerciseInputRefs.current[index] = el; }}
                      type="text"
                      value={exercise.name}
                      onChange={(e) => onExerciseChange(index, 'name', e.target.value)}
                      onBlur={handleExerciseBlur}
                      onKeyDown={(e) => {
                        if (e.key === 'Tab' && !e.shiftKey) {
                          e.preventDefault();
                          const repsInput = e.currentTarget.parentElement?.querySelector('.editable-repetitions-input') as HTMLInputElement;
                          repsInput?.focus();
                        } else {
                          handleExerciseKeyDown(e);
                        }
                      }}
                      className="editable-exercise-input"
                      placeholder="Ejercicio"
                    />
                    <input
                      type="text"
                      value={exercise.repetitions || ''}
                      onChange={(e) => onExerciseChange(index, 'repetitions', e.target.value)}
                      onBlur={handleExerciseBlur}
                      onKeyDown={(e) => {
                        if (e.key === 'Tab' && e.shiftKey) {
                          e.preventDefault();
                          const nameInput = e.currentTarget.parentElement?.querySelector('.editable-exercise-input') as HTMLInputElement;
                          nameInput?.focus();
                        } else {
                          handleExerciseKeyDown(e);
                        }
                      }}
                      className="editable-repetitions-input"
                      placeholder="Reps"
                    />
                    {exercises.length > 1 && (
                      <button
                        onClick={() => {
                          onExerciseRemove(index);
                          setIsEditingExercise(null);
                        }}
                        className="remove-exercise-btn"
                        type="button"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="exercise-display-row">
                    <span 
                      className="editable-exercise-text"
                      onClick={() => handleExerciseClick(index)}
                    >
                      {exercise.name || `Ejercicio ${index + 1} (click para editar)`}
                    </span>
                    {exercise.repetitions && (
                      <span className="exercise-repetitions">{exercise.repetitions}</span>
                    )}
                    {!exercise.repetitions && (
                      <span 
                        className="editable-repetitions-placeholder"
                        onClick={() => handleExerciseClick(index)}
                      >
                        Reps
                      </span>
                    )}
                  </div>
                )}
              </li>
            ))
          ) : (
            <li 
              className="card-preview-item empty editable"
              onClick={() => {
                onExerciseAdd();
                setTimeout(() => setIsEditingExercise(0), 100);
              }}
            >
              + Agregar ejercicio (click aquí)
            </li>
          )}
          <li className="card-preview-item add-exercise-item">
            <button
              onClick={() => {
                onExerciseAdd();
                const newIndex = exercises.length;
                setTimeout(() => setIsEditingExercise(newIndex), 100);
              }}
              className="add-exercise-inline-btn"
            >
              + Agregar Ejercicio
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EditableCardPreview;

