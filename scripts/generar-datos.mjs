// DUEÑO: Eddie. Genera public/api/ordenes.json a partir de eventos.json y usuarios.json.
//
// Por qué existe: los reportes se calculan con las órdenes, así que la suma
// de boletos de las órdenes de cada zona debe ser igual a sus "vendidos".
// El script reparte esos vendidos entre:
//   - órdenes en línea (canal "en-linea") de 1 a 6 boletos, de clientes ficticios;
//   - lotes de taquilla (canal "taquilla") para el resto, sin boletos electrónicos.
// El evento cancelado recibe algunas órdenes reembolsadas (no cuentan como vendidas).
//
// Uso: npm run datos   (los números aleatorios usan una semilla fija:
// siempre se generan las mismas órdenes)

import { readFileSync, writeFileSync } from 'node:fs';

const leer = (ruta) => JSON.parse(readFileSync(new URL(`../public/api/${ruta}`, import.meta.url), 'utf8'));
const eventos = leer('eventos.json');
const usuarios = leer('usuarios.json');

// Números pseudoaleatorios repetibles (mulberry32)
let semilla = 20261121;
function aleatorio() {
  semilla = (semilla + 0x6d2b79f5) | 0;
  let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const entero = (min, max) => min + Math.floor(aleatorio() * (max - min + 1));
const elegir = (lista) => lista[Math.floor(aleatorio() * lista.length)];

const CARGO_SERVICIO = 0.05;
const INICIO_VENTAS = new Date('2026-06-01T09:00:00-06:00');
const CORTE = new Date('2026-11-20T21:00:00-06:00'); // última fecha con ventas simuladas
const DIA = 24 * 60 * 60 * 1000;
const MAXIMO_EN_LINEA_POR_ZONA = 60;
const LOTE_TAQUILLA = 250;

// Órdenes fijas de la segunda entrega: Mis boletos de Ana López y Luis Guzmán
const FIJAS = [
  { id: 'ord-1001', usuarioId: 'usr-001', fechaCompra: '2026-11-02T14:20:00-06:00', eventoId: 'evt-001', zonaId: 'preferencial', cantidad: 2 },
  { id: 'ord-1002', usuarioId: 'usr-001', fechaCompra: '2026-11-10T09:45:00-06:00', eventoId: 'evt-008', zonaId: 'preferencial', cantidad: 1 },
  { id: 'ord-1003', usuarioId: 'usr-006', fechaCompra: '2026-10-05T18:10:00-06:00', eventoId: 'evt-012', zonaId: '10k', cantidad: 1 },
];

const clientes = usuarios.filter((u) => u.rol === 'cliente' && u.id !== 'usr-001');

// Fecha al azar dentro de la ventana de venta del evento (más ventas cerca del evento)
function fechaDeVenta(evento) {
  const fin = Math.min(new Date(evento.fecha).getTime() - DIA, CORTE.getTime());
  const inicio = Math.max(INICIO_VENTAS.getTime(), new Date(evento.fecha).getTime() - 150 * DIA);
  const avance = Math.sqrt(aleatorio()); // sesgo hacia el final
  const fecha = new Date(inicio + (fin - inicio) * avance);
  fecha.setUTCHours(entero(8, 21) + 6, entero(0, 59), 0, 0); // de 8 a.m. a 9 p.m. en El Salvador (UTC-6)
  return fecha;
}

// "2026-11-02T14:20:00-06:00" (hora de El Salvador, sin horario de verano)
function iso(fecha) {
  const local = new Date(fecha.getTime() - 6 * 60 * 60 * 1000);
  return `${local.toISOString().slice(0, 19)}-06:00`;
}

function crearOrden({ usuarioId, fecha, evento, zona, cantidad, canal, estado = 'pagada' }) {
  const subtotal = zona.precio * cantidad;
  const cargoServicio = canal === 'en-linea' ? Math.round(subtotal * CARGO_SERVICIO * 100) / 100 : 0;
  return {
    usuarioId,
    canal,
    fechaCompra: typeof fecha === 'string' ? fecha : iso(fecha),
    estado,
    items: [{ eventoId: evento.id, zonaId: zona.id, cantidad, precioUnitario: zona.precio }],
    subtotal,
    cargoServicio,
    total: subtotal + cargoServicio,
  };
}

const generadas = [];
const fijas = [];

for (const evento of eventos) {
  for (const zona of evento.zonas) {
    let restantes = zona.vendidos;

    for (const fija of FIJAS.filter((f) => f.eventoId === evento.id && f.zonaId === zona.id)) {
      fijas.push({ id: fija.id, ...crearOrden({ ...fija, fecha: fija.fechaCompra, evento, zona, canal: 'en-linea' }) });
      restantes -= fija.cantidad;
    }

    let enLinea = Math.min(restantes, Math.round(zona.vendidos * 0.4), MAXIMO_EN_LINEA_POR_ZONA);
    while (enLinea > 0) {
      const cantidad = Math.min(enLinea, entero(1, 6));
      generadas.push(crearOrden({ usuarioId: elegir(clientes).id, fecha: fechaDeVenta(evento), evento, zona, cantidad, canal: 'en-linea' }));
      enLinea -= cantidad;
      restantes -= cantidad;
    }

    while (restantes > 0) {
      const cantidad = Math.min(restantes, entero(LOTE_TAQUILLA / 2, LOTE_TAQUILLA));
      generadas.push(crearOrden({ usuarioId: null, fecha: fechaDeVenta(evento), evento, zona, cantidad, canal: 'taquilla' }));
      restantes -= cantidad;
    }
  }

  // Evento cancelado: compras en línea que se reembolsaron
  if (evento.estado === 'cancelado') {
    for (let i = 0; i < 9; i += 1) {
      const zona = elegir(evento.zonas);
      const fecha = new Date(entero(new Date('2026-10-01').getTime(), new Date('2026-11-15').getTime()));
      generadas.push(
        crearOrden({ usuarioId: elegir(clientes).id, fecha, evento, zona, cantidad: entero(1, 4), canal: 'en-linea', estado: 'reembolsada' }),
      );
    }
  }
}

generadas.sort((a, b) => new Date(a.fechaCompra) - new Date(b.fechaCompra));
const ordenes = [...generadas.map((orden, indice) => ({ id: `ord-${2001 + indice}`, ...orden })), ...fijas].sort(
  (a, b) => new Date(a.fechaCompra) - new Date(b.fechaCompra),
);

writeFileSync(new URL('../public/api/ordenes.json', import.meta.url), `${JSON.stringify(ordenes)}\n`);

// Comprobación: los boletos de las órdenes pagadas coinciden con los vendidos
for (const evento of eventos) {
  for (const zona of evento.zonas) {
    const suma = ordenes
      .filter((o) => o.estado === 'pagada')
      .flatMap((o) => o.items)
      .filter((i) => i.eventoId === evento.id && i.zonaId === zona.id)
      .reduce((total, i) => total + i.cantidad, 0);
    if (suma !== zona.vendidos) throw new Error(`${evento.id}/${zona.id}: ${suma} ≠ ${zona.vendidos}`);
  }
}
console.log(`ordenes.json: ${ordenes.length} órdenes generadas y verificadas`);
