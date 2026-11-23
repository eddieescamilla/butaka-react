// DUEÑO: Eddie. Usuarios del panel de administración (módulo 7).
// Lee y escribe en la API falsa (src/api/usuarios.js); el login usa la misma
// colección, así que un usuario creado o desactivado aquí afecta su acceso.
import { useCallback } from 'react';
import * as api from '../../api/usuarios.js';
import { useListaRemota } from './useListaRemota.js';

export function useUsuariosAdmin() {
  const { lista: usuarios, estado, cargando, error, reintentar, guardarEnLista } = useListaRemota((signal) =>
    api.listarUsuarios({ signal }),
  );

  const crearUsuario = useCallback(
    async (datos) => {
      const nuevo = await api.crearUsuario(datos);
      guardarEnLista(nuevo);
      return nuevo;
    },
    [guardarEnLista],
  );

  const actualizarUsuario = useCallback(async (id, cambios) => guardarEnLista(await api.actualizarUsuario(id, cambios)), [guardarEnLista]);

  // Activa o desactiva una cuenta (no se borran usuarios, se desactivan)
  const cambiarEstado = useCallback(async (id) => guardarEnLista(await api.cambiarEstadoUsuario(id)), [guardarEnLista]);

  return { usuarios, estado, cargando, error, reintentar, crearUsuario, actualizarUsuario, cambiarEstado };
}
