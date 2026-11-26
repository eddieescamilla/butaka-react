// DUEÑO: Gabriel. Módulo 1: sesión global con Context + useReducer.
// La sesión se guarda en localStorage ('butaka:sesion') y se comparte con
// todas las pantallas sin props: encabezado, rutas protegidas, panel y compra.
// Nunca se guarda la contraseña. La autenticación es simulada (src/api/usuarios.js).
import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';

const CLAVE = 'butaka:sesion';
const SIN_SESION = { usuario: null, inicio: null };

export const ACCIONES_SESION = {
  iniciar: 'sesion/iniciar',
  cerrar: 'sesion/cerrar',
  actualizar: 'sesion/actualizar',
  sincronizar: 'sesion/sincronizar', // cambio hecho en otra pestaña
};

export function reductorSesion(estado, accion) {
  switch (accion.tipo) {
    case ACCIONES_SESION.iniciar: {
      const { contrasena: _omitida, ...usuario } = accion.usuario;
      return { usuario, inicio: new Date().toISOString() };
    }
    case ACCIONES_SESION.cerrar:
      return SIN_SESION;
    case ACCIONES_SESION.actualizar:
      return estado.usuario ? { ...estado, usuario: { ...estado.usuario, ...accion.cambios } } : estado;
    case ACCIONES_SESION.sincronizar:
      return accion.estado ?? SIN_SESION;
    default:
      throw new Error(`Acción desconocida: ${accion.tipo}`);
  }
}

function leerGuardada() {
  try {
    const guardada = JSON.parse(localStorage.getItem(CLAVE));
    // Compatibilidad con la segunda entrega, que guardaba solo el usuario
    if (guardada && !('usuario' in guardada)) return { usuario: guardada, inicio: null };
    return guardada ?? SIN_SESION;
  } catch {
    return SIN_SESION;
  }
}

export const SesionContext = createContext(null);

export function SesionProveedor({ children }) {
  const [estado, despachar] = useReducer(reductorSesion, undefined, leerGuardada);

  // Persistencia
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch {
      // Almacenamiento bloqueado: la sesión dura mientras la pestaña esté abierta
    }
  }, [estado]);

  // Si se cierra sesión en otra pestaña, esta también se actualiza
  useEffect(() => {
    function alCambiarOtraPestana(evento) {
      if (evento.key === CLAVE) despachar({ tipo: ACCIONES_SESION.sincronizar, estado: leerGuardada() });
    }
    window.addEventListener('storage', alCambiarOtraPestana);
    return () => window.removeEventListener('storage', alCambiarOtraPestana);
  }, []);

  const iniciarSesion = useCallback((usuario) => despachar({ tipo: ACCIONES_SESION.iniciar, usuario }), []);
  const cerrarSesion = useCallback(() => despachar({ tipo: ACCIONES_SESION.cerrar }), []);
  const actualizarUsuario = useCallback((cambios) => despachar({ tipo: ACCIONES_SESION.actualizar, cambios }), []);

  // Valores derivados: se calculan, no se guardan aparte
  const valor = useMemo(
    () => ({
      usuario: estado.usuario,
      haySesion: estado.usuario !== null,
      esAdmin: estado.usuario?.rol === 'admin' || estado.usuario?.rol === 'organizador',
      iniciarSesion,
      cerrarSesion,
      actualizarUsuario,
    }),
    [estado.usuario, iniciarSesion, cerrarSesion, actualizarUsuario],
  );

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}
