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

  // Generar datos para el último año (53 semanas completas)
  const contributionData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calcular el lunes de hace 53 semanas
    const weeksAgo = 53;
    const oneYearAgo = new Date(today);
    oneYearAgo.setDate(today.getDate() - (weeksAgo * 7));
    
    // Ir al lunes de esa semana
    const dayOfWeek = oneYearAgo.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    oneYearAgo.setDate(oneYearAgo.getDate() - daysToMonday);
    oneYearAgo.setHours(0, 0, 0, 0);

    const days: DayData[] = [];
    const currentDate = new Date(oneYearAgo);

    // Generar exactamente 53 semanas (371 días)
    const totalDays = 53 * 7;
    for (let i = 0; i < totalDays; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const daySessions = sessions.filter(s => {
        const sessionDate = s.date instanceof Date ? s.date : new Date(s.date);
        sessionDate.setHours(0, 0, 0, 0);
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

  // Agrupar por semanas (53 semanas, cada una con 7 días)
  const weeks = useMemo(() => {
    const weeksArray: DayData[][] = [];
    
    for (let i = 0; i < 53; i++) {
      const weekStart = i * 7;
      const week = contributionData.slice(weekStart, weekStart + 7);
      weeksArray.push(week);
    }

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

  // Obtener qué meses mostrar - solo mostrar cuando el primer día de la semana es del mes
  const visibleMonths = useMemo(() => {
    const months: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      if (week.length > 0) {
        const firstDay = week[0].date;
        const month = firstDay.getMonth();
        
        // Mostrar el mes solo si es diferente al anterior y el día es 1-7 (primera semana del mes)
        if (month !== lastMonth && firstDay.getDate() <= 7) {
          months.push({
            month: monthNames[month],
            weekIndex,
          });
          lastMonth = month;
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
          {/* Meses - alineados con las columnas de semanas */}
          <div className="graph-months-container">
            <div className="graph-months-spacer"></div>
            <div className="graph-months">
              {visibleMonths.map(({ month, weekIndex }) => (
                <div
                  key={`${month}-${weekIndex}`}
                  className="month-label"
                  style={{ 
                    gridColumn: weekIndex + 1,
                  }}
                >
                  {month}
                </div>
              ))}
            </div>
          </div>

          {/* Contenido del gráfico */}
          <div className="graph-content">
            {/* Etiquetas de días de la semana */}
            <div className="graph-days-labels">
              <span className="day-label">Lun</span>
              <span className="day-label-empty"></span>
              <span className="day-label">Mié</span>
              <span className="day-label-empty"></span>
              <span className="day-label">Vie</span>
              <span className="day-label-empty"></span>
              <span className="day-label-empty"></span>
            </div>

            {/* Grid de cuadrados */}
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
                        title={`${day.count} ${day.count === 1 ? 'entrenamiento' : 'entrenamientos'}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leyenda */}
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
