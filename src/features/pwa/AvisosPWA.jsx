// DUEÑO: Gabriel. Avisos de la PWA. Se dibuja siempre (Global del módulo pwa):
//   - "Hay una nueva versión": el service worker nuevo espera; "Actualizar" lo activa y recarga.
//   - "Lista para usarse sin conexión": el app shell quedó en caché (primera visita).
//   - "Estás sin conexión" / "Conexión restablecida".
//   - Botón "Instalar Butaka" cuando el navegador lo permite.
import { useEffect, useRef, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import Boton from '../../components/Boton.jsx';
import { useEnLinea } from './useEnLinea.js';
import { useInstalacion } from './useInstalacion.js';
import './AvisosPWA.css';

const UNA_HORA = 60 * 60 * 1000;

export default function AvisosPWA() {
  const {
    needRefresh: [hayVersionNueva, setHayVersionNueva],
    offlineReady: [listaOffline, setListaOffline],
    updateServiceWorker,
  } = useRegisterSW({
    // Revisa cada hora si se publicó una versión nueva en GitHub Pages
    onRegisteredSW(_url, registro) {
      if (registro) setInterval(() => registro.update(), UNA_HORA);
    },
  });
  const enLinea = useEnLinea();
  const { puedeInstalar, instalar } = useInstalacion();

  // "Conexión restablecida" se muestra unos segundos al volver la red
  const [reconectado, setReconectado] = useState(false);
  const estabaSinConexion = useRef(!enLinea);
  useEffect(() => {
    if (!enLinea) {
      estabaSinConexion.current = true;
      return undefined;
    }
    if (!estabaSinConexion.current) return undefined;
    estabaSinConexion.current = false;
    setReconectado(true);
    const temporizador = setTimeout(() => setReconectado(false), 4000);
    return () => clearTimeout(temporizador);
  }, [enLinea]);

  // "Lista para usarse sin conexión" se cierra sola
  useEffect(() => {
    if (!listaOffline) return undefined;
    const temporizador = setTimeout(() => setListaOffline(false), 6000);
    return () => clearTimeout(temporizador);
  }, [listaOffline, setListaOffline]);

  return (
    <div className="avisos-pwa" aria-live="polite">
      {!enLinea && (
        <div className="avisos-pwa__aviso avisos-pwa__aviso--offline" role="status">
          <p>
            <strong>Estás sin conexión.</strong> Puedes ver los eventos y boletos que ya abriste. Para pagar necesitas conexión.
          </p>
        </div>
      )}

      {reconectado && (
        <div className="avisos-pwa__aviso avisos-pwa__aviso--exito" role="status">
          <p>Conexión restablecida.</p>
        </div>
      )}

      {hayVersionNueva && (
        <div className="avisos-pwa__aviso" role="alert">
          <p>
            <strong>Hay una nueva versión de Butaka.</strong> Actualiza para ver los últimos cambios.
          </p>
          <div className="avisos-pwa__acciones">
            <Boton tamano="pequeno" onClick={() => updateServiceWorker(true)}>
              Actualizar
            </Boton>
            <Boton tamano="pequeno" variante="texto" onClick={() => setHayVersionNueva(false)}>
              Después
            </Boton>
          </div>
        </div>
      )}

      {listaOffline && (
        <div className="avisos-pwa__aviso avisos-pwa__aviso--exito" role="status">
          <p>Butaka está lista para usarse sin conexión.</p>
          <button type="button" className="avisos-pwa__cerrar" onClick={() => setListaOffline(false)} aria-label="Cerrar aviso">
            ✕
          </button>
        </div>
      )}

      {puedeInstalar && (
        <Boton className="avisos-pwa__instalar" onClick={instalar}>
          Instalar Butaka
        </Boton>
      )}
    </div>
  );
}
