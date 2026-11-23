// DUEÑO: Eddie (archivo compartido: lo usan todos los módulos a través de src/api/).
// Cliente de la API falsa de Butaka. No hay backend:
//   - Lectura: fetch a los archivos JSON de public/api/ (eventos, usuarios, ordenes).
//     El service worker guarda esas respuestas con la estrategia NetworkFirst,
//     así que lo que ya se visitó sigue disponible sin conexión.
//   - Escritura: la colección modificada se guarda completa en localStorage
//     ('butaka:api:<coleccion>'). Desde ese momento se lee de ahí.
//
// Todas las funciones son asíncronas, simulan la latencia de un servidor y
// aceptan un AbortSignal para cancelar la petición (usePeticion lo hace solo).

const URL_BASE = `${import.meta.env.BASE_URL}api/`;
const PREFIJO = 'butaka:api:';

// Latencia simulada en milisegundos (las escrituras tardan un poco más)
export const LATENCIA = { lectura: 450, escritura: 700 };

// Error de la API con un mensaje que se puede mostrar al usuario
export class ErrorApi extends Error {
  constructor(mensaje, estado = 0) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.estado = estado;
  }
}

function errorCancelado() {
  return new DOMException('Petición cancelada', 'AbortError');
}

// Espera ms milisegundos; si la señal se cancela antes, la promesa falla con AbortError
export function esperar(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(errorCancelado());
      return;
    }
    const temporizador = setTimeout(() => {
      signal?.removeEventListener('abort', alCancelar);
      resolve();
    }, ms);
    function alCancelar() {
      clearTimeout(temporizador);
      reject(errorCancelado());
    }
    signal?.addEventListener('abort', alCancelar, { once: true });
  });
}

// GET /api/<recurso>.json
async function pedirJSON(recurso, signal) {
  let respuesta;
  try {
    respuesta = await fetch(`${URL_BASE}${recurso}.json`, { signal, headers: { Accept: 'application/json' } });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ErrorApi(
      navigator.onLine
        ? 'No pudimos conectar con el servidor. Inténtalo de nuevo.'
        : 'Estás sin conexión y estos datos todavía no se guardaron en este dispositivo. Conéctate e inténtalo de nuevo.',
    );
  }
  if (!respuesta.ok) {
    throw new ErrorApi(`El servidor respondió con un error (${respuesta.status}). Inténtalo de nuevo.`, respuesta.status);
  }
  return respuesta.json();
}

function leerLocal(coleccion) {
  try {
    const guardado = localStorage.getItem(PREFIJO + coleccion);
    return guardado ? JSON.parse(guardado) : null;
  } catch {
    return null; // valor dañado: se vuelve a pedir la semilla
  }
}

function guardarLocal(coleccion, datos) {
  try {
    localStorage.setItem(PREFIJO + coleccion, JSON.stringify(datos));
  } catch {
    throw new ErrorApi('No pudimos guardar los cambios en este navegador (almacenamiento lleno o bloqueado).');
  }
}

// Lee una colección completa: primero los cambios guardados, si no la semilla JSON
export async function leerColeccion(coleccion, { signal } = {}) {
  await esperar(LATENCIA.lectura, signal);
  const local = leerLocal(coleccion);
  if (local) return structuredClone(local);
  return pedirJSON(coleccion, signal);
}

// Modifica una colección. cambiar(lista) devuelve { lista, resultado }:
// la lista nueva se guarda y el resultado se devuelve a quien llamó.
export async function escribirColeccion(coleccion, cambiar, { signal } = {}) {
  const actual = await leerColeccion(coleccion, { signal });
  await esperar(LATENCIA.escritura - LATENCIA.lectura, signal);
  const { lista, resultado } = cambiar(actual);
  guardarLocal(coleccion, lista);
  return structuredClone(resultado);
}

// Borra los cambios guardados y vuelve a los datos de demostración
export function restablecerDatos() {
  Object.keys(localStorage)
    .filter((clave) => clave.startsWith(PREFIJO))
    .forEach((clave) => localStorage.removeItem(clave));
}

// Identificador único para registros nuevos ("evt-lq3k9x2a")
export function nuevoId(prefijo) {
  return `${prefijo}-${Date.now().toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`;
}
