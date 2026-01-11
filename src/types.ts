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

export interface TimerConfig {
  prepTime: number;
  workTime: number;
  restTime: number;
  rounds: number;
  restBetweenExercises: number;
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

