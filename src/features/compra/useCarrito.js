// DUEÑO: Gabriel. Hook para leer el carrito global desde cualquier componente.
// Los nombres de lo que devuelve son el contrato con Eddie (contador del
// encabezado): no cambiarlos.
//
//   items                        arreglo de items
//   totalItems                   suma de cantidades (para el ícono del encabezado)
//   subtotal, cargoServicio, total   valores derivados en dólares
//   agregar(item)                agrega o suma cantidad si la zona ya estaba
//   cambiarCantidad(clave, n)    fija la cantidad de una línea (1 a 10)
//   quitar(clave)                elimina una línea
//   vaciar()                     deja el carrito vacío (después de pagar)
import { useContext } from 'react';
import { CarritoContext } from './CarritoContext.jsx';

export function useCarrito() {
  const carrito = useContext(CarritoContext);
  if (!carrito) throw new Error('useCarrito() debe usarse dentro de <CarritoProveedor>.');
  return carrito;
}
