import React, { useMemo, useState } from 'react';
import type { TrainingSession, CardData } from './types';
import './TrainingContributionGraph.css';

interface TrainingContributionGraphProps {
  sessions: TrainingSession[];
  cards: CardData[];
}

interface DayData {
  date: Date;
  count: number;
  sessions: TrainingSession[];
}

const TrainingContributionGraph: React.FC<TrainingContributionGraphProps> = ({ sessions, cards }) => {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);

  // Generar datos para el último año
  const contributionData = useMemo(() => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    oneYearAgo.setDate(oneYearAgo.getDate() - (oneYearAgo.getDay() || 7) + 1); // Lunes de la semana

    const days: DayData[] = [];
    const currentDate = new Date(oneYearAgo);

    // Generar todos los días del último año (53 semanas)
    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const daySessions = sessions.filter(s => {
        const sessionDate = new Date(s.date);
        return sessionDate.toISOString().split('T')[0] === dateStr;
      });

      days.push({
        date: new Date(currentDate),
        count: daySessions.length,
        sessions: daySessions,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }, [sessions]);

  // Agrupar por semanas (53 semanas)
  const weeks = useMemo(() => {
    const weeksArray: DayData[][] = [];
    let currentWeek: DayData[] = [];

    contributionData.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === contributionData.length - 1) {
        weeksArray.push([...currentWeek]);
        currentWeek = [];
      }
    });

    return weeksArray;
  }, [contributionData]);

  // Calcular total de contribuciones
  const totalContributions = useMemo(() => {
    return sessions.length;
  }, [sessions]);

  // Obtener el nivel de intensidad del color basado en el conteo
  const getIntensityLevel = (count: number, maxCount: number): number => {
    if (count === 0) return 0;
    if (maxCount === 0) return 0;
    const ratio = count / maxCount;
    if (ratio >= 0.75) return 4;
    if (ratio >= 0.5) return 3;
    if (ratio >= 0.25) return 2;
    return 1;
  };

  const maxCount = Math.max(...contributionData.map(d => d.count), 1);

  // Obtener las últimas actividades (últimas 10 sesiones)
  const recentActivities = useMemo(() => {
    return sessions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .map(session => {
        const card = cards.find(c => (c.id || '') === session.cardId);
        const cardName = card?.front.title || 'Entrenamiento sin nombre';
        const date = new Date(session.date);
        const timeInMinutes = Math.floor(session.totalTime / 60);
        const timeInSeconds = session.totalTime % 60;
        const timeStr = timeInMinutes > 0 
          ? `${timeInMinutes}m ${timeInSeconds}s`
          : `${timeInSeconds}s`;

        return {
          session,
          cardName,
          date,
          timeStr,
        };
      });
  }, [sessions, cards]);

  // Nombres de los meses
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  // Obtener qué meses mostrar
  const visibleMonths = useMemo(() => {
    const months: { month: string; weekIndex: number }[] = [];
    const monthPositions: { [key: number]: boolean } = {};

    weeks.forEach((week, weekIndex) => {
      if (week.length > 0) {
        // Verificar si el primer día de la semana es el primer día del mes
        // o si es la primera semana que contiene días de ese mes
        const firstDay = week[0].date;
        const month = firstDay.getMonth();
        
        // Mostrar el mes si:
        // 1. Es el primer día del mes (día 1)
        // 2. O si es la primera semana que contiene ese mes y no hemos mostrado ese mes aún
        const isFirstDayOfMonth = firstDay.getDate() <= 7;
        
        if (isFirstDayOfMonth && !monthPositions[weekIndex]) {
          months.push({
            month: monthNames[month],
            weekIndex,
          });
          monthPositions[weekIndex] = true;
        }
      }
    });

    return months;
  }, [weeks]);

  const handleDayMouseEnter = (day: DayData, event: React.MouseEvent) => {
    setHoveredDay(day);
    setHoverPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleDayMouseLeave = () => {
    setHoveredDay(null);
    setHoverPosition(null);
  };

  const formatDate = (date: Date): string => {
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <div className="contribution-graph-container">
      <div className="contribution-graph-header">
        <div className="contribution-summary">
          <strong>{totalContributions}</strong> {totalContributions === 1 ? 'entrenamiento' : 'entrenamientos'} en el último año
        </div>
      </div>

      <div className="contribution-graph-wrapper">
        <div className="contribution-graph">
          <div className="graph-months">
            {visibleMonths.map(({ month, weekIndex }) => (
              <div
                key={`${month}-${weekIndex}`}
                className="month-label"
                style={{ 
                  gridColumn: weekIndex + 1,
                  textAlign: 'left',
                  paddingLeft: '2px'
                }}
              >
                {month}
              </div>
            ))}
          </div>

          <div className="graph-content">
            <div className="graph-days-labels">
              <span>Lun</span>
              <span></span>
              <span>Mié</span>
              <span></span>
              <span>Vie</span>
              <span></span>
              <span></span>
            </div>

            <div className="graph-squares">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="week-column">
                  {week.map((day, dayIndex) => {
                    const intensity = getIntensityLevel(day.count, maxCount);
                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`contribution-square intensity-${intensity}`}
                        onMouseEnter={(e) => handleDayMouseEnter(day, e)}
                        onMouseLeave={handleDayMouseLeave}
                        data-count={day.count}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="graph-legend">
          <span className="legend-label">Menos</span>
          <div className="legend-squares">
            <div className="legend-square intensity-0"></div>
            <div className="legend-square intensity-1"></div>
            <div className="legend-square intensity-2"></div>
            <div className="legend-square intensity-3"></div>
            <div className="legend-square intensity-4"></div>
          </div>
          <span className="legend-label">Más</span>
        </div>
      </div>

      {/* Tooltip al hacer hover */}
      {hoveredDay && hoverPosition && (
        <div
          className="contribution-tooltip"
          style={{
            left: `${hoverPosition.x}px`,
            top: `${hoverPosition.y - 10}px`,
          }}
        >
          <div className="tooltip-content">
            <div className="tooltip-count">
              <strong>{hoveredDay.count}</strong> {hoveredDay.count === 1 ? 'entrenamiento' : 'entrenamientos'} el {formatDate(hoveredDay.date)}
            </div>
          </div>
        </div>
      )}

      {/* Actividades recientes */}
      {recentActivities.length > 0 && (
        <div className="recent-activities">
          <h3 className="activities-title">Actividad reciente</h3>
          <div className="activities-list">
            {recentActivities.map((activity, index) => (
              <div key={activity.session.id || index} className="activity-item">
                <div className="activity-date">
                  {activity.date.toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
                <div className="activity-text">
                  Mozart hizo un entrenamiento <strong>{activity.cardName}</strong> en <strong>{activity.timeStr}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingContributionGraph;

