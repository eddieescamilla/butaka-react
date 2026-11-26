// DUEÑO: Gabriel. PWA: avisos de actualización, de modo sin conexión y de instalación.
// El manifest y el service worker se generan con vite-plugin-pwa (vite.config.js).
import AvisosPWA from './AvisosPWA.jsx';

export default {
  nombre: 'pwa',
  orden: 90,
  Global: AvisosPWA,
};
