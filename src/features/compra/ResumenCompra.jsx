// DUEÑO: Gabriel. Caja con subtotal, cargo por servicio y total.
// Props:
//   subtotal, cargoServicio, total
//   titulo:   encabezado de la caja (por defecto "Resumen")
//   children: botones o texto al final de la caja
import { formatearPrecio } from '../../utils/formato.js';
import { CARGO_SERVICIO } from '../../data/categorias.js';
import './ResumenCompra.css';

export default function ResumenCompra({ subtotal, cargoServicio, total, titulo = 'Resumen', children }) {
  return (
    <aside className="resumen-compra" aria-labelledby="resumen-compra-titulo">
      <h2 id="resumen-compra-titulo" className="resumen-compra__titulo">
        {titulo}
      </h2>
      <dl className="resumen-compra__lineas">
        <div>
          <dt>Subtotal</dt>
          <dd>{formatearPrecio(subtotal)}</dd>
        </div>
        <div>
          <dt>Cargo por servicio ({CARGO_SERVICIO * 100} %)</dt>
          <dd>{formatearPrecio(cargoServicio)}</dd>
        </div>
        <div className="resumen-compra__total">
          <dt>Total</dt>
          <dd>{formatearPrecio(total)}</dd>
        </div>
      </dl>
      {children}
    </aside>
  );
}
