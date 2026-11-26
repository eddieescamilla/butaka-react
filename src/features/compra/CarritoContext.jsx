// DUEÑO: Gabriel. Módulo 4: carrito global con Context + useReducer.
// Se guarda en localStorage ('butaka:carrito'), así que sobrevive a recargas
// y funciona sin conexión. Lo usan el encabezado (contador) y todo el checkout.
//
// Cada item: { clave, eventoId, eventoTitulo, fecha, lugar, zonaId, zonaNombre, precio, cantidad }
//   clave = `${eventoId}:${zonaId}` (identifica la línea del carrito)
import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import { CARGO_SERVICIO, MAXIMO_BOLETOS_POR_ZONA } from '../../data/categorias.js';

const CLAVE = 'butaka:carrito';

export const ACCIONES_CARRITO = {
  agregar: 'carrito/agregar',
  cambiarCantidad: 'carrito/cambiarCantidad',
  quitar: 'carrito/quitar',
  vaciar: 'carrito/vaciar',
  sincronizar: 'carrito/sincronizar', // cambio hecho en otra pestaña
};

function limitar(cantidad) {
  return Math.min(Math.max(Math.trunc(cantidad) || 1, 1), MAXIMO_BOLETOS_POR_ZONA);
}

export function reductorCarrito(items, accion) {
  switch (accion.tipo) {
    case ACCIONES_CARRITO.agregar: {
      const nuevo = accion.item;
      const clave = `${nuevo.eventoId}:${nuevo.zonaId}`;
      if (!items.some((item) => item.clave === clave)) return [...items, { ...nuevo, clave, cantidad: limitar(nuevo.cantidad) }];
      return items.map((item) => (item.clave === clave ? { ...item, cantidad: limitar(item.cantidad + nuevo.cantidad) } : item));
    }
    case ACCIONES_CARRITO.cambiarCantidad:
      return items.map((item) => (item.clave === accion.clave ? { ...item, cantidad: limitar(accion.cantidad) } : item));
    case ACCIONES_CARRITO.quitar:
      return items.filter((item) => item.clave !== accion.clave);
    case ACCIONES_CARRITO.vaciar:
      return [];
    case ACCIONES_CARRITO.sincronizar:
      return accion.items;
    default:
      throw new Error(`Acción desconocida: ${accion.tipo}`);
  }
}

function leerGuardado() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE));
    return Array.isArray(guardado) ? guardado : [];
  } catch {
    return [];
  }
}

export const CarritoContext = createContext(null);

export function CarritoProveedor({ children }) {
  const [items, despachar] = useReducer(reductorCarrito, undefined, leerGuardado);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(items));
    } catch {
      // Almacenamiento bloqueado: el carrito dura mientras la pestaña esté abierta
    }
  }, [items]);

  useEffect(() => {
    function alCambiarOtraPestana(evento) {
      if (evento.key === CLAVE) despachar({ tipo: ACCIONES_CARRITO.sincronizar, items: leerGuardado() });
    }
    window.addEventListener('storage', alCambiarOtraPestana);
    return () => window.removeEventListener('storage', alCambiarOtraPestana);
  }, []);

  const agregar = useCallback((item) => despachar({ tipo: ACCIONES_CARRITO.agregar, item }), []);
  const cambiarCantidad = useCallback((clave, cantidad) => despachar({ tipo: ACCIONES_CARRITO.cambiarCantidad, clave, cantidad }), []);
  const quitar = useCallback((clave) => despachar({ tipo: ACCIONES_CARRITO.quitar, clave }), []);
  const vaciar = useCallback(() => despachar({ tipo: ACCIONES_CARRITO.vaciar }), []);

  const valor = useMemo(() => {
    // Valores derivados: se calculan a partir de items, no se guardan aparte
    const totalItems = items.reduce((suma, item) => suma + item.cantidad, 0);
    const subtotal = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    const cargoServicio = Math.round(subtotal * CARGO_SERVICIO * 100) / 100;
    return { items, totalItems, subtotal, cargoServicio, total: subtotal + cargoServicio, agregar, cambiarCantidad, quitar, vaciar };
  }, [items, agregar, cambiarCantidad, quitar, vaciar]);

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}
