// ARCHIVO COMPARTIDO (congelado). Protege un grupo de rutas.
//   - Sin sesión: redirige a /login y guarda la ruta pedida en location.state.desde,
//     para que el login regrese ahí después de iniciar sesión.
//   - Con sesión pero sin el rol necesario: muestra "Sin permiso".
// Props:
//   roles:      roles que pueden entrar (si no se indica, basta con tener sesión)
//   sinPermiso: lo que se dibuja si el rol no alcanza (por defecto <SinPermisoPage />)
import { Navigate, Outlet, useLocation } from 'react-router';
import { useSesion } from '../features/cuenta/useSesion.js';
import SinPermisoPage from '../pages/SinPermisoPage.jsx';

export default function RutaProtegida({ roles, sinPermiso }) {
  const { haySesion, usuario } = useSesion();
  const ubicacion = useLocation();

  if (!haySesion) return <Navigate to="/login" replace state={{ desde: ubicacion }} />;
  if (roles && !roles.includes(usuario.rol)) return sinPermiso ?? <SinPermisoPage />;
  return <Outlet />;
}
