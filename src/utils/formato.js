// ARCHIVO COMPARTIDO (congelado). Ver CONTRIBUIR.md antes de cambiarlo.
// Funciones para mostrar precios y fechas con el mismo formato en toda la app.

const formatoPrecio = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const formatoNumero = new Intl.NumberFormat('es-SV');

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

// 25 → "$25.00"
export function formatearPrecio(valor) {
  return formatoPrecio.format(valor);
}

// 1284 → "1,284"
export function formatearNumero(valor) {
  return formatoNumero.format(valor);
}

// "2026-12-12T20:00:00-06:00" → "Sáb 12 dic · 8:00 p.m."
export function formatearFecha(iso) {
  const fecha = new Date(iso);
  const dia = DIAS[fecha.getDay()];
  const mes = MESES[fecha.getMonth()];
  return `${dia} ${fecha.getDate()} ${mes} · ${formatearHora(fecha)}`;
}

// "2026-12-12T20:00:00-06:00" → "12 dic 2026"
export function formatearFechaCorta(iso) {
  const fecha = new Date(iso);
  return `${fecha.getDate()} ${MESES[fecha.getMonth()]} ${fecha.getFullYear()}`;
}

function formatearHora(fecha) {
  const horas = fecha.getHours();
  const minutos = String(fecha.getMinutes()).padStart(2, '0');
  const sufijo = horas >= 12 ? 'p.m.' : 'a.m.';
  const horas12 = horas % 12 === 0 ? 12 : horas % 12;
  return `${horas12}:${minutos} ${sufijo}`;
}

// Arma la ruta de una imagen de public/ respetando la base de Vite
// ("img/evento-teatro.jpg" → "/img/evento-teatro.jpg")
export function rutaPublica(ruta) {
  return `${import.meta.env.BASE_URL}${ruta}`;
}
