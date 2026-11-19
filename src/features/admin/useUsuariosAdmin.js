// DUEÑO: Eddie. Estado de los usuarios en el panel de administración.
// Se guardan en localStorage ('butaka:admin-usuarios'). El login puede leer
// la misma clave con listaUsuarios() de src/servicios/usuarios.js.

import { useCallback } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { usePeticion } from '../../hooks/usePeticion.js';
import { simularPeticion } from '../../utils/simularPeticion.js';
import { CLAVE_USUARIOS_ADMIN } from '../../servicios/usuarios.js';
import { USUARIOS } from '../../data/usuarios.js';

function esperar() {
  return simularPeticion(() => null, { retraso: 700 });
}

export function useUsuariosAdmin() {
  const [usuarios, setUsuarios] = useLocalStorage(CLAVE_USUARIOS_ADMIN, USUARIOS);

  const carga = usePeticion((signal) => simularPeticion(() => true, { signal, retraso: 400 }), []);

  const crearUsuario = useCallback(
    async (datos) => {
      await esperar();
      const nuevo = {
        id: `usr-${Date.now()}`,
        estado: 'activo',
        creado: new Date().toISOString().slice(0, 10),
        ...datos,
      };
      setUsuarios((actuales) => [...actuales, nuevo]);
      return nuevo;
    },
    [setUsuarios],
  );

  const actualizarUsuario = useCallback(
    async (id, cambios) => {
      await esperar();
      setUsuarios((actuales) => actuales.map((usuario) => (usuario.id === id ? { ...usuario, ...cambios } : usuario)));
    },
    [setUsuarios],
  );

  // Activa o desactiva una cuenta (no se borran usuarios, se desactivan)
  const cambiarEstado = useCallback(
    async (id) => {
      await esperar();
      setUsuarios((actuales) =>
        actuales.map((usuario) =>
          usuario.id === id ? { ...usuario, estado: usuario.estado === 'activo' ? 'inactivo' : 'activo' } : usuario,
        ),
      );
    },
    [setUsuarios],
  );

  return { usuarios, cargando: carga.estado === 'cargando', crearUsuario, actualizarUsuario, cambiarEstado };
}
