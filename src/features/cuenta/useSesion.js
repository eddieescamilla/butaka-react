// DUEÑO: Gabriel. Hook para leer la sesión global desde cualquier componente.
// Los nombres de lo que devuelve son el contrato con Eddie (encabezado, panel
// y rutas protegidas): no cambiarlos.
//
//   usuario            objeto del usuario sin contraseña, o null si no hay sesión
//   haySesion          boolean
//   esAdmin            boolean: rol 'admin' u 'organizador' (pueden entrar al panel)
//   iniciarSesion(u)   guarda la sesión con el usuario recibido
//   cerrarSesion()     borra la sesión
//   actualizarUsuario(cambios)  actualiza datos del perfil (nombre, apellido)
import { useContext } from 'react';
import { SesionContext } from './SesionContext.jsx';

export function useSesion() {
  const sesion = useContext(SesionContext);
  if (!sesion) throw new Error('useSesion() debe usarse dentro de <SesionProveedor>.');
  return sesion;
}
