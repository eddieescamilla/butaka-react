// DUEÑO: Eddie. Módulo 8: cálculos de los reportes a partir de las órdenes.
// Son funciones puras: reciben las órdenes y los eventos de la API falsa y
// devuelven valores derivados. Nada de esto se guarda como estado.
//   - Ingresos: total pagado de las órdenes "pagada" (incluye el cargo por servicio).
//   - Boletos: suma de las cantidades de esas órdenes.
//   - Reembolsos: órdenes "reembolsada" (no cuentan como ingresos ni como boletos).

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const DIA = 24 * 60 * 60 * 1000;

export const PERIODOS = [
  { valor: 'mes', texto: 'Este mes' },
  { valor: '30', texto: 'Últimos 30 días' },
  { valor: '90', texto: 'Últimos 90 días' },
  { valor: 'todo', texto: 'Todo el historial' },
  { valor: 'personalizado', texto: 'Personalizado' },
];

// Devuelve { desde, hasta } (Date o null) para un periodo
export function rangoDelPeriodo(periodo, { desde, hasta } = {}, hoy = new Date()) {
  const finDeHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);
  switch (periodo) {
    case 'mes':
      return { desde: new Date(hoy.getFullYear(), hoy.getMonth(), 1), hasta: finDeHoy };
    case '30':
    case '90':
      return { desde: new Date(finDeHoy.getTime() - Number(periodo) * DIA), hasta: finDeHoy };
    case 'personalizado':
      return {
        desde: desde ? new Date(`${desde}T00:00:00`) : null,
        hasta: hasta ? new Date(`${hasta}T23:59:59`) : null,
      };
    default:
      return { desde: null, hasta: null };
  }
}

// Órdenes dentro del rango y de los eventos indicados (eventosIds = null → todos)
export function filtrarOrdenes(ordenes, { desde, hasta, eventosIds = null }) {
  return ordenes
    .filter((orden) => {
      const fecha = new Date(orden.fechaCompra);
      return (!desde || fecha >= desde) && (!hasta || fecha <= hasta);
    })
    .map((orden) => (eventosIds ? { ...orden, items: orden.items.filter((item) => eventosIds.has(item.eventoId)) } : orden))
    .filter((orden) => orden.items.length > 0);
}

// Ingreso de una orden atribuible a sus items (si se filtró por evento, solo esos items)
function ingresoDe(orden) {
  const subtotalItems = orden.items.reduce((suma, item) => suma + item.cantidad * item.precioUnitario, 0);
  return orden.subtotal ? (orden.total * subtotalItems) / orden.subtotal : subtotalItems;
}

function boletosDe(orden) {
  return orden.items.reduce((suma, item) => suma + item.cantidad, 0);
}

export function resumen(ordenes) {
  const pagadas = ordenes.filter((orden) => orden.estado === 'pagada');
  const reembolsadas = ordenes.filter((orden) => orden.estado === 'reembolsada');
  const ingresos = pagadas.reduce((suma, orden) => suma + ingresoDe(orden), 0);
  const boletos = pagadas.reduce((suma, orden) => suma + boletosDe(orden), 0);
  const enLinea = pagadas.filter((orden) => orden.canal === 'en-linea');
  return {
    ingresos,
    boletos,
    ordenes: pagadas.length,
    ingresoPorOrden: pagadas.length ? ingresos / pagadas.length : 0,
    precioPromedio: boletos ? ingresos / boletos : 0,
    boletosEnLinea: enLinea.reduce((suma, orden) => suma + boletosDe(orden), 0),
    reembolsos: reembolsadas.length,
    montoReembolsado: reembolsadas.reduce((suma, orden) => suma + ingresoDe(orden), 0),
  };
}

// Boletos e ingresos por mes. Si no se da un rango, se usa del primer al último mes con ventas.
export function porMes(ordenes, { desde, hasta } = {}) {
  const pagadas = ordenes.filter((orden) => orden.estado === 'pagada');
  if (pagadas.length === 0) return [];
  const fechas = pagadas.map((orden) => new Date(orden.fechaCompra));
  const inicio = desde ?? new Date(Math.min(...fechas));
  const fin = hasta ?? new Date(Math.max(...fechas));
  const meses = [];
  for (let fecha = new Date(inicio.getFullYear(), inicio.getMonth(), 1); fecha <= fin; fecha.setMonth(fecha.getMonth() + 1)) {
    meses.push({ clave: `${fecha.getFullYear()}-${fecha.getMonth()}`, etiqueta: MESES[fecha.getMonth()], boletos: 0, ingresos: 0 });
  }
  for (const orden of pagadas) {
    const fecha = new Date(orden.fechaCompra);
    const mes = meses.find((m) => m.clave === `${fecha.getFullYear()}-${fecha.getMonth()}`);
    if (mes) {
      mes.boletos += boletosDe(orden);
      mes.ingresos += ingresoDe(orden);
    }
  }
  return meses;
}

// Una fila por evento con ventas en el periodo, de mayor a menor ingreso
export function porEvento(ordenes, eventos) {
  return eventos
    .map((evento) => {
      const delEvento = ordenes.map((orden) => ({ ...orden, items: orden.items.filter((item) => item.eventoId === evento.id) })).filter((orden) => orden.items.length);
      const datos = resumen(delEvento);
      const capacidad = evento.zonas.reduce((suma, zona) => suma + zona.capacidad, 0);
      const vendidos = evento.zonas.reduce((suma, zona) => suma + zona.vendidos, 0);
      return { ...evento, ...datos, ocupacion: capacidad ? Math.round((vendidos / capacidad) * 100) : 0 };
    })
    .filter((fila) => fila.ordenes > 0 || fila.reembolsos > 0)
    .sort((a, b) => b.ingresos - a.ingresos);
}

// Una fila por zona de un evento
export function porZona(ordenes, evento) {
  return evento.zonas.map((zona) => {
    const items = ordenes
      .filter((orden) => orden.estado === 'pagada')
      .flatMap((orden) => orden.items)
      .filter((item) => item.eventoId === evento.id && item.zonaId === zona.id);
    const boletos = items.reduce((suma, item) => suma + item.cantidad, 0);
    return { ...zona, boletos, ingresos: items.reduce((suma, item) => suma + item.cantidad * item.precioUnitario, 0) };
  });
}

// "+12 % vs. el mes anterior"
export function variacion(actual, anterior, texto = 'vs. el mes anterior') {
  if (!anterior) return actual ? 'Sin ventas el mes anterior' : 'Sin ventas aún';
  const porcentaje = Math.round(((actual - anterior) / anterior) * 100);
  return `${porcentaje >= 0 ? '+' : ''}${porcentaje} % ${texto}`;
}
