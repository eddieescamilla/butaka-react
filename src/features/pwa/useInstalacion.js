// DUEÑO: Gabriel. Botón propio de "Instalar Butaka" (Chrome y Edge).
// El navegador dispara beforeinstallprompt cuando la PWA cumple los requisitos
// (manifest, íconos, service worker); se guarda el evento para mostrarlo después.
import { useCallback, useEffect, useState } from 'react';

export function useInstalacion() {
  const [solicitud, setSolicitud] = useState(null);
  const [instalada, setInstalada] = useState(() => window.matchMedia('(display-mode: standalone)').matches);

  useEffect(() => {
    function alPoderInstalar(evento) {
      evento.preventDefault(); // en lugar de la barra del navegador, se usa el botón propio
      setSolicitud(evento);
    }
    function alInstalar() {
      setInstalada(true);
      setSolicitud(null);
    }
    window.addEventListener('beforeinstallprompt', alPoderInstalar);
    window.addEventListener('appinstalled', alInstalar);
    return () => {
      window.removeEventListener('beforeinstallprompt', alPoderInstalar);
      window.removeEventListener('appinstalled', alInstalar);
    };
  }, []);

  const instalar = useCallback(async () => {
    if (!solicitud) return;
    solicitud.prompt();
    await solicitud.userChoice;
    setSolicitud(null); // el evento solo se puede usar una vez
  }, [solicitud]);

  return { puedeInstalar: Boolean(solicitud) && !instalada, instalar };
}
