// ARCHIVO COMPARTIDO (congelado). Ver CONTRIBUIR.md antes de cambiarlo.
// Ejecuta una función asíncrona (de src/servicios/) y devuelve su estado.
//
// Uso:
//   const { estado, datos, error, reintentar } = usePeticion(
//     (signal) => obtenerEventos({ busqueda, categoria }, { signal }),
//     [busqueda, categoria],
//   );
//
// estado: 'cargando' | 'error' | 'exito'
// Cada vez que cambian las dependencias se cancela la petición anterior,
// así una respuesta vieja nunca sobrescribe a la nueva.

import { useCallback, useEffect, useState } from 'react';

export function usePeticion(funcion, dependencias = []) {
  const [resultado, setResultado] = useState({ estado: 'cargando', datos: null, error: null });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    setResultado((anterior) => ({ ...anterior, estado: 'cargando', error: null }));

    funcion(controlador.signal)
      .then((datos) => setResultado({ estado: 'exito', datos, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setResultado({ estado: 'error', datos: null, error: error.message });
      });

    return () => controlador.abort();
    // La función cambia en cada render; las dependencias reales las pasa quien llama
  }, [...dependencias, intento]);

  const reintentar = useCallback(() => setIntento((n) => n + 1), []);

  return { ...resultado, reintentar };
}
