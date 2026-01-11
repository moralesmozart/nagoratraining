# Demo de Componente de Imagen 3D

Un ejemplo local del componente de imagen 3D interactivo.

## Instalación

```bash
npm install
```

## Ejecutar

```bash
npm run dev
```

Luego abre tu navegador en la URL que aparece (normalmente http://localhost:5173)

## Agregar tus imágenes

1. Coloca tus imágenes en la carpeta `public/images/`
2. Actualiza las rutas en `src/App.tsx` para apuntar a tus imágenes

Por ejemplo:
- `public/images/block.jpg` → usar `/images/block.jpg` en el componente
- `public/images/sign.jpg` → usar `/images/sign.jpg` en el componente

## Características del Componente

- ✨ Efecto 3D con rotación basada en la posición del mouse
- 🎨 Sombra dinámica que se intensifica al hacer hover
- 🎯 Transiciones suaves cuando el mouse sale del área
- ⚙️ Props configurables: `intensity` y `perspective`

## Props del Componente Image3D

- `src`: URL de la imagen (requerido)
- `alt`: Texto alternativo
- `intensity`: Intensidad del efecto 3D (0-1, default: 0.3)
- `perspective`: Distancia de perspectiva en píxeles (default: 1000)
