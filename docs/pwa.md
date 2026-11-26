# PWA: instalación, caché y modo sin conexión

> **Dueño:** Gabriel Enrique Mejía Castillo. El README principal enlaza este archivo.

Butaka se instala como aplicación y funciona sin conexión con lo que ya se visitó. Se usa `vite-plugin-pwa` (Workbox) en modo `generateSW`: la configuración está en `vite.config.js` y los avisos en `src/features/pwa/`.

## Manifest (`manifest.webmanifest`, generado)

| Campo | Valor |
|---|---|
| `name` / `short_name` | Butaka: Tu lugar te espera / Butaka |
| `start_url`, `scope`, `id` | `/butaka-react/` (la base de GitHub Pages) |
| `display` | `standalone` |
| `theme_color` / `background_color` | `#E11D74` / `#FBF8FF` (manual de marca) |
| `icons` | `icono-192.png`, `icono-512.png` y `icono-maskable-512.png` (`purpose: maskable`) en `public/iconos/` |
| `shortcuts` | Mis boletos y Eventos |

El ícono maskable no tiene esquinas redondeadas y deja el boleto dentro de la zona segura (el círculo central del 80 %), para que Android lo recorte sin cortar el logo.

## Estrategias de caché

| Qué | Estrategia | Caché | Por qué |
|---|---|---|---|
| App shell: HTML, JS, CSS, íconos, SVG | Precache | `workbox-precache-v2` | Se descarga al instalar el service worker; la app abre sin red |
| Rutas de la SPA (`/eventos/evt-001`…) | `navigateFallback: 'index.html'` | Precache | Recargar cualquier ruta sin conexión carga la app y React Router dibuja la pantalla |
| API falsa (`/api/*.json`) | NetworkFirst, 3 s de espera | `butaka-api` | Datos frescos si hay red; si no, la última respuesta guardada |
| Imágenes de eventos | CacheFirst, 60 imágenes, 30 días | `butaka-imagenes` | No cambian; solo se descargan la primera vez |
| Google Fonts | StaleWhileRevalidate (CSS) y CacheFirst (archivos) | `google-fonts-*` | La tipografía se mantiene sin conexión |

`clientsClaim: true` hace que el service worker controle la página desde la primera visita, y `cleanupOutdatedCaches` borra las cachés de versiones anteriores. Los cambios hechos en la app (compras, panel) se guardan en `localStorage`, así que también están disponibles sin conexión.

## Avisos (`AvisosPWA.jsx`)

- **Actualización:** con `registerType: 'prompt'`, una versión nueva se instala pero espera. Aparece "Hay una nueva versión de Butaka" con **Actualizar** (activa el service worker nuevo y recarga) o **Después**. Se revisa cada hora si hay versión nueva.
- **Lista sin conexión:** después de la primera visita, "Butaka está lista para usarse sin conexión".
- **Sin conexión / conexión restablecida:** `useEnLinea` lee `navigator.onLine` con `useSyncExternalStore`. Sin conexión se desactiva el pago.
- **Instalar:** `useInstalacion` guarda el evento `beforeinstallprompt` y muestra el botón "Instalar Butaka".

## Cómo verificarlo

1. `npm run build && npm run preview` y abre `http://localhost:4173/butaka-react/` en Chrome o Edge (o la URL de GitHub Pages).
2. DevTools → **Application → Manifest**: nombre, colores, íconos y sin errores de instalación.
3. **Application → Service workers**: `sw.js` activado. **Cache storage**: precache, `butaka-api` y `butaka-imagenes`.
4. Visita el inicio, el listado y un detalle. En **Network**, elige **Offline** y recarga `/eventos/evt-001`: la pantalla carga y aparece el aviso de sin conexión.
5. Instala con el botón "Instalar Butaka" o con el ícono de la barra de direcciones; la app abre en su propia ventana.
6. Para probar la actualización: cambia un texto, vuelve a compilar y recarga: aparece "Hay una nueva versión".

Captura de referencia del modo sin conexión: `docs/capturas/gabriel/offline-1440.png`. Las capturas de DevTools (manifest y service worker) se toman a mano en el paso 2 y 3.
