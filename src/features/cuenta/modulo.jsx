// DUEÑO: Gabriel. Módulo 1: gestión de usuarios y autenticación.
// Registra el Context de sesión y las rutas de la cuenta.
import { SesionProveedor } from './SesionContext.jsx';
import LoginPage from './LoginPage.jsx';
import RegistroPage from './RegistroPage.jsx';
import RecuperarPage from './RecuperarPage.jsx';
import PerfilPage from './PerfilPage.jsx';

export default {
  nombre: 'cuenta',
  orden: 10, // la sesión envuelve a los demás proveedores
  Proveedor: SesionProveedor,
  rutas: {
    publicas: [
      { path: 'login', Component: LoginPage, handle: { titulo: 'Iniciar sesión' } },
      { path: 'registro', Component: RegistroPage, handle: { titulo: 'Crear cuenta' } },
      { path: 'recuperar', Component: RecuperarPage, handle: { titulo: 'Recuperar contraseña' } },
    ],
    privadas: [{ path: 'perfil', Component: PerfilPage, handle: { titulo: 'Mi perfil' } }],
  },
};
