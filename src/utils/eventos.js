// ARCHIVO COMPARTIDO (congelado). Ver CONTRIBUIR.md antes de cambiarlo.
// Valores derivados de un evento. Se calculan cada vez en lugar de guardarse
// como estado aparte, para que nunca queden desactualizados.

// Boletos que quedan en una zona
export function disponiblesZona(zona) {
  return Math.max(zona.capacidad - zona.vendidos, 0);
}

// Estado de disponibilidad de una zona para mostrarlo en la interfaz
export function estadoZona(zona) {
  const disponibles = disponiblesZona(zona);
  if (disponibles === 0) return 'agotado';
  if (disponibles / zona.capacidad <= 0.1) return 'pocos-boletos';
  return 'en-venta';
}

// Precio más bajo del evento ("Desde $25.00")
export function precioDesde(evento) {
  return Math.min(...evento.zonas.map((zona) => zona.precio));
}

export function capacidadTotal(evento) {
  return evento.zonas.reduce((suma, zona) => suma + zona.capacidad, 0);
}

export function vendidosTotal(evento) {
  return evento.zonas.reduce((suma, zona) => suma + zona.vendidos, 0);
}

export function ingresosEvento(evento) {
  return evento.zonas.reduce((suma, zona) => suma + zona.vendidos * zona.precio, 0);
}

// Solo se pueden comprar boletos de eventos en venta o con pocos boletos
export function sePuedeComprar(evento) {
  return evento.estado === 'en-venta' || evento.estado === 'pocos-boletos';
}
