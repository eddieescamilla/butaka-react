// ARCHIVO COMPARTIDO (congelado). Ver CONTRIBUIR.md antes de cambiarlo.

export const CATEGORIAS = [
  { id: 'conciertos', nombre: 'Conciertos' },
  { id: 'teatro', nombre: 'Teatro' },
  { id: 'deportes', nombre: 'Deportes' },
  { id: 'otros', nombre: 'Otros' },
];

// Estados posibles de un evento y el texto que se muestra en la interfaz
export const ESTADOS_EVENTO = {
  'en-venta': 'En venta',
  'pocos-boletos': 'Pocos boletos',
  agotado: 'Agotado',
  cancelado: 'Cancelado',
  finalizado: 'Finalizado',
};

export const ROLES = {
  cliente: 'Cliente',
  organizador: 'Organizador',
  admin: 'Administrador',
};

// Máximo de boletos por zona en una sola compra
export const MAXIMO_BOLETOS_POR_ZONA = 10;

// Cargo por servicio que se suma al subtotal (5 %)
export const CARGO_SERVICIO = 0.05;
