// DUEÑO: Gabriel. Módulo 4: proceso de compra. Elegir la zona (radio buttons
// con forma de tarjeta). Las zonas agotadas aparecen deshabilitadas.
// Props:
//   zonas:     zonas del evento
//   valor:     id de la zona elegida
//   onCambiar: función que recibe el id
import { disponiblesZona } from '../../utils/eventos.js';
import { formatearNumero, formatearPrecio } from '../../utils/formato.js';
import './SelectorZona.css';

export default function SelectorZona({ zonas, valor, onCambiar }) {
  return (
    <fieldset className="selector-zona">
      <legend className="selector-zona__leyenda">1. Elige tu zona</legend>
      <div className="selector-zona__opciones">
        {zonas.map((zona) => {
          const disponibles = disponiblesZona(zona);
          const agotada = disponibles === 0;
          return (
            <label
              key={zona.id}
              className={`selector-zona__opcion${agotada ? ' selector-zona__opcion--agotada' : ''}`}
              htmlFor={`zona-${zona.id}`}
            >
              <input
                id={`zona-${zona.id}`}
                type="radio"
                name="zona"
                value={zona.id}
                checked={valor === zona.id}
                disabled={agotada}
                onChange={() => onCambiar(zona.id)}
                className="selector-zona__radio"
              />
              <span className="selector-zona__nombre">{zona.nombre}</span>
              <span className="selector-zona__precio">{formatearPrecio(zona.precio)}</span>
              <span className="selector-zona__disponibles">
                {agotada ? 'Agotada' : `${formatearNumero(disponibles)} disponibles`}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
