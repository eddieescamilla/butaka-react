// DUEÑO: Eddie. Módulos 3, 7 y 8: inventario, panel de administración y reportes.
// Todas las pantallas del panel usan carga diferida (lazy): un cliente que
// nunca entra a /admin no descarga su código.
import { perezosa } from '../../app/modulos.js';

export default {
  nombre: 'admin',
  rutas: {
    // Administrador u organizador
    panel: [
      { index: true, lazy: perezosa(() => import('./DashboardPage.jsx')), handle: { titulo: 'Dashboard' } },
      { path: 'eventos', lazy: perezosa(() => import('./EventosAdminPage.jsx')), handle: { titulo: 'Eventos' } },
      { path: 'eventos/nuevo', lazy: perezosa(() => import('./CrearEventoPage.jsx')), handle: { titulo: 'Crear evento' } },
      { path: 'eventos/:id/editar', lazy: perezosa(() => import('./CrearEventoPage.jsx')), handle: { titulo: 'Editar evento' } },
      { path: 'inventario', lazy: perezosa(() => import('./InventarioPage.jsx')), handle: { titulo: 'Inventario y precios' } },
    ],
    // Solo administrador
    soloAdmin: [
      { path: 'usuarios', lazy: perezosa(() => import('./UsuariosPage.jsx')), handle: { titulo: 'Usuarios' } },
      { path: 'usuarios/nuevo', lazy: perezosa(() => import('./CrearUsuarioPage.jsx')), handle: { titulo: 'Crear usuario' } },
      { path: 'usuarios/:id/editar', lazy: perezosa(() => import('./CrearUsuarioPage.jsx')), handle: { titulo: 'Editar usuario' } },
      { path: 'reportes', lazy: perezosa(() => import('./ReportesPage.jsx')), handle: { titulo: 'Reportes' } },
    ],
  },
};
