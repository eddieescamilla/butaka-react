// DUEÑO: Eddie. Recurso "usuarios" de la API falsa (módulos 1 y 7).
// Autenticación simulada y administración de cuentas.
// Las cuentas son ficticias (dominio correo.com) y la contraseña de prueba es
// la misma para todas: no se guardan contraseñas reales ni datos personales.

import { ErrorApi, escribirColeccion, leerColeccion, nuevoId } from './cliente.js';

export const CONTRASENA_DEMO = 'Butaka2026';

// Nunca sale de la API un usuario con su contraseña
function sinContrasena({ contrasena: _omitida, ...usuario }) {
  return usuario;
}

function mismoCorreo(a, b) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

// ---------- Autenticación (Gabriel) ----------

// Mismo mensaje para correo o contraseña incorrectos (no revela qué cuentas existen)
export async function autenticar(correo, contrasena, { signal } = {}) {
  const usuarios = await leerColeccion('usuarios', { signal });
  const usuario = usuarios.find((item) => mismoCorreo(item.correo, correo));
  if (!usuario || usuario.contrasena !== contrasena) {
    throw new ErrorApi('El correo o la contraseña no son correctos.', 401);
  }
  if (usuario.estado === 'inactivo') {
    throw new ErrorApi('Tu cuenta está desactivada. Escribe a soporte@butaka.com para reactivarla.', 403);
  }
  return sinContrasena(usuario);
}

export async function existeCorreo(correo, { signal } = {}) {
  const usuarios = await leerColeccion('usuarios', { signal });
  return usuarios.some((item) => mismoCorreo(item.correo, correo));
}

// Registro desde el sitio: siempre crea una cuenta de cliente
export function registrarCliente(datos) {
  return escribirColeccion('usuarios', (usuarios) => {
    if (usuarios.some((item) => mismoCorreo(item.correo, datos.correo))) {
      throw new ErrorApi('Ya existe una cuenta con este correo.', 409);
    }
    const nuevo = { id: nuevoId('usr'), rol: 'cliente', estado: 'activo', creado: new Date().toISOString().slice(0, 10), ...datos };
    return { lista: [...usuarios, nuevo], resultado: sinContrasena(nuevo) };
  });
}

// ---------- Administración (Eddie) ----------

export async function listarUsuarios({ signal } = {}) {
  const usuarios = await leerColeccion('usuarios', { signal });
  return usuarios.map(sinContrasena);
}

export function crearUsuario(datos) {
  return escribirColeccion('usuarios', (usuarios) => {
    if (usuarios.some((item) => mismoCorreo(item.correo, datos.correo))) {
      throw new ErrorApi('Ya existe un usuario con ese correo.', 409);
    }
    const nuevo = { id: nuevoId('usr'), estado: 'activo', creado: new Date().toISOString().slice(0, 10), ...datos };
    return { lista: [...usuarios, nuevo], resultado: sinContrasena(nuevo) };
  });
}

// cambios.contrasena vacía o ausente = no se cambia
export function actualizarUsuario(id, cambios) {
  return escribirColeccion('usuarios', (usuarios) => {
    const actual = usuarios.find((item) => item.id === id);
    if (!actual) throw new ErrorApi('No encontramos este usuario.', 404);
    const { contrasena, ...resto } = cambios;
    const actualizado = { ...actual, ...resto, ...(contrasena ? { contrasena } : {}) };
    return { lista: usuarios.map((item) => (item.id === id ? actualizado : item)), resultado: sinContrasena(actualizado) };
  });
}

// Los usuarios no se borran: se activan o desactivan
export function cambiarEstadoUsuario(id) {
  return escribirColeccion('usuarios', (usuarios) => {
    const actual = usuarios.find((item) => item.id === id);
    if (!actual) throw new ErrorApi('No encontramos este usuario.', 404);
    const actualizado = { ...actual, estado: actual.estado === 'activo' ? 'inactivo' : 'activo' };
    return { lista: usuarios.map((item) => (item.id === id ? actualizado : item)), resultado: sinContrasena(actualizado) };
  });
}
