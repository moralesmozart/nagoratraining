import React, { useMemo } from 'react';
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
  // Calcular el lunes de hace 53 semanas
  const getStartDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Ir 53 semanas atrás
    const weeksAgo = 53;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (weeksAgo * 7));
    
    // Ir al lunes de esa semana (0 = domingo, 1 = lunes, etc.)
    const dayOfWeek = startDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToMonday);
    startDate.setHours(0, 0, 0, 0);
    
    return startDate;
  };

  // Generar todos los días (53 semanas x 7 días = 371 días)
  const allDays = useMemo(() => {
    const startDate = getStartDate();
    const days: DayData[] = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 53 * 7; i++) {
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

  // Organizar en semanas (53 semanas, cada una con 7 días)
  const weeks = useMemo(() => {
    const weeksArray: DayData[][] = [];
    for (let i = 0; i < 53; i++) {
      weeksArray.push(allDays.slice(i * 7, (i + 1) * 7));
    }
    return weeksArray;
  }, [allDays]);

  // Calcular qué meses mostrar - mostrar en la primera semana que contiene días de ese mes
  const monthLabels = useMemo(() => {
    const labels: { month: string; weekIndex: number }[] = [];
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const seenMonths = new Set<number>();

    weeks.forEach((week, weekIndex) => {
      if (week.length > 0) {
        // Buscar el primer día de la semana que pertenece a un mes que no hemos visto
        const firstDay = week[0].date;
        const month = firstDay.getMonth();
        
        if (!seenMonths.has(month)) {
          // Este es el primer mes que encontramos en esta semana
          labels.push({
            month: monthNames[month],
            weekIndex,
          });
          seenMonths.add(month);
        }
      }
    });

    return labels;
  }, [weeks]);

  // Calcular intensidad de color
  const maxCount = Math.max(...allDays.map(d => d.count), 1);
  const getIntensity = (count: number): number => {
    if (count === 0) return 0;
    const ratio = count / maxCount;
    if (ratio >= 0.75) return 4;
    if (ratio >= 0.5) return 3;
    if (ratio >= 0.25) return 2;
    return 1;
  };

  // Actividades recientes
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

        return { session, cardName, date, timeStr };
      });
  }, [sessions, cards]);

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
          <strong>{sessions.length}</strong> {sessions.length === 1 ? 'entrenamiento' : 'entrenamientos'} en el último año
        </div>
      </div>

      <div className="contribution-graph-wrapper">
        {/* Meses */}
        <div className="months-row">
          <div className="days-label-spacer"></div>
          <div className="months-grid">
            {monthLabels.map(({ month, weekIndex }) => (
              <div
                key={`${month}-${weekIndex}`}
                className="month-label"
                style={{ gridColumnStart: weekIndex + 1 }}
              >
                {month}
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico principal */}
        <div className="graph-main">
          {/* Etiquetas de días */}
          <div className="days-labels">
            <div className="day-label">Lun</div>
            <div className="day-label">Mar</div>
            <div className="day-label">Mié</div>
            <div className="day-label">Jue</div>
            <div className="day-label">Vie</div>
            <div className="day-label">Sáb</div>
            <div className="day-label">Dom</div>
          </div>

          {/* Cuadrados de contribución */}
          <div className="squares-container">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="week-column">
                {week.map((day, dayIndex) => {
                  const intensity = getIntensity(day.count);
                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`square intensity-${intensity}`}
                      title={`${day.count} ${day.count === 1 ? 'entrenamiento' : 'entrenamientos'} - ${formatDate(day.date)}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Leyenda */}
        <div className="legend">
          <span>Menos</span>
          <div className="legend-squares">
            {[0, 1, 2, 3, 4].map(level => (
              <div key={level} className={`legend-square intensity-${level}`}></div>
            ))}
          </div>
          <span>Más</span>
        </div>
      </div>

      {/* Actividades recientes */}
      {recentActivities.length > 0 && (
        <div className="recent-activities">
          <h3>Actividad reciente</h3>
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

