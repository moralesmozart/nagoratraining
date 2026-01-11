import { useState } from 'react'
import ExerciseCard3D from './ExerciseCard3D'
import ExerciseCardFlip from './ExerciseCardFlip'
import ExerciseCardFlipHover from './ExerciseCardFlipHover'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('current')

  return (
    <div className="app-container">
      <h1>Tarjeta de Ejercicios 3D</h1>
      
      {/* Tabs */}
      <div className="tabs-container">
        <button 
          className={`tab ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          Current Version
        </button>
        <button 
          className={`tab ${activeTab === 'block1' ? 'active' : ''}`}
          onClick={() => setActiveTab('block1')}
        >
          Block 1
        </button>
        <button 
          className={`tab ${activeTab === 'block2' ? 'active' : ''}`}
          onClick={() => setActiveTab('block2')}
        >
          Block 2
        </button>
        <button 
          className={`tab ${activeTab === 'block3' ? 'active' : ''}`}
          onClick={() => setActiveTab('block3')}
        >
          Block 3
        </button>
      </div>

      {/* Current Version: Versión actual (Block 2) */}
      {activeTab === 'current' && (
        <div className="tab-content">
          <h2>Current Version: Flip Card con Efecto 3D</h2>
          <p className="subtitle">Mueve el mouse para efecto 3D • Haz clic en las tarjetas para ver la continuación del entrenamiento</p>
          
          <div className="images-grid">
            <div className="image-wrapper">
              <ExerciseCardFlip
                title="PIRAMIDAL"
                subtitle="6, 12, 18, 12, 6"
                exercises={[
                  'MONKEY',
                  'SENTADILLA C.',
                  'PLANK CRUNCH',
                  'FLEXION OPEN',
                  'ESCALADOR SALTO TR.',
                  'SENTADA ENTRE TR.'
                ]}
                backSubtitle="Continuación del entrenamiento"
                backExercises={[
                  'BURPEES',
                  'MOUNTAIN CLIMBERS',
                  'JUMPING JACKS',
                  'HIGH KNEES',
                  'PLANK JACKS',
                  'SQUATS'
                ]}
                topColor="#3b82f6"
                intensity={0.3}
                perspective={1000}
              />
            </div>

            <div className="image-wrapper">
              <ExerciseCardFlip
                title="CARDIO"
                subtitle="4 rondas de 30 segundos"
                exercises={[
                  'BURPEES',
                  'MOUNTAIN CLIMBERS',
                  'JUMPING JACKS',
                  'HIGH KNEES',
                  'PLANK JACKS'
                ]}
                backSubtitle="Ronda 2: Ejercicios avanzados"
                backExercises={[
                  'TUCK JUMPS',
                  'SPRINT IN PLACE',
                  'BUTT KICKS',
                  'LATERAL JUMPS',
                  'SKATER JUMPS'
                ]}
                topColor="#10b981"
                intensity={0.4}
                perspective={800}
              />
            </div>

            <div className="image-wrapper">
              <ExerciseCardFlip
                title="FUERZA"
                subtitle="3 series x 12 repeticiones"
                exercises={[
                  'SQUATS',
                  'PUSH-UPS',
                  'LUNGES',
                  'PLANK',
                  'DEADLIFTS'
                ]}
                backSubtitle="Serie 2: Variaciones"
                backExercises={[
                  'JUMP SQUATS',
                  'DIAMOND PUSH-UPS',
                  'BULGARIAN LUNGES',
                  'SIDE PLANK',
                  'ROMANIAN DEADLIFTS'
                ]}
                topColor="#f59e0b"
                intensity={0.6}
                perspective={600}
              />
            </div>
          </div>
        </div>
      )}

      {/* Block 1: Versión original con efecto 3D del mouse */}
      {activeTab === 'block1' && (
        <div className="tab-content">
          <h2>Block 1: Efecto 3D del Mouse</h2>
          <p className="subtitle">Mueve el mouse sobre las tarjetas para ver el efecto 3D • Las flechas aparecen en hover</p>
          
          <div className="images-grid">
            <div className="image-wrapper">
              <ExerciseCard3D
                title="PIRAMIDAL"
                subtitle="6, 12, 18, 12, 6"
                exercises={[
                  'MONKEY',
                  'SENTADILLA C.',
                  'PLANK CRUNCH',
                  'FLEXION OPEN',
                  'ESCALADOR SALTO TR.',
                  'SENTADA ENTRE TR.'
                ]}
                topColor="#3b82f6"
                intensity={0.3}
                perspective={1000}
              />
            </div>

            <div className="image-wrapper">
              <ExerciseCard3D
                title="CARDIO"
                subtitle="4 rondas de 30 segundos"
                exercises={[
                  'BURPEES',
                  'MOUNTAIN CLIMBERS',
                  'JUMPING JACKS',
                  'HIGH KNEES',
                  'PLANK JACKS'
                ]}
                topColor="#10b981"
                intensity={0.4}
                perspective={800}
              />
            </div>

            <div className="image-wrapper">
              <ExerciseCard3D
                title="FUERZA"
                subtitle="3 series x 12 repeticiones"
                exercises={[
                  'SQUATS',
                  'PUSH-UPS',
                  'LUNGES',
                  'PLANK',
                  'DEADLIFTS'
                ]}
                topColor="#f59e0b"
                intensity={0.6}
                perspective={600}
              />
            </div>
          </div>
        </div>
      )}

      {/* Block 2: Versión Flip Card con texto */}
      {activeTab === 'block2' && (
        <div className="tab-content">
          <h2>Block 2: Flip Card con Texto</h2>
          <p className="subtitle">Haz clic en las tarjetas para ver la continuación del entrenamiento</p>
          
          <div className="images-grid">
            <div className="image-wrapper">
              <ExerciseCardFlip
                title="PIRAMIDAL"
                subtitle="6, 12, 18, 12, 6"
                exercises={[
                  'MONKEY',
                  'SENTADILLA C.',
                  'PLANK CRUNCH',
                  'FLEXION OPEN',
                  'ESCALADOR SALTO TR.',
                  'SENTADA ENTRE TR.'
                ]}
                backSubtitle="Continuación del entrenamiento"
                backExercises={[
                  'BURPEES',
                  'MOUNTAIN CLIMBERS',
                  'JUMPING JACKS',
                  'HIGH KNEES',
                  'PLANK JACKS',
                  'SQUATS'
                ]}
                topColor="#3b82f6"
              />
            </div>

            <div className="image-wrapper">
              <ExerciseCardFlip
                title="CARDIO"
                subtitle="4 rondas de 30 segundos"
                exercises={[
                  'BURPEES',
                  'MOUNTAIN CLIMBERS',
                  'JUMPING JACKS',
                  'HIGH KNEES',
                  'PLANK JACKS'
                ]}
                backSubtitle="Ronda 2: Ejercicios avanzados"
                backExercises={[
                  'TUCK JUMPS',
                  'SPRINT IN PLACE',
                  'BUTT KICKS',
                  'LATERAL JUMPS',
                  'SKATER JUMPS'
                ]}
                topColor="#10b981"
              />
            </div>

            <div className="image-wrapper">
              <ExerciseCardFlip
                title="FUERZA"
                subtitle="3 series x 12 repeticiones"
                exercises={[
                  'SQUATS',
                  'PUSH-UPS',
                  'LUNGES',
                  'PLANK',
                  'DEADLIFTS'
                ]}
                backSubtitle="Serie 2: Variaciones"
                backExercises={[
                  'JUMP SQUATS',
                  'DIAMOND PUSH-UPS',
                  'BULGARIAN LUNGES',
                  'SIDE PLANK',
                  'ROMANIAN DEADLIFTS'
                ]}
                topColor="#f59e0b"
              />
            </div>
          </div>
        </div>
      )}

      {/* Block 3: Versión Flip Card con efecto 3D y emoji 🔄 */}
      {activeTab === 'block3' && (
        <div className="tab-content">
          <h2>Block 3: Flip Card con Efecto 3D + Emoji 🔄</h2>
          <p className="subtitle">Mueve el mouse para efecto 3D • Haz clic en 🔄 para voltear</p>
          
          <div className="images-grid">
            <div className="image-wrapper">
              <ExerciseCardFlipHover
                title="PIRAMIDAL"
                subtitle="6, 12, 18, 12, 6"
                exercises={[
                  'MONKEY',
                  'SENTADILLA C.',
                  'PLANK CRUNCH',
                  'FLEXION OPEN',
                  'ESCALADOR SALTO TR.',
                  'SENTADA ENTRE TR.'
                ]}
                backSubtitle="Continuación del entrenamiento"
                backExercises={[
                  'BURPEES',
                  'MOUNTAIN CLIMBERS',
                  'JUMPING JACKS',
                  'HIGH KNEES',
                  'PLANK JACKS',
                  'SQUATS'
                ]}
                topColor="#3b82f6"
                intensity={0.3}
                perspective={1000}
              />
            </div>

            <div className="image-wrapper">
              <ExerciseCardFlipHover
                title="CARDIO"
                subtitle="4 rondas de 30 segundos"
                exercises={[
                  'BURPEES',
                  'MOUNTAIN CLIMBERS',
                  'JUMPING JACKS',
                  'HIGH KNEES',
                  'PLANK JACKS'
                ]}
                backSubtitle="Ronda 2: Ejercicios avanzados"
                backExercises={[
                  'TUCK JUMPS',
                  'SPRINT IN PLACE',
                  'BUTT KICKS',
                  'LATERAL JUMPS',
                  'SKATER JUMPS'
                ]}
                topColor="#10b981"
                intensity={0.4}
                perspective={800}
              />
            </div>

            <div className="image-wrapper">
              <ExerciseCardFlipHover
                title="FUERZA"
                subtitle="3 series x 12 repeticiones"
                exercises={[
                  'SQUATS',
                  'PUSH-UPS',
                  'LUNGES',
                  'PLANK',
                  'DEADLIFTS'
                ]}
                backSubtitle="Serie 2: Variaciones"
                backExercises={[
                  'JUMP SQUATS',
                  'DIAMOND PUSH-UPS',
                  'BULGARIAN LUNGES',
                  'SIDE PLANK',
                  'ROMANIAN DEADLIFTS'
                ]}
                topColor="#f59e0b"
                intensity={0.6}
                perspective={600}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
