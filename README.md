# Training Smart - Componente de Tarjeta de Ejercicios 3D

Un componente React interactivo para mostrar tarjetas de ejercicios con efecto 3D y funcionalidad de flip.

## 🎯 Características

- ✨ **Efecto 3D del mouse**: La tarjeta reacciona al movimiento del mouse con rotación 3D
- 🔄 **Flip Card**: Haz clic para voltear la tarjeta y ver la continuación del entrenamiento
- 🎨 **Diseño personalizable**: Colores, intensidad y perspectiva configurables
- 📱 **Responsive**: Optimizado para diferentes tamaños de pantalla
- ⚡ **Rendimiento optimizado**: Usa `requestAnimationFrame` para animaciones fluidas

## 🚀 Instalación

```bash
npm install
```

## 💻 Uso

```bash
npm run dev
```

Abre tu navegador en `http://localhost:5173`

## 📦 Componente Principal

El componente principal es **`ExerciseCardFlip`** (Current Version), que combina:
- Efecto 3D del mouse
- Funcionalidad de flip para mostrar contenido adicional

### Ejemplo de uso:

```tsx
import ExerciseCardFlip from './ExerciseCardFlip'

function App() {
  return (
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
  )
}
```

## 🎛️ Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `title` | `string` | **requerido** | Título de la tarjeta (aparece en la sección superior) |
| `subtitle` | `string` | **requerido** | Subtítulo que aparece debajo del título |
| `exercises` | `string[]` | **requerido** | Array de ejercicios a mostrar |
| `backSubtitle` | `string` | `undefined` | Subtítulo para la cara trasera |
| `backExercises` | `string[]` | `[]` | Array de ejercicios para la cara trasera |
| `topColor` | `string` | `'#3b82f6'` | Color de la sección superior (hex, rgb, etc.) |
| `intensity` | `number` | `0.3` | Intensidad del efecto 3D (0-1). Valores más altos = más rotación |
| `perspective` | `number` | `1000` | Distancia de perspectiva en píxeles. Valores más bajos = efecto más pronunciado |
| `className` | `string` | `''` | Clase CSS adicional para el contenedor |

## 🎨 Versiones Disponibles

El proyecto incluye diferentes versiones del componente para comparar:

- **Current Version**: Flip Card con efecto 3D (versión recomendada)
- **Block 1**: Solo efecto 3D del mouse
- **Block 2**: Solo flip card con texto
- **Block 3**: Flip card con efecto 3D + emoji 🔄

## 🛠️ Tecnologías

- React 19.2.0
- TypeScript
- Vite 7.2.4
- CSS3 (transforms, perspective, animations)

## 📝 Estructura del Proyecto

```
src/
├── App.tsx                 # Aplicación principal con tabs
├── App.css                 # Estilos de la aplicación
├── ExerciseCardFlip.tsx    # Componente principal (Current Version)
├── ExerciseCardFlip.css    # Estilos del componente principal
├── ExerciseCard3D.tsx     # Versión solo con efecto 3D
├── ExerciseCard3D.css      # Estilos del efecto 3D
└── ExerciseCardFlipHover.tsx  # Versión con emoji
```

## 🎯 Características Técnicas

- **Efecto 3D**: Usa `transform: rotateX()` y `rotateY()` basado en la posición del mouse
- **Flip Animation**: Transición suave de 0.6s usando `rotateY(180deg)`
- **Performance**: Optimizado con `requestAnimationFrame` y `will-change`
- **Responsive**: Grid adaptativo que se ajusta al tamaño de pantalla

## 📄 Licencia

Este proyecto es parte de Training Smart.

## 👤 Autor

Morales Mozart
