// ARCHIVO COMPARTIDO (congelado). Ver CONTRIBUIR.md antes de cambiarlo.
// React Router en modo datos: createBrowserRouter + RouterProvider (en main.jsx).
// Las rutas las registra cada módulo en su modulo.jsx (ver modulos.js);
// este archivo solo decide el layout y la protección de cada grupo.
//
//   /                         Raiz (proveedores, título, foco, avisos globales)
//   ├── LayoutCliente         encabezado + pie
//   │   ├── publicas          /, /eventos, /eventos/:id, /carrito, /checkout, /login…
//   │   ├── RutaProtegida     /boletos, /perfil, /checkout/pago… (requieren sesión)
//   │   └── *                 404
//   └── /admin RutaProtegida  administrador u organizador
//       └── LayoutAdmin       barra lateral
//           ├── panel         /admin, /admin/eventos, /admin/inventario
//           ├── RutaProtegida solo administrador: /admin/reportes, /admin/usuarios
//           └── *             404 del panel
import { createBrowserRouter } from 'react-router';
import Raiz from './Raiz.jsx';
import RutaProtegida from './RutaProtegida.jsx';
import PaginaError from './PaginaError.jsx';
import PantallaCarga from './PantallaCarga.jsx';
import { rutasDe } from './modulos.js';
import LayoutCliente from '../layout/LayoutCliente.jsx';
import LayoutAdmin from '../layout/LayoutAdmin.jsx';
import NoEncontradaPage from '../pages/NoEncontradaPage.jsx';
import SinPermisoPage from '../pages/SinPermisoPage.jsx';

export const ROLES_PANEL = ['admin', 'organizador'];

const noEncontrada = { path: '*', element: <NoEncontradaPage />, handle: { titulo: 'Página no encontrada' } };

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Raiz />,
      errorElement: <PaginaError />,
      hydrateFallbackElement: <PantallaCarga />,
      children: [
        {
          element: <LayoutCliente />,
          children: [
            {
              // Ruta sin path: si una pantalla falla, el error se ve dentro del layout
              errorElement: <PaginaError />,
              children: [...rutasDe('publicas'), { element: <RutaProtegida />, children: rutasDe('privadas') }, noEncontrada],
            },
          ],
        },
        {
          path: 'admin',
          element: (
            <RutaProtegida
              roles={ROLES_PANEL}
              sinPermiso={
                <LayoutCliente>
                  <SinPermisoPage />
                </LayoutCliente>
              }
            />
          ),
          children: [
            {
              element: <LayoutAdmin />,
              children: [
                {
                  errorElement: <PaginaError />,
                  children: [
                    ...rutasDe('panel'),
                    { element: <RutaProtegida roles={['admin']} />, children: rutasDe('soloAdmin') },
                    noEncontrada,
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  // En GitHub Pages la app vive en /butaka-react/ (ver vite.config.js)
  { basename: import.meta.env.BASE_URL },
);
