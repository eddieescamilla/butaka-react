// DUEÑO: Gabriel (módulos de compra, pagos y boletos).
// Órdenes de ejemplo para que "Mis boletos" no aparezca vacío al iniciar
// sesión como Ana López. Las órdenes nuevas se guardan en localStorage.

export const ORDENES_EJEMPLO = [
  {
    id: 'ord-1001',
    usuarioId: 'usr-001',
    fechaCompra: '2026-11-02T14:20:00-06:00',
    estado: 'pagada',
    items: [
      { eventoId: 'evt-001', zonaId: 'preferencial', cantidad: 2, precioUnitario: 40 },
    ],
    subtotal: 80,
    cargoServicio: 4,
    total: 84,
    boletos: [
      { codigo: 'BTK-1001-01', eventoId: 'evt-001', zonaId: 'preferencial' },
      { codigo: 'BTK-1001-02', eventoId: 'evt-001', zonaId: 'preferencial' },
    ],
  },
  {
    id: 'ord-1002',
    usuarioId: 'usr-001',
    fechaCompra: '2026-11-10T09:45:00-06:00',
    estado: 'pagada',
    items: [
      { eventoId: 'evt-008', zonaId: 'preferencial', cantidad: 1, precioUnitario: 25 },
    ],
    subtotal: 25,
    cargoServicio: 1.25,
    total: 26.25,
    boletos: [
      { codigo: 'BTK-1002-01', eventoId: 'evt-008', zonaId: 'preferencial' },
    ],
  },
  {
    id: 'ord-1003',
    usuarioId: 'usr-006',
    fechaCompra: '2026-10-05T18:10:00-06:00',
    estado: 'pagada',
    items: [
      { eventoId: 'evt-012', zonaId: '10k', cantidad: 1, precioUnitario: 20 },
    ],
    subtotal: 20,
    cargoServicio: 1,
    total: 21,
    boletos: [
      { codigo: 'BTK-1003-01', eventoId: 'evt-012', zonaId: '10k' },
    ],
  },
];
