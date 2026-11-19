// DUEÑO: Gabriel. Puede mejorar la implementación, pero NO debe cambiar
// los nombres de lo que devuelve: App.jsx y el panel de Eddie los usan.
//
// Contrato (lo que devuelve el hook):
//   usuario            objeto del usuario sin contraseña, o null si no hay sesión
//   haySesion          boolean
//   esAdmin            boolean: rol 'admin' u 'organizador' (pueden entrar al panel)
//   iniciarSesion(u)   guarda la sesión con el usuario recibido
//   cerrarSesion()     borra la sesión
//   actualizarUsuario(cambios)  actualiza datos del perfil (nombre, apellido, etc.)

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';

export function useSesion() {
  const [usuario, setUsuario] = useLocalStorage('butaka:sesion', null);

  const iniciarSesion = useCallback(
    (datosUsuario) => {
      // Nunca se guarda la contraseña en la sesión
      const { contrasena: _omitida, ...sinContrasena } = datosUsuario;
      setUsuario(sinContrasena);
    },
    [setUsuario],
  );

  const cerrarSesion = useCallback(() => setUsuario(null), [setUsuario]);

  const actualizarUsuario = useCallback(
    (cambios) => setUsuario((actual) => (actual ? { ...actual, ...cambios } : actual)),
    [setUsuario],
  );

  return useMemo(
    () => ({
      usuario,
      haySesion: usuario !== null,
      esAdmin: usuario?.rol === 'admin' || usuario?.rol === 'organizador',
      iniciarSesion,
      cerrarSesion,
      actualizarUsuario,
    }),
    [usuario, iniciarSesion, cerrarSesion, actualizarUsuario],
  );
}
