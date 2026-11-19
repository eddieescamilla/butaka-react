// DUEÑO: Eddie. Módulo 3: inventario y precios (vista del cliente).
// Lista las zonas de un evento con su precio y disponibilidad.
// Props:
//   zonas: arreglo de zonas del evento
import Etiqueta from '../../components/Etiqueta.jsx';
import { ESTADOS_EVENTO } from '../../data/categorias.js';
import { disponiblesZona, estadoZona } from '../../utils/eventos.js';
import { formatearNumero, formatearPrecio } from '../../utils/formato.js';
import './ZonasEvento.css';

export default function ZonasEvento({ zonas }) {
  return (
    <ul className="zonas-evento">
      {zonas.map((zona) => {
        const disponibles = disponiblesZona(zona);
        const estado = estadoZona(zona);
        const porcentajeVendido = Math.round((zona.vendidos / zona.capacidad) * 100);

        return (
          <li key={zona.id} className="zonas-evento__zona">
            <div className="zonas-evento__fila">
              <span className="zonas-evento__nombre">{zona.nombre}</span>
              <span className="zonas-evento__precio">{formatearPrecio(zona.precio)}</span>
            </div>
            <div
              className="zonas-evento__barra"
              role="meter"
              aria-label={`Ocupación de la zona ${zona.nombre}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={porcentajeVendido}
              aria-valuetext={`${porcentajeVendido} % vendido`}
            >
              <span className={`zonas-evento__relleno zonas-evento__relleno--${estado}`} style={{ width: `${porcentajeVendido}%` }} />
            </div>
            <div className="zonas-evento__fila">
              <span className="zonas-evento__disponibles">
                {disponibles === 0 ? 'Sin boletos disponibles' : `${formatearNumero(disponibles)} disponibles`}
              </span>
              <Etiqueta variante={estado}>{ESTADOS_EVENTO[estado]}</Etiqueta>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
