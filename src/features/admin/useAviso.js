// DUEÑO: Eddie. Aviso de confirmación (toast) de las pantallas del panel.
// Puede llegar desde otra pantalla en location.state.aviso, por ejemplo después
// de crear un evento: navegar('/admin/eventos', { state: { aviso: 'Evento creado con éxito' } }).
// Ese estado se limpia del historial para que el aviso no reaparezca al recargar.
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

export function useAviso() {
  const ubicacion = useLocation();
  const navegar = useNavigate();
  const recibido = ubicacion.state?.aviso;
  const [aviso, setAviso] = useState(recibido ? { tipo: 'exito', mensaje: recibido } : null);

  useEffect(() => {
    if (recibido) navegar(`${ubicacion.pathname}${ubicacion.search}`, { replace: true, state: null });
  }, [recibido, navegar, ubicacion.pathname, ubicacion.search]);

  const mostrarAviso = useCallback((mensaje, tipo = 'exito') => setAviso({ tipo, mensaje }), []);
  const cerrarAviso = useCallback(() => setAviso(null), []);
  return { aviso, mostrarAviso, cerrarAviso };
}
