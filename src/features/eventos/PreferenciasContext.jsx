// DUEÑO: Eddie. Estado global de preferencias con Context + useReducer.
// Guarda el último filtro de categoría y el orden del listado de eventos,
// y los recuerda entre visitas (localStorage 'butaka:preferencias').
//
// Uso en cualquier componente (sin props):
//   const { preferencias, cambiarPreferencia, restablecerPreferencias } = usePreferencias();
//   cambiarPreferencia('categoria', 'teatro');
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';

const CLAVE = 'butaka:preferencias';

const INICIALES = {
  categoria: '', // '' = todas las categorías
  orden: 'fecha', // 'fecha' | 'precio'
};

// Acciones posibles. Cualquier otra es un error de programación.
export const ACCIONES = {
  cambiarCategoria: 'preferencias/cambiarCategoria',
  cambiarOrden: 'preferencias/cambiarOrden',
  restablecer: 'preferencias/restablecer',
};

export function reductorPreferencias(estado, accion) {
  switch (accion.tipo) {
    case ACCIONES.cambiarCategoria:
      return { ...estado, categoria: accion.valor };
    case ACCIONES.cambiarOrden:
      return accion.valor === 'precio' || accion.valor === 'fecha' ? { ...estado, orden: accion.valor } : estado;
    case ACCIONES.restablecer:
      return INICIALES;
    default:
      throw new Error(`Acción desconocida: ${accion.tipo}`);
  }
}

// Inicialización perezosa: localStorage se lee una sola vez
function leerGuardadas() {
  try {
    return { ...INICIALES, ...JSON.parse(localStorage.getItem(CLAVE)) };
  } catch {
    return INICIALES;
  }
}

const PreferenciasContext = createContext(null);

export function PreferenciasProveedor({ children }) {
  const [preferencias, despachar] = useReducer(reductorPreferencias, undefined, leerGuardadas);

  // Persistencia: cada cambio se guarda
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(preferencias));
    } catch {
      // Almacenamiento bloqueado: la app sigue funcionando sin guardar
    }
  }, [preferencias]);

  const cambiarPreferencia = useCallback((nombre, valor) => {
    const tipo = nombre === 'categoria' ? ACCIONES.cambiarCategoria : ACCIONES.cambiarOrden;
    despachar({ tipo, valor });
  }, []);

  const restablecerPreferencias = useCallback(() => despachar({ tipo: ACCIONES.restablecer }), []);

  const valor = useMemo(
    () => ({ preferencias, cambiarPreferencia, restablecerPreferencias }),
    [preferencias, cambiarPreferencia, restablecerPreferencias],
  );

  return <PreferenciasContext.Provider value={valor}>{children}</PreferenciasContext.Provider>;
}

export function usePreferencias() {
  const valor = useContext(PreferenciasContext);
  if (!valor) throw new Error('usePreferencias() debe usarse dentro de <PreferenciasProveedor>.');
  return valor;
}
