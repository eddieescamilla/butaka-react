// DUEÑO: Eddie (módulos de panel de administración y reportes).
// Datos estáticos para el dashboard y los reportes. Las ventas por evento
// se pueden calcular a partir de EVENTOS (zonas vendidas × precio).

export const RESUMEN_DASHBOARD = {
  periodo: 'Noviembre 2026',
  boletosVendidos: { valor: 1284, variacion: '+12 % vs. octubre' },
  ingresos: { valor: 32450, variacion: '+8 % vs. octubre' },
  eventosActivos: { valor: 18, variacion: '3 nuevos esta semana' },
  usuariosRegistrados: { valor: 2940, variacion: '+150 este mes' },
};

export const VENTAS_POR_MES = [
  { mes: 'Jun', boletos: 620, ingresos: 15200 },
  { mes: 'Jul', boletos: 740, ingresos: 18350 },
  { mes: 'Ago', boletos: 910, ingresos: 22700 },
  { mes: 'Sep', boletos: 860, ingresos: 21400 },
  { mes: 'Oct', boletos: 1146, ingresos: 30050 },
  { mes: 'Nov', boletos: 1284, ingresos: 32450 },
];
