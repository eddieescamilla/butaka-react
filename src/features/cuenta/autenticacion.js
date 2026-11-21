// DUEÑO: Gabriel. "Servidor" simulado de autenticación.
// Busca usuarios en la lista del panel (listaUsuarios) y en las cuentas
// registradas desde este sitio ('butaka:registros'). Todo es simulado:
// no hay backend y las contraseñas de prueba están en los datos.

import { listaUsuarios } from '../../servicios/usuarios.js';
import { simularPeticion } from '../../utils/simularPeticion.js';

export const CLAVE_REGISTROS = 'butaka:registros';

function leerRegistros() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_REGISTROS)) ?? [];
  } catch {
    return [];
  }
}

function todosLosUsuarios() {
  return [...listaUsuarios(), ...leerRegistros()];
}

export function correoRegistrado(correo) {
  const buscado = correo.trim().toLowerCase();
  return todosLosUsuarios().some((usuario) => usuario.correo.toLowerCase() === buscado);
}

export function autenticar(correo, contrasena) {
  return simularPeticion(
    () => {
      const buscado = correo.trim().toLowerCase();
      const usuario = todosLosUsuarios().find((item) => item.correo.toLowerCase() === buscado);
      // Mismo mensaje para correo o contraseña incorrectos (no revela qué cuentas existen)
      if (!usuario || usuario.contrasena !== contrasena) {
        throw new Error('El correo o la contraseña no son correctos.');
      }
      if (usuario.estado === 'inactivo') {
        throw new Error('Tu cuenta está desactivada. Escribe a soporte@butaka.com para reactivarla.');
      }
      return usuario;
    },
    { retraso: 800 },
  );
}

export function registrar(datos) {
  return simularPeticion(
    () => {
      if (correoRegistrado(datos.correo)) throw new Error('Ya existe una cuenta con este correo.');
      const nuevo = {
        id: `usr-${Date.now()}`,
        rol: 'cliente',
        estado: 'activo',
        creado: new Date().toISOString().slice(0, 10),
        ...datos,
      };
      localStorage.setItem(CLAVE_REGISTROS, JSON.stringify([...leerRegistros(), nuevo]));
      return nuevo;
    },
    { retraso: 900 },
  );
}

// Siempre responde igual, exista o no el correo (buena práctica de seguridad)
export function solicitarRecuperacion() {
  return simularPeticion(() => true, { retraso: 900 });
}
