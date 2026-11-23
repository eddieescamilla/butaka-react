// DUEÑO: Eddie. Se ejecuta después de "vite build" (ver npm run build).
// GitHub Pages no conoce las rutas de React Router: si alguien abre o recarga
// /butaka-react/eventos/evt-001, Pages no encuentra ese archivo y responde con
// 404.html. Como 404.html es una copia de index.html, la app carga igual y
// React Router dibuja la ruta correcta.
// .nojekyll evita que Pages procese el sitio con Jekyll (que ignora carpetas con "_").
import { copyFileSync, writeFileSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
copyFileSync(new URL('index.html', dist), new URL('404.html', dist));
writeFileSync(new URL('.nojekyll', dist), '');
console.log('dist/404.html y dist/.nojekyll listos para GitHub Pages');
