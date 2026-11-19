// DUEÑO: Eddie. Estado de los eventos en el panel de administración.
// Se guardan en localStorage ('butaka:admin-eventos'); el sitio del cliente
// lee la misma clave desde src/servicios/eventos.js, así que los cambios
// del panel también se ven al comprar.
//
// Las operaciones son asíncronas simuladas (devuelven promesas) para poder
// mostrar "Procesando…" y evitar el doble envío.

import { useCallback } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { usePeticion } from '../../hooks/usePeticion.js';
import { simularPeticion } from '../../utils/simularPeticion.js';
import { CLAVE_EVENTOS_ADMIN } from '../../servicios/eventos.js';
import { EVENTOS } from '../../data/eventos.js';

const IMAGEN_POR_CATEGORIA = {
  conciertos: { imagen: 'img/evento-concierto.jpg', imagenAlt: 'Público frente a un escenario iluminado' },
  teatro: { imagen: 'img/evento-teatro.jpg', imagenAlt: 'Butacas de un teatro frente al escenario' },
  deportes: { imagen: 'img/evento-deportes.jpg', imagenAlt: 'Estadio con graderías y público' },
  otros: { imagen: 'img/evento-festival.jpg', imagenAlt: 'Público en un evento al aire libre' },
};

// El estado de venta se recalcula según las zonas (salvo cancelado o finalizado)
function conEstadoActualizado(evento) {
  if (evento.estado === 'cancelado' || evento.estado === 'finalizado') return evento;
  const capacidad = evento.zonas.reduce((suma, zona) => suma + zona.capacidad, 0);
  const vendidos = evento.zonas.reduce((suma, zona) => suma + zona.vendidos, 0);
  const disponibles = capacidad - vendidos;
  let estado = 'en-venta';
  if (disponibles <= 0) estado = 'agotado';
  else if (disponibles / capacidad <= 0.1) estado = 'pocos-boletos';
  return { ...evento, estado };
}

function esperar() {
  return simularPeticion(() => null, { retraso: 700 });
}

// Un organizador solo ve sus propios eventos; el administrador ve todos
export function eventosVisibles(eventos, usuario) {
  if (usuario?.rol === 'organizador') return eventos.filter((evento) => evento.organizadorId === usuario.id);
  return eventos;
}

export function useEventosAdmin() {
  const [eventos, setEventos] = useLocalStorage(CLAVE_EVENTOS_ADMIN, EVENTOS);

  // Carga inicial simulada, para mostrar el estado de carga del panel
  const carga = usePeticion((signal) => simularPeticion(() => true, { signal, retraso: 400 }), []);

  const crearEvento = useCallback(
    async (datos, organizadorId) => {
      await esperar();
      const nuevo = conEstadoActualizado({
        id: `evt-${Date.now()}`,
        ciudad: 'San Salvador',
        estado: 'en-venta',
        organizadorId,
        ...IMAGEN_POR_CATEGORIA[datos.categoria],
        ...datos,
      });
      setEventos((actuales) => [nuevo, ...actuales]);
      return nuevo;
    },
    [setEventos],
  );

  const actualizarEvento = useCallback(
    async (id, cambios) => {
      await esperar();
      setEventos((actuales) =>
        actuales.map((evento) => {
          if (evento.id !== id) return evento;
          const imagen = cambios.categoria !== evento.categoria ? IMAGEN_POR_CATEGORIA[cambios.categoria] : {};
          return conEstadoActualizado({ ...evento, ...imagen, ...cambios });
        }),
      );
    },
    [setEventos],
  );

  const eliminarEvento = useCallback(
    async (id) => {
      await esperar();
      setEventos((actuales) => actuales.filter((evento) => evento.id !== id));
    },
    [setEventos],
  );

  // Crea la zona si no existe o la reemplaza si ya existe (mismo id)
  const guardarZona = useCallback(
    async (eventoId, zona) => {
      await esperar();
      setEventos((actuales) =>
        actuales.map((evento) => {
          if (evento.id !== eventoId) return evento;
          const existe = evento.zonas.some((item) => item.id === zona.id);
          const zonas = existe
            ? evento.zonas.map((item) => (item.id === zona.id ? zona : item))
            : [...evento.zonas, zona];
          return conEstadoActualizado({ ...evento, zonas });
        }),
      );
    },
    [setEventos],
  );

  const eliminarZona = useCallback(
    async (eventoId, zonaId) => {
      await esperar();
      setEventos((actuales) =>
        actuales.map((evento) =>
          evento.id === eventoId
            ? conEstadoActualizado({ ...evento, zonas: evento.zonas.filter((zona) => zona.id !== zonaId) })
            : evento,
        ),
      );
    },
    [setEventos],
  );

  return {
    eventos,
    cargando: carga.estado === 'cargando',
    crearEvento,
    actualizarEvento,
    eliminarEvento,
    guardarZona,
    eliminarZona,
  };
}
