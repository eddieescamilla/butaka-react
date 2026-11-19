// DUEÑO: Gabriel. Puede mejorar la implementación, pero NO debe cambiar
// los nombres de lo que devuelve: App.jsx y el encabezado de Eddie los usan.
//
// Cada item del carrito tiene esta forma:
//   { clave, eventoId, eventoTitulo, fecha, lugar, zonaId, zonaNombre, precio, cantidad }
//   clave = `${eventoId}:${zonaId}` (identifica la línea del carrito)
//
// Contrato (lo que devuelve el hook):
//   items                        arreglo de items
//   totalItems                   suma de cantidades (para el ícono del encabezado)
//   subtotal, cargoServicio, total   valores derivados en dólares
//   agregar(item)                agrega o suma cantidad si la zona ya estaba
//   cambiarCantidad(clave, n)    fija la cantidad de una línea (1 a 10)
//   quitar(clave)                elimina una línea
//   vaciar()                     deja el carrito vacío (después de pagar)

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { CARGO_SERVICIO, MAXIMO_BOLETOS_POR_ZONA } from '../../data/categorias.js';

function limitar(cantidad) {
  return Math.min(Math.max(cantidad, 1), MAXIMO_BOLETOS_POR_ZONA);
}

export function useCarrito() {
  const [items, setItems] = useLocalStorage('butaka:carrito', []);

  const agregar = useCallback(
    (nuevo) => {
      const clave = `${nuevo.eventoId}:${nuevo.zonaId}`;
      setItems((actuales) => {
        const existe = actuales.some((item) => item.clave === clave);
        if (!existe) return [...actuales, { ...nuevo, clave, cantidad: limitar(nuevo.cantidad) }];
        return actuales.map((item) =>
          item.clave === clave ? { ...item, cantidad: limitar(item.cantidad + nuevo.cantidad) } : item,
        );
      });
    },
    [setItems],
  );

  const cambiarCantidad = useCallback(
    (clave, cantidad) =>
      setItems((actuales) =>
        actuales.map((item) => (item.clave === clave ? { ...item, cantidad: limitar(cantidad) } : item)),
      ),
    [setItems],
  );

  const quitar = useCallback(
    (clave) => setItems((actuales) => actuales.filter((item) => item.clave !== clave)),
    [setItems],
  );

  const vaciar = useCallback(() => setItems([]), [setItems]);

  return useMemo(() => {
    // Valores derivados: se calculan a partir de items, no se guardan aparte
    const totalItems = items.reduce((suma, item) => suma + item.cantidad, 0);
    const subtotal = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    const cargoServicio = Math.round(subtotal * CARGO_SERVICIO * 100) / 100;
    return {
      items,
      totalItems,
      subtotal,
      cargoServicio,
      total: subtotal + cargoServicio,
      agregar,
      cambiarCantidad,
      quitar,
      vaciar,
    };
  }, [items, agregar, cambiarCantidad, quitar, vaciar]);
}
