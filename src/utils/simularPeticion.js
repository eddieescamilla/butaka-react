// ARCHIVO COMPARTIDO (congelado). Ver CONTRIBUIR.md antes de cambiarlo.
// Simula una petición a un servidor: espera un tiempo y resuelve con los datos,
// o falla al azar para poder mostrar el estado de error con "Reintentar".
//
// Uso:
//   const datos = await simularPeticion(() => EVENTOS, { signal });
//
// Opciones:
//   retraso:           milisegundos de espera (por defecto 700)
//   probabilidadError: número entre 0 y 1 (por defecto 0, nunca falla)
//   signal:            AbortSignal para cancelar si el componente se desmonta

export function simularPeticion(obtenerDatos, opciones = {}) {
  const { retraso = 700, probabilidadError = 0, signal } = opciones;

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Petición cancelada', 'AbortError'));
      return;
    }

    const temporizador = setTimeout(() => {
      signal?.removeEventListener('abort', alCancelar);

      if (Math.random() < probabilidadError) {
        reject(new Error('No pudimos conectar con el servidor. Inténtalo de nuevo.'));
        return;
      }

      try {
        // Se devuelve una copia para que nadie modifique los datos originales
        resolve(structuredClone(obtenerDatos()));
      } catch (error) {
        reject(error);
      }
    }, retraso);

    function alCancelar() {
      clearTimeout(temporizador);
      reject(new DOMException('Petición cancelada', 'AbortError'));
    }

    signal?.addEventListener('abort', alCancelar, { once: true });
  });
}
