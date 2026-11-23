// DUEÑO: Eddie. Eventos del panel de administración (módulos 3 y 7).
// Lee y escribe en la API falsa (src/api/eventos.js). Como el sitio del cliente
// lee la misma colección, un evento creado o editado aquí se ve al comprar.
// Cada operación devuelve una promesa: las pantallas muestran "Procesando…"
// mientras tanto y así se evita el doble envío.
import { useCallback } from 'react';
import * as api from '../../api/eventos.js';
import { useListaRemota } from './useListaRemota.js';

// Un organizador solo ve sus propios eventos; el administrador ve todos
export function eventosVisibles(eventos, usuario) {
  if (usuario?.rol === 'organizador') return eventos.filter((evento) => evento.organizadorId === usuario.id);
  return eventos;
}

export function useEventosAdmin() {
  const { lista: eventos, estado, cargando, error, reintentar, guardarEnLista, quitarDeLista } = useListaRemota((signal) =>
    api.listarEventos({}, { signal }),
  );

  const crearEvento = useCallback(
    async (datos, organizadorId) => {
      const nuevo = await api.crearEvento(datos, organizadorId);
      guardarEnLista(nuevo);
      return nuevo;
    },
    [guardarEnLista],
  );

  const actualizarEvento = useCallback(
    async (id, cambios) => guardarEnLista(await api.actualizarEvento(id, cambios)),
    [guardarEnLista],
  );

  const eliminarEvento = useCallback(
    async (id) => {
      await api.eliminarEvento(id);
      quitarDeLista(id);
    },
    [quitarDeLista],
  );

  // Inventario y precios
  const guardarZona = useCallback(async (eventoId, zona) => guardarEnLista(await api.guardarZona(eventoId, zona)), [guardarEnLista]);
  const eliminarZona = useCallback(async (eventoId, zonaId) => guardarEnLista(await api.eliminarZona(eventoId, zonaId)), [guardarEnLista]);

  return { eventos, estado, cargando, error, reintentar, crearEvento, actualizarEvento, eliminarEvento, guardarZona, eliminarZona };
}
