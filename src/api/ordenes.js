// DUEÑO: Eddie. Recurso "ordenes" de la API falsa (módulos 4, 5, 6 y 8).
// Compra (Gabriel), boletos con QR (Gabriel) y reportes (Eddie) leen las mismas órdenes.
//
// Forma de una orden:
//   { id, usuarioId, canal: 'en-linea' | 'taquilla', fechaCompra, estado: 'pagada' | 'reembolsada',
//     items: [{ eventoId, zonaId, cantidad, precioUnitario }], subtotal, cargoServicio, total,
//     tarjeta?: { titular, ultimos4 }, boletos?: [...] }
// Las órdenes de taquilla (lotes vendidos en el lugar) no generan boletos electrónicos.

import { CARGO_SERVICIO } from '../data/categorias.js';
import { ErrorApi, escribirColeccion, leerColeccion } from './cliente.js';
import { registrarVenta } from './eventos.js';

// ---------- Códigos de boleto y firma verificable ----------

// "ord-1001" + índice 0 → "BTK-1001-01"
export function codigoBoleto(ordenId, indice) {
  return `BTK-${ordenId.replace('ord-', '')}-${String(indice + 1).padStart(2, '0')}`;
}

// "BTK-1001-01" → "ord-1001"
export function ordenDelCodigo(codigo) {
  const partes = codigo.split('-');
  return partes.length === 3 ? `ord-${partes[1]}` : '';
}

// Firma corta del boleto (hash FNV-1a). El QR lleva el código y la firma, y la
// pantalla de verificación vuelve a calcularla: si alguien cambia un dígito del
// código, la firma ya no coincide. Es una verificación académica: sin backend
// no hay una clave secreta de verdad.
export function firmarBoleto(codigo) {
  let hash = 0x811c9dc5;
  for (const caracter of `${codigo}|${ordenDelCodigo(codigo)}|butaka-2026`) {
    hash ^= caracter.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36).toUpperCase().padStart(7, '0');
}

// ---------- Boletos de una orden ----------

// Une cada boleto con los datos del evento. Cada boleto guarda una copia de
// título, fecha, lugar y zona, para mostrarse aunque el evento cambie después.
function conBoletos(orden, eventos) {
  if (orden.canal === 'taquilla') return { ...orden, boletos: [] };
  let indice = 0;
  const generados =
    orden.boletos ??
    orden.items.flatMap((item) =>
      Array.from({ length: item.cantidad }, () => {
        const evento = eventos.find((e) => e.id === item.eventoId);
        const zona = evento?.zonas.find((z) => z.id === item.zonaId);
        const boleto = {
          codigo: codigoBoleto(orden.id, indice),
          eventoId: item.eventoId,
          zonaId: item.zonaId,
          eventoTitulo: evento?.titulo ?? 'Evento',
          fecha: evento?.fecha,
          lugar: evento?.lugar,
          zonaNombre: zona?.nombre ?? item.zonaId,
          precio: item.precioUnitario,
        };
        indice += 1;
        return boleto;
      }),
    );
  return {
    ...orden,
    boletos: generados.map((boleto) => ({ ...boleto, ordenId: orden.id, estado: orden.estado, firma: firmarBoleto(boleto.codigo) })),
  };
}

async function ordenesConBoletos(signal) {
  const [ordenes, eventos] = await Promise.all([leerColeccion('ordenes', { signal }), leerColeccion('eventos', { signal })]);
  return ordenes.map((orden) => conBoletos(orden, eventos));
}

// ---------- Lectura ----------

// Todas las órdenes (reportes) o las de un usuario (Mis boletos), de la más reciente a la más antigua
export async function listarOrdenes({ usuarioId } = {}, { signal } = {}) {
  const ordenes = await ordenesConBoletos(signal);
  return ordenes
    .filter((orden) => !usuarioId || orden.usuarioId === usuarioId)
    .sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra));
}

