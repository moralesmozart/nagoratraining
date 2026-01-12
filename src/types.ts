export interface Exercise {
  name: string;
  repetitions?: string;
}

export interface CardData {
  id?: string;
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

export type TimerType = 'tabata' | 'normal' | 'reverse';

export interface TimerConfig {
  type: TimerType;
  prepTime: number;
  workTime: number;
  restTime: number;
  rounds: number;
  restBetweenExercises: number;
  // Para contadores normales/reverse
  initialTime?: number; // tiempo inicial en segundos (solo para normal/reverse)
}

export interface ExerciseWithWeight extends Exercise {
  weight?: number;
}

export interface TrainingSession {
  id: string;
  cardId: string;
  date: Date;
  totalTime: number; // en segundos
  exercises: ExerciseWithWeight[];
  timerConfig: TimerConfig;
  status: 'completed' | 'partial';
}

