# Descubre Cochabamba

Aplicación turística de una sola página construida con React y Vite. Las vistas se navegan en el cliente con React Router; el recorrido y las reservas se guardan en `localStorage` del navegador.

## Requisitos y comandos

Se requiere Node.js 20 o posterior.

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm test
```

El servidor de desarrollo y el build usan la base `/descubre-cochabamba-react/`; abre `http://localhost:5173/descubre-cochabamba-react/` en local. El build genera `dist/404.html` como fallback para abrir o recargar rutas internas en GitHub Pages.

## Vistas

- `/`: inicio con destinos, recomendaciones, planificador y reservas.
- `/lugares`: búsqueda, categorías y destinos.
- `/categorias`: filtros y destinos.
- `/planifica`: recomendaciones y recorrido.
- `/reservas`: formulario de reserva.
- Cualquier otra ruta muestra la vista de página no encontrada.

## Estructura de `src`

- `App.jsx`: navegación, estado compartido y composición de las vistas.
- `components/`: componentes de interfaz como tarjetas de destinos, modal, reservas y página no encontrada.
- `data/places.js`: destinos, categorías, rutas recomendadas y utilidades de almacenamiento.
- `App.css`: estilos globales de la aplicación.
- `main.jsx`: punto de entrada de React.

## Despliegue

El workflow `.github/workflows/deploy.yml` compila y publica `dist` al hacer push a `main` o mediante ejecución manual. En **Settings → Pages**, selecciona **GitHub Actions** como fuente de despliegue. No se requiere modificar archivos de `.docs/Legacy`.
