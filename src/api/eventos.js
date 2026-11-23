// DUEÑO: Eddie. Recurso "eventos" de la API falsa (módulos 2 y 3).
// Lectura para el sitio del cliente y CRUD para el panel de administración.
// Un evento tiene zonas con { id, nombre, precio, capacidad, vendidos }.

import { ErrorApi, escribirColeccion, leerColeccion, nuevoId } from './cliente.js';

const IMAGEN_POR_CATEGORIA = {
  conciertos: { imagen: 'img/evento-concierto.jpg', imagenAlt: 'Público frente a un escenario iluminado' },
  teatro: { imagen: 'img/evento-teatro.jpg', imagenAlt: 'Butacas de un teatro frente al escenario' },
  deportes: { imagen: 'img/evento-deportes.jpg', imagenAlt: 'Estadio con graderías y público' },
  otros: { imagen: 'img/evento-festival.jpg', imagenAlt: 'Público en un evento al aire libre' },
};

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

// El estado de venta se recalcula según las zonas (salvo cancelado o finalizado)
export function conEstadoActualizado(evento) {
  if (evento.estado === 'cancelado' || evento.estado === 'finalizado') return evento;
  const capacidad = evento.zonas.reduce((suma, zona) => suma + zona.capacidad, 0);
  const vendidos = evento.zonas.reduce((suma, zona) => suma + zona.vendidos, 0);
  const disponibles = capacidad - vendidos;
  let estado = 'en-venta';
  if (disponibles <= 0) estado = 'agotado';
  else if (disponibles / capacidad <= 0.1) estado = 'pocos-boletos';
  return { ...evento, estado };
}

function noEncontrado() {
  return new ErrorApi('No encontramos este evento. Puede que ya no esté disponible.', 404);
}

// ---------- Lectura ----------

// Lista de eventos con búsqueda por texto (título, lugar y ciudad, sin importar
// tildes ni mayúsculas) y filtro por categoría
export async function listarEventos({ busqueda = '', categoria = '' } = {}, { signal } = {}) {
  const eventos = await leerColeccion('eventos', { signal });
  const termino = normalizar(busqueda.trim());
  return eventos.filter((evento) => {
    const coincideCategoria = !categoria || evento.categoria === categoria;
    const coincideBusqueda = !termino || normalizar(`${evento.titulo} ${evento.lugar} ${evento.ciudad}`).includes(termino);
    return coincideCategoria && coincideBusqueda;
  });
}

export async function obtenerEvento(id, { signal } = {}) {
  const eventos = await leerColeccion('eventos', { signal });
  const evento = eventos.find((item) => item.id === id);
  if (!evento) throw noEncontrado();
  return evento;
}

// ---------- Escritura (panel de administración) ----------

export function crearEvento(datos, organizadorId) {
  return escribirColeccion('eventos', (eventos) => {
    const nuevo = conEstadoActualizado({
      id: nuevoId('evt'),
      ciudad: 'San Salvador',
      estado: 'en-venta',
      organizadorId,
      ...IMAGEN_POR_CATEGORIA[datos.categoria],
      ...datos,
    });
    return { lista: [nuevo, ...eventos], resultado: nuevo };
  });
}

export function actualizarEvento(id, cambios) {
  return escribirColeccion('eventos', (eventos) => {
    const actual = eventos.find((evento) => evento.id === id);
    if (!actual) throw noEncontrado();
    const imagen = cambios.categoria && cambios.categoria !== actual.categoria ? IMAGEN_POR_CATEGORIA[cambios.categoria] : {};
    const actualizado = conEstadoActualizado({ ...actual, ...imagen, ...cambios });
    return { lista: eventos.map((evento) => (evento.id === id ? actualizado : evento)), resultado: actualizado };
  });
}

export function eliminarEvento(id) {
  return escribirColeccion('eventos', (eventos) => {
    if (!eventos.some((evento) => evento.id === id)) throw noEncontrado();
    return { lista: eventos.filter((evento) => evento.id !== id), resultado: id };
  });
}

// Inventario y precios: crea la zona si no existe o la reemplaza (mismo id)
export function guardarZona(eventoId, zona) {
  return escribirColeccion('eventos', (eventos) => {
    const actual = eventos.find((evento) => evento.id === eventoId);
    if (!actual) throw noEncontrado();
    const existe = actual.zonas.some((item) => item.id === zona.id);
    const zonas = existe ? actual.zonas.map((item) => (item.id === zona.id ? zona : item)) : [...actual.zonas, zona];
    const actualizado = conEstadoActualizado({ ...actual, zonas });
    return { lista: eventos.map((evento) => (evento.id === eventoId ? actualizado : evento)), resultado: actualizado };
  });
}

export function eliminarZona(eventoId, zonaId) {
  return escribirColeccion('eventos', (eventos) => {
    const actual = eventos.find((evento) => evento.id === eventoId);
    if (!actual) throw noEncontrado();
    const zona = actual.zonas.find((item) => item.id === zonaId);
    if (zona?.vendidos > 0) throw new ErrorApi('No se puede eliminar una zona con boletos vendidos.', 409);
    const actualizado = conEstadoActualizado({ ...actual, zonas: actual.zonas.filter((item) => item.id !== zonaId) });
    return { lista: eventos.map((evento) => (evento.id === eventoId ? actualizado : evento)), resultado: actualizado };
  });
}

// ---------- Uso interno de la API (órdenes) ----------

// Suma boletos vendidos a las zonas. Falla si alguna zona no tiene suficientes.
// items: [{ eventoId, zonaId, cantidad }]
export function registrarVenta(items) {
  return escribirColeccion('eventos', (eventos) => {
    const lista = eventos.map((evento) => {
      const delEvento = items.filter((item) => item.eventoId === evento.id);
      if (delEvento.length === 0) return evento;
      const zonas = evento.zonas.map((zona) => {
        const pedido = delEvento.filter((item) => item.zonaId === zona.id).reduce((suma, item) => suma + item.cantidad, 0);
        if (pedido > zona.capacidad - zona.vendidos) {
          throw new ErrorApi(`Ya no quedan suficientes boletos en la zona ${zona.nombre} de “${evento.titulo}”.`, 409);
        }
        return { ...zona, vendidos: zona.vendidos + pedido };
      });
      return conEstadoActualizado({ ...evento, zonas });
    });
    return { lista, resultado: true };
  });
}
