// DUEÑO: Eddie. Tarjeta de un evento en el listado (componente del Design System).
// Props:
//   evento: evento de la API falsa (src/api/eventos.js)
// Toda la tarjeta es clicable, pero el enlace real es el título
// (así el lector de pantalla anuncia un solo enlace por tarjeta).
import Etiqueta from '../../components/Etiqueta.jsx';
import EnlaceVista from '../../components/EnlaceVista.jsx';
import { CATEGORIAS, ESTADOS_EVENTO } from '../../data/categorias.js';
import { formatearFecha, formatearPrecio, rutaPublica } from '../../utils/formato.js';
import { precioDesde } from '../../utils/eventos.js';
import './TarjetaEvento.css';

export default function TarjetaEvento({ evento }) {
  const categoria = CATEGORIAS.find((item) => item.id === evento.categoria);
  const sinVenta = evento.estado === 'agotado' || evento.estado === 'cancelado';

  return (
    <article className={`tarjeta-evento${sinVenta ? ' tarjeta-evento--sin-venta' : ''}`}>
      <div className="tarjeta-evento__media">
        <img
          className="tarjeta-evento__imagen"
          src={rutaPublica(evento.imagen)}
          alt={evento.imagenAlt}
          loading="lazy"
          width="400"
          height="225"
        />
        {evento.estado !== 'en-venta' && (
          <span className="tarjeta-evento__estado">
            <Etiqueta variante={evento.estado}>{ESTADOS_EVENTO[evento.estado]}</Etiqueta>
          </span>
        )}
      </div>
      <div className="tarjeta-evento__cuerpo">
        <Etiqueta variante={evento.categoria}>{categoria?.nombre}</Etiqueta>
        <h3 className="tarjeta-evento__titulo">
          <EnlaceVista a={`/eventos/${evento.id}`} className="tarjeta-evento__enlace">
            {evento.titulo}
          </EnlaceVista>
        </h3>
        <p className="tarjeta-evento__dato">
          <time dateTime={evento.fecha}>{formatearFecha(evento.fecha)}</time>
        </p>
        <p className="tarjeta-evento__dato">{evento.lugar}</p>
        <p className="tarjeta-evento__precio">Desde {formatearPrecio(precioDesde(evento))}</p>
      </div>
    </article>
  );
}
