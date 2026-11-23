// DUEÑO: Eddie. Lista que viene de la API falsa y que el panel modifica.
// Usa useReducer para que cada cambio sea una acción explícita:
//   cargando → cargada | error, y después guardado / eliminado (sin volver a pedir todo).
// La carga se cancela con AbortController si la pantalla se cierra antes de terminar.
//
// Uso: const { estado, lista, error, reintentar, guardarEnLista, quitarDeLista } =
//        useListaRemota((signal) => listarEventos({}, { signal }));
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

const INICIAL = { estado: 'cargando', lista: [], error: null };

function reductorLista(actual, accion) {
  switch (accion.tipo) {
    case 'lista/cargando':
      return { ...actual, estado: 'cargando', error: null };
    case 'lista/cargada':
      return { estado: 'exito', lista: accion.lista, error: null };
    case 'lista/error':
      return { ...actual, estado: 'error', error: accion.error };
    case 'lista/guardado': {
      // Crear o actualizar: si el id ya existe se reemplaza, si no se agrega al inicio
      const existe = actual.lista.some((item) => item.id === accion.item.id);
      const lista = existe
        ? actual.lista.map((item) => (item.id === accion.item.id ? accion.item : item))
        : [accion.item, ...actual.lista];
      return { ...actual, lista };
    }
    case 'lista/eliminado':
      return { ...actual, lista: actual.lista.filter((item) => item.id !== accion.id) };
    default:
      throw new Error(`Acción desconocida: ${accion.tipo}`);
  }
}

export function useListaRemota(cargar) {
  const [estado, despachar] = useReducer(reductorLista, INICIAL);
  const [intento, setIntento] = useState(0);
  // La función de carga se guarda en una referencia: no debe reiniciar el efecto en cada render
  const funcionCarga = useRef(cargar);
  funcionCarga.current = cargar;

  useEffect(() => {
    const controlador = new AbortController();
    despachar({ tipo: 'lista/cargando' });
    funcionCarga
      .current(controlador.signal)
      .then((lista) => despachar({ tipo: 'lista/cargada', lista }))
      .catch((error) => {
        if (error.name !== 'AbortError') despachar({ tipo: 'lista/error', error: error.message });
      });
    return () => controlador.abort();
  }, [intento]);

  const reintentar = useCallback(() => setIntento((n) => n + 1), []);
  const guardarEnLista = useCallback((item) => despachar({ tipo: 'lista/guardado', item }), []);
  const quitarDeLista = useCallback((id) => despachar({ tipo: 'lista/eliminado', id }), []);

  return { ...estado, cargando: estado.estado === 'cargando', reintentar, guardarEnLista, quitarDeLista };
}
