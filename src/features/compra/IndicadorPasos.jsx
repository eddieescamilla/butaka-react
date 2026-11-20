// DUEÑO: Gabriel. Indicador de los 4 pasos del flujo de compra.
// Props:
//   actual: número del paso actual (1 a 4)
import './IndicadorPasos.css';

const PASOS = ['Boletos', 'Carrito', 'Pago', 'Confirmación'];

export default function IndicadorPasos({ actual }) {
  return (
    <nav className="indicador-pasos" aria-label="Progreso de la compra">
      <ol>
        {PASOS.map((paso, indice) => {
          const numero = indice + 1;
          const estado = numero < actual ? 'hecho' : numero === actual ? 'actual' : 'pendiente';
          return (
            <li
              key={paso}
              className={`indicador-pasos__paso indicador-pasos__paso--${estado}`}
              aria-current={estado === 'actual' ? 'step' : undefined}
            >
              <span className="indicador-pasos__numero" aria-hidden="true">
                {estado === 'hecho' ? '✓' : numero}
              </span>
              <span className="indicador-pasos__texto">
                {paso}
                {estado === 'hecho' && <span className="sr-only"> (completado)</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
