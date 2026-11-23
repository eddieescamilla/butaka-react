// ARCHIVO COMPARTIDO (congelado). Ver CONTRIBUIR.md antes de cambiarlo.
// Descubre los módulos de la aplicación: cada carpeta de src/features/ puede
// tener un archivo modulo.jsx que registra sus rutas, su Context y sus
// componentes globales. Así nadie tiene que editar el router para agregar
// una pantalla, y cada integrante trabaja solo en sus carpetas.
//
// Forma de un modulo.jsx (todo es opcional):
//   export default {
//     nombre: 'compra',
//     orden: 20,                 // orden de los proveedores (menor = más afuera)
//     Proveedor,                 // Context Provider que envuelve toda la app
//     Global,                    // componente que se dibuja siempre (avisos de la PWA)
//     rutas: {
//       publicas:  [...],        // sitio del cliente, sin sesión
//       privadas:  [...],        // sitio del cliente, con sesión
//       panel:     [...],        // /admin/..., administrador u organizador
//       soloAdmin: [...],        // /admin/..., solo administrador
//     },
//   };

const archivos = import.meta.glob('../features/*/modulo.jsx', { eager: true });

export const MODULOS = Object.values(archivos)
  .map((archivo) => archivo.default)
  .sort((a, b) => (a.orden ?? 50) - (b.orden ?? 50));

export function rutasDe(tipo) {
  return MODULOS.flatMap((modulo) => modulo.rutas?.[tipo] ?? []);
}

// Carga diferida de una pantalla: su código se descarga la primera vez que se visita.
//   lazy: perezosa(() => import('./ReportesPage.jsx'))
export function perezosa(importar) {
  return async () => ({ Component: (await importar()).default });
}
