// DUEÑO: Gabriel. ¿Hay conexión? Se suscribe a los eventos online/offline del
// navegador con useSyncExternalStore (la forma recomendada de leer un valor
// externo a React sin desincronizarse).
import { useSyncExternalStore } from 'react';

function suscribir(avisar) {
  window.addEventListener('online', avisar);
  window.addEventListener('offline', avisar);
  return () => {
    window.removeEventListener('online', avisar);
    window.removeEventListener('offline', avisar);
  };
}

export function useEnLinea() {
  return useSyncExternalStore(suscribir, () => navigator.onLine);
}