export async function obtenerOrden(id, { usuarioId } = {}, { signal } = {}) {
  const ordenes = await ordenesConBoletos(signal);
  const orden = ordenes.find((item) => item.id === id && (!usuarioId || item.usuarioId === usuarioId));
  if (!orden) throw new ErrorApi('No encontramos esta orden en tu cuenta.', 404);
  return orden;
}

// Un boleto de la cuenta del usuario
export async function obtenerBoleto(codigo, { usuarioId } = {}, { signal } = {}) {
  const ordenes = await ordenesConBoletos(signal);
  const boleto = ordenes
    .filter((orden) => !usuarioId || orden.usuarioId === usuarioId)
    .flatMap((orden) => orden.boletos)
    .find((item) => item.codigo === codigo);
  if (!boleto) throw new ErrorApi('No encontramos este boleto. Revisa que el código sea correcto y que pertenezca a tu cuenta.', 404);
  return boleto;
}

// Verificación pública del QR (lo que haría el lector en la entrada del evento).
// Devuelve { valido, motivo, boleto }; boleto es null si no está en este dispositivo.
export async function verificarBoleto(codigo, firma, { signal } = {}) {
  if (!firma || firmarBoleto(codigo) !== firma.toUpperCase()) {
    return { valido: false, motivo: 'La firma no coincide: el código fue alterado o no es de Butaka.', boleto: null };
  }
  const ordenes = await ordenesConBoletos(signal);
  const boleto = ordenes.flatMap((orden) => orden.boletos).find((item) => item.codigo === codigo) ?? null;
  if (boleto?.estado === 'reembolsada') {
    return { valido: false, motivo: 'Este boleto fue reembolsado y ya no es válido.', boleto };
  }
  return { valido: true, motivo: 'Firma válida.', boleto };
}

// ---------- Escritura ----------

// Crea una orden pagada. La API recalcula los montos (no confía en el cliente),
// descuenta los boletos del inventario y genera los boletos con su firma.
//   datos: { usuarioId, items: [{ eventoId, zonaId, cantidad, precio }], tarjeta: { titular, ultimos4 } }
export async function crearOrden({ usuarioId, items, tarjeta }, { signal } = {}) {
  if (!usuarioId) throw new ErrorApi('Inicia sesión para completar la compra.', 401);
  if (!items?.length) throw new ErrorApi('Tu carrito está vacío.', 400);

  const eventos = await leerColeccion('eventos', { signal });
  const lineas = items.map((item) => {
    const zona = eventos.find((e) => e.id === item.eventoId)?.zonas.find((z) => z.id === item.zonaId);
    if (!zona) throw new ErrorApi('Uno de los boletos del carrito ya no está disponible.', 409);
    return { eventoId: item.eventoId, zonaId: item.zonaId, cantidad: item.cantidad, precioUnitario: zona.precio };
  });

  await registrarVenta(lineas);

  const subtotal = lineas.reduce((suma, linea) => suma + linea.cantidad * linea.precioUnitario, 0);
  const cargoServicio = Math.round(subtotal * CARGO_SERVICIO * 100) / 100;

  const orden = await escribirColeccion('ordenes', (ordenes) => {
    const numero = Math.max(...ordenes.map((o) => Number(o.id.replace('ord-', '')) || 0)) + 1;
    const nueva = {
      id: `ord-${numero}`,
      usuarioId,
      canal: 'en-linea',
      fechaCompra: new Date().toISOString(),
      estado: 'pagada',
      items: lineas,
      subtotal,
      cargoServicio,
      total: Math.round((subtotal + cargoServicio) * 100) / 100,
      tarjeta,
    };
    // Se guarda una copia de los boletos con los datos del evento de ese momento
    const boletos = conBoletos(nueva, eventos).boletos.map(({ firma: _f, estado: _e, ordenId: _o, ...boleto }) => boleto);
    return { lista: [...ordenes, { ...nueva, boletos }], resultado: { ...nueva, boletos } };
  });

  return conBoletos(orden, eventos);
}
