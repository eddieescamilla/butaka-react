// DUEÑO: Gabriel. Una línea del carrito: evento, zona, cantidad y subtotal.
// Props:
//   item:            objeto del carrito
//   editable:        boolean. Si es false, solo muestra (pantalla de resumen)
//   onCambiarCantidad(clave, n), onQuitar(clave)
import { MAXIMO_BOLETOS_POR_ZONA } from '../../data/categorias.js';
import { formatearFecha, formatearPrecio } from '../../utils/formato.js';
import SelectorCantidad from './SelectorCantidad.jsx';
import './ItemCarrito.css';

export default function ItemCarrito({ item, editable = true, onCambiarCantidad, onQuitar }) {
  const etiqueta = `${item.eventoTitulo}, zona ${item.zonaNombre}`;

  return (
    <li className="item-carrito">
      <div className="item-carrito__info">
        <h3 className="item-carrito__titulo">{item.eventoTitulo}</h3>
        <p className="item-carrito__dato">
          {formatearFecha(item.fecha)} · {item.lugar}
        </p>
        <p className="item-carrito__dato">
          Zona <strong>{item.zonaNombre}</strong> · {formatearPrecio(item.precio)} c/u
        </p>
      </div>
      <div className="item-carrito__acciones">
        {editable ? (
          <SelectorCantidad
            id={`cantidad-${item.clave}`}
            etiqueta={`Cantidad de boletos: ${etiqueta}`}
            etiquetaOculta
            valor={item.cantidad}
            maximo={MAXIMO_BOLETOS_POR_ZONA}
            onCambiar={(n) => onCambiarCantidad(item.clave, n)}
          />
        ) : (
          <p className="item-carrito__dato">
            {item.cantidad} {item.cantidad === 1 ? 'boleto' : 'boletos'}
          </p>
        )}
        <p className="item-carrito__subtotal">{formatearPrecio(item.precio * item.cantidad)}</p>
        {editable && (
          <button type="button" className="item-carrito__quitar" onClick={() => onQuitar(item.clave)}>
            Quitar<span className="sr-only"> {etiqueta}</span>
          </button>
        )}
      </div>
    </li>
  );
}
