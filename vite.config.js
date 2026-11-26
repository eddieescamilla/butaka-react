import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// DUEÑO (desde la rama base): Gabriel. Configuración de Vite y de la PWA.
//
// base: en GitHub Pages la app se publica en https://eddieescamilla.github.io/butaka-react/
// En desarrollo (npm run dev) se sirve en la raíz. VITE_BASE permite cambiarla
// si el repositorio se publica con otro nombre (lo usa el workflow de Actions).
export default defineConfig(({ command, isPreview }) => {
  // build y preview usan la base de GitHub Pages; dev usa la raíz
  const base = command === 'build' || isPreview ? (process.env.VITE_BASE ?? '/butaka-react/') : '/';

  return {
    base,
    plugins: [
      react(),
      VitePWA({
        // 'prompt': la versión nueva se instala, pero se activa cuando el usuario
        // pulsa "Actualizar" en el aviso (src/features/pwa/AvisosPWA.jsx)
        registerType: 'prompt',
        // El registro lo hace useRegisterSW dentro de AvisosPWA
        injectRegister: false,
        includeAssets: ['favicon.svg', 'iconos/apple-touch-icon.png'],

        manifest: {
          id: base,
          name: 'Butaka: Tu lugar te espera',
          short_name: 'Butaka',
          description: 'Compra boletos para conciertos, teatro y deportes en El Salvador y llévalos en tu teléfono con código QR.',
          lang: 'es',
          dir: 'ltr',
          start_url: base,
          scope: base,
          display: 'standalone',
          background_color: '#FBF8FF',
          theme_color: '#E11D74',
          categories: ['entertainment', 'shopping'],
          icons: [
            { src: 'iconos/icono-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: 'iconos/icono-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: 'iconos/icono-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
          // Accesos directos al mantener presionado el ícono de la app
          shortcuts: [
            { name: 'Mis boletos', short_name: 'Boletos', url: `${base}boletos`, icons: [{ src: 'iconos/icono-192.png', sizes: '192x192' }] },
            { name: 'Eventos', short_name: 'Eventos', url: `${base}eventos`, icons: [{ src: 'iconos/icono-192.png', sizes: '192x192' }] },
          ],
        },

        workbox: {
          // Precache del app shell: HTML, JS, CSS, íconos y SVG. Los JSON de la API
          // y las fotos de los eventos NO se precargan: tienen su propia estrategia.
          globPatterns: ['**/*.{html,js,css,svg,png,woff2}'],
          globIgnores: ['404.html'],
          // Rutas de la SPA (/eventos/evt-001, /boletos…) sin conexión → index.html
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/\/api\//],
          cleanupOutdatedCaches: true,
          // En la primera visita, el service worker toma el control sin esperar a recargar,
          // así lo que se ve desde ese momento ya queda disponible sin conexión
          clientsClaim: true,
          runtimeCaching: [
            {
              // API falsa: primero la red (datos frescos); si no hay conexión o tarda
              // más de 3 s, la última respuesta guardada
              urlPattern: ({ url }) => url.pathname.includes('/api/') && url.pathname.endsWith('.json'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'butaka-api',
                networkTimeoutSeconds: 3,
                expiration: { maxEntries: 20, maxAgeSeconds: 7 * 24 * 60 * 60 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              // Imágenes: primero la caché (no cambian); la red solo la primera vez
              urlPattern: ({ request }) => request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'butaka-imagenes',
                expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              // Hoja de estilos de Google Fonts: se usa la guardada y se actualiza en segundo plano
              urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
              handler: 'StaleWhileRevalidate',
              options: { cacheName: 'google-fonts-estilos' },
            },
            {
              // Archivos de las fuentes: no cambian nunca
              urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-archivos',
                expiration: { maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
      }),
    ],
  };
});
