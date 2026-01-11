# Training Card Editor

Editor interactivo para crear y gestionar tarjetas de entrenamiento con efectos 3D y funcionalidad de flip.

## 🎯 Características

- ✨ **Editor de Tarjetas Interactivo**: Edita directamente en la vista previa haciendo clic en cualquier elemento
- 🎨 **Efecto 3D del Mouse**: Las tarjetas reaccionan al movimiento del mouse
- 🔄 **Flip Card**: Voltea las tarjetas para ver la continuación del entrenamiento
- 🌳 **Efecto de Madera**: Textura de madera en las tarjetas (Block 4)
- 📚 **Biblioteca de Tarjetas**: Almacena y visualiza todas tus tarjetas creadas
- 🪞 **Fondo con Efecto Espejo**: Fondo elegante en la vista de biblioteca
- 💾 **Persistencia Local**: Las tarjetas se guardan en localStorage

## 🚀 Instalación

```bash
npm install
```

## 💻 Uso

```bash
npm run dev
```

Abre tu navegador en `http://localhost:5174`

## 📦 Componentes Principales

### Editor de Tarjetas
- **EditableCardPreview**: Componente editable donde puedes hacer clic en cualquier elemento para editarlo
- **ExerciseCardFlipWood**: Componente Block 4 con efecto de madera, 3D y flip

### Biblioteca
- **Library**: Vista de todas las tarjetas guardadas con fondo espejo
- Almacenamiento en localStorage

## 🎨 Funcionalidades del Editor

### Edición Directa
- **Título**: Haz clic para editar (opcional)
- **Subtítulo**: Haz clic para editar (opcional)
- **Color**: Icono 🎨 para cambiar el color de la franja superior
- **Ejercicios**: 
  - Haz clic para editar nombre
  - Campo opcional de repeticiones a la derecha
  - Agregar/eliminar ejercicios

### Reglas de Visualización
- Si el título está vacío, no se muestra el header
- Si el subtítulo está vacío, no se muestra en la vista previa
- Los datos se guardan siempre, incluso si están vacíos

## 📚 Biblioteca

- Muestra todas las tarjetas guardadas en un grid responsive
- Fondo con efecto espejo animado
- Si no hay tarjetas, muestra un botón para crear una nueva
- Las tarjetas mantienen el efecto 3D y flip, pero sin indicador de texto

## 🛠️ Tecnologías

- React 19.2.0
- TypeScript
- Vite 7.2.4
- CSS3 (transforms, perspective, animations, gradients)

## 📝 Estructura del Proyecto

```
src/
├── App.tsx                 # Aplicación principal con navegación
├── App.css                 # Estilos de la aplicación
├── EditableCardPreview.tsx # Componente de edición directa
├── EditableCardPreview.css # Estilos del editor
├── ExerciseCardFlipWood.tsx # Componente Block 4 (madera + 3D + flip)
├── ExerciseCardFlipWood.css # Estilos del componente Block 4
├── Library.tsx             # Vista de biblioteca
└── Library.css             # Estilos de la biblioteca
```

## 🎯 Flujo de Trabajo

1. **Crear Tarjeta**: Edita directamente en la vista previa
2. **Vista Previa**: Haz clic en "Crear Tarjeta" para ver el resultado
3. **Guardar**: Haz clic en "Enviar a Biblioteca" para guardar
4. **Biblioteca**: Ve todas tus tarjetas guardadas

## 📄 Licencia

Este proyecto es parte de Training Smart.

## 👤 Autor

Morales Mozart
