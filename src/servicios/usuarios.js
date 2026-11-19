// ARCHIVO COMPARTIDO (congelado). Ver CONTRIBUIR.md antes de cambiarlo.
// Usuarios de la plataforma, con los cambios del panel de administración.
// Si el administrador crea o desactiva un usuario, el login puede usar
// listaUsuarios() para tomarlo en cuenta.

import { USUARIOS } from '../data/usuarios.js';

export const CLAVE_USUARIOS_ADMIN = 'butaka:admin-usuarios';

export function listaUsuarios() {
  try {
    const guardado = localStorage.getItem(CLAVE_USUARIOS_ADMIN);
    if (guardado) return JSON.parse(guardado);
  } catch {
    // Si el valor guardado está dañado, se usan los datos simulados
  }
  return USUARIOS;
}
