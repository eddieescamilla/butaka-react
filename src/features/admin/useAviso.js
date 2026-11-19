// DUEÑO: Eddie. Aviso de confirmación (toast) de las pantallas del panel.
// Puede llegar desde otra pantalla en params.aviso
// (por ejemplo, después de crear un evento: irA('admin-eventos', { aviso: 'Evento creado con éxito' })).
import { useCallback, useState } from 'react';

export function useAviso(mensajeInicial) {
  const [aviso, setAviso] = useState(mensajeInicial ? { tipo: 'exito', mensaje: mensajeInicial } : null);
  const mostrarAviso = useCallback((mensaje, tipo = 'exito') => setAviso({ tipo, mensaje }), []);
  const cerrarAviso = useCallback(() => setAviso(null), []);
  return { aviso, mostrarAviso, cerrarAviso };
}
