// DUEÑO: Gabriel. Módulo 1: gestión de usuarios y autenticación.
import { SesionProveedor } from './SesionContext.jsx';

export default {
  nombre: 'cuenta',
  orden: 10, // la sesión envuelve a los demás proveedores
  Proveedor: SesionProveedor,
};
