# 🚀 Guía de Despliegue - Nāgora Training

## Configuración de GitHub Pages

El proyecto está configurado para desplegarse automáticamente en GitHub Pages. Sigue estos pasos:

### 1. Activar GitHub Pages en el Repositorio

1. Ve a tu repositorio: https://github.com/moralesmozart/trainingsmart
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, busca **Pages**
4. En **Source**, selecciona:
   - **Source**: `GitHub Actions`
5. Guarda los cambios

### 2. Verificar el Workflow

El workflow de GitHub Actions se ejecutará automáticamente cuando:
- Hagas push a la rama `main` o `training-card-editor`
- O manualmente desde la pestaña **Actions**

### 3. Acceder a la Aplicación

Una vez desplegado, la aplicación estará disponible en:
**https://moralesmozart.github.io/trainingsmart/**

### 4. Verificar el Despliegue

1. Ve a la pestaña **Actions** en tu repositorio
2. Verifica que el workflow "Deploy to GitHub Pages" se haya ejecutado correctamente
3. Si hay errores, revisa los logs en la pestaña Actions

## Configuración Actual

- **Base Path**: `/trainingsmart/` (configurado en `vite.config.ts`)
- **Branch**: `training-card-editor` o `main`
- **Build**: Automático mediante GitHub Actions
- **Workflow**: `.github/workflows/deploy.yml`

## Notas Importantes

- El workflow está configurado para desplegar desde las ramas `main` y `training-card-editor`
- Si quieres cambiar el nombre del repositorio, actualiza el `base` en `vite.config.ts`
- Los cambios se reflejan automáticamente después de cada push exitoso

## Solución de Problemas

### El sitio no carga
- Verifica que GitHub Pages esté activado en Settings > Pages
- Asegúrate de que el workflow se haya ejecutado correctamente
- Revisa que el `base` en `vite.config.ts` coincida con el nombre del repositorio

### Los assets no cargan
- Verifica que el `base` en `vite.config.ts` sea correcto
- Asegúrate de que todas las rutas de assets sean relativas

### El workflow falla
- Revisa los logs en la pestaña Actions
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que el build local funcione: `npm run build`

