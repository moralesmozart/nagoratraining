# Nāgora Training - Biblioteca de Entrenamientos

Aplicación web para crear, gestionar y realizar entrenamientos personalizados con tarjetas interactivas.

## 🎯 Características

* ✨ **Tarjetas Interactivas 3D**: Efecto 3D al mover el mouse y funcionalidad de flip
* 🎨 **Editor Visual**: Crea tarjetas de entrenamiento editando directamente en la vista previa
* 📚 **Biblioteca de Entrenamientos**: Almacena y gestiona todos tus entrenamientos
* ⏱️ **Timer Tabata**: Timer personalizable con sonidos y efectos visuales
* 📊 **Historial de Sesiones**: Registra y revisa tus entrenamientos completados
* 🎉 **Efectos Visuales**: Confeti y animaciones al completar entrenamientos
* 🎵 **Sonidos**: Feedback sonoro para cada fase del entrenamiento

## 🚀 Instalación

```bash
npm install
```

## 💻 Desarrollo

```bash
npm run dev
```

Abre tu navegador en `http://localhost:5174`

## 📦 Build para Producción

```bash
npm run build
```

## 🌐 Despliegue

El proyecto está configurado para desplegarse automáticamente en GitHub Pages cuando se hace push a la rama `main` o `training-card-editor`.

### Acceso en Producción

La aplicación está disponible en: [GitHub Pages](https://moralesmozart.github.io/trainingsmart/)

## 🎨 Componentes Principales

### Library (Biblioteca)
Vista principal que muestra todos los entrenamientos guardados con efecto de espejo en el fondo.

### EditableCardPreview
Componente para editar tarjetas de entrenamiento directamente en la vista previa.

### ExerciseCardWithWeights
Tarjeta interactiva con funcionalidad de flip, efecto 3D y edición de pesos.

### TabataTimer
Timer personalizable con configuraciones de trabajo, descanso, rondas y más.

### ActiveTraining
Vista de entrenamiento activo con timer, tarjeta interactiva y registro de pesos.

## 🛠️ Tecnologías

* React 19.2.0
* TypeScript
* Vite 7.2.4
* CSS3 (transforms, perspective, animations)
* Web Audio API (sonidos)

## 📝 Estructura del Proyecto

```
src/
├── App.tsx                      # Aplicación principal
├── Library.tsx                  # Vista de biblioteca
├── EditableCardPreview.tsx      # Editor de tarjetas
├── ExerciseCardWithWeights.tsx  # Tarjeta con pesos
├── TabataTimer.tsx              # Timer Tabata
├── ActiveTraining.tsx          # Vista de entrenamiento activo
├── TrainingPreparation.tsx      # Preparación de entrenamiento
├── TrainingHistory.tsx          # Historial de sesiones
├── Confetti.tsx                 # Efecto de confeti
├── sounds.ts                    # Utilidades de sonido
└── types.ts                     # Tipos TypeScript
```

## 🎯 Características Técnicas

* **Efecto 3D**: Usa `transform: rotateX()` y `rotateY()` basado en la posición del mouse
* **Flip Animation**: Transición suave de 0.6s usando `rotateY(180deg)`
* **Performance**: Optimizado con `requestAnimationFrame` y `will-change`
* **Responsive**: Diseño adaptativo que se ajusta al tamaño de pantalla
* **LocalStorage**: Persistencia de datos en el navegador
* **Web Audio API**: Generación de sonidos sin archivos externos

## 📄 Licencia

Este proyecto es parte de Nāgora Training.

## 👤 Autor

Morales Mozart

## 🔗 Enlaces

* [Repositorio GitHub](https://github.com/moralesmozart/trainingsmart)
* [Nāgora Fitness](https://nagorafitness.com/)
