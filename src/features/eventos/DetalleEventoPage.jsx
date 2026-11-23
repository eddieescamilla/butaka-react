// DUEÑO: Eddie. Módulo 2: gestión de eventos. Detalle de un evento.
// Ruta: /eventos/:id  ·  el id se lee de la URL con useParams.
// Conexión con Gabriel: "Comprar boletos" navega a /eventos/:id/boletos.
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { usePeticion } from '../../hooks/usePeticion.js';
import { obtenerEvento } from '../../api/eventos.js';
import { CATEGORIAS, ESTADOS_EVENTO } from '../../data/categorias.js';
import { formatearFecha, formatearPrecio, rutaPublica } from '../../utils/formato.js';
import { precioDesde, sePuedeComprar } from '../../utils/eventos.js';
import Boton from '../../components/Boton.jsx';
import Etiqueta from '../../components/Etiqueta.jsx';
import EnlaceVista from '../../components/EnlaceVista.jsx';
import EstadoCarga from '../../components/EstadoCarga.jsx';
import EstadoError from '../../components/EstadoError.jsx';
import ZonasEvento from './ZonasEvento.jsx';
import './DetalleEventoPage.css';

const MOTIVOS_SIN_VENTA = {
  agotado: 'Este evento está agotado. Ya no quedan boletos en ninguna zona.',
  cancelado: 'Este evento fue cancelado. Si compraste boletos, recibirás el reembolso.',
  finalizado: 'Este evento ya se realizó.',
};

export default function DetalleEventoPage() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { estado, datos: evento, error, reintentar } = usePeticion((signal) => obtenerEvento(id, { signal }), [id]);

  // El título de la pestaña muestra el nombre del evento
  useEffect(() => {
    if (!evento) return;
    const anterior = document.title;
    document.title = `${evento.titulo} · Butaka`;
    return () => {
      document.title = anterior;
    };
  }, [evento]);

  const volver = (
    <EnlaceVista a="/eventos" className="detalle__volver">
      ← Volver a eventos
    </EnlaceVista>
  );

  if (estado === 'cargando') {
    return (
      <div className="contenedor detalle">
        {volver}
        <h1 className="sr-only">Detalle del evento</h1>
        <EstadoCarga mensaje="Cargando el evento…" />
      </div>
    );
  }

  if (estado === 'error') {
    return (
      <div className="contenedor detalle">
        {volver}
        <h1 className="sr-only">Detalle del evento</h1>
        <EstadoError titulo="No pudimos mostrar este evento" mensaje={error} onReintentar={reintentar} />
      </div>
    );
  }

  const categoria = CATEGORIAS.find((item) => item.id === evento.categoria);
  const disponible = sePuedeComprar(evento);

  return (
    <div className="contenedor detalle">
      {volver}

      <article className="detalle__contenido">
        <div className="detalle__principal">
          <img
            className="detalle__imagen"
            src={rutaPublica(evento.imagen)}
            alt={evento.imagenAlt}
            width="800"
            height="450"
          />
          <div className="detalle__etiquetas">
            <Etiqueta variante={evento.categoria}>{categoria?.nombre}</Etiqueta>
            <Etiqueta variante={evento.estado}>{ESTADOS_EVENTO[evento.estado]}</Etiqueta>
          </div>
          <h1 className="detalle__titulo">{evento.titulo}</h1>

          <dl className="detalle__datos">
            <div>
              <dt>Fecha</dt>
              <dd>
                <time dateTime={evento.fecha}>{formatearFecha(evento.fecha)}</time>
              </dd>
            </div>
            <div>
              <dt>Lugar</dt>
              <dd>
                {evento.lugar}, {evento.ciudad}
              </dd>
            </div>
          </dl>

          <section aria-labelledby="detalle-descripcion">
            <h2 id="detalle-descripcion" className="detalle__subtitulo">
              Acerca del evento
            </h2>
            <p className="detalle__descripcion">{evento.descripcion}</p>
          </section>
        </div>

        <aside className="detalle__compra" aria-labelledby="detalle-zonas">
          <h2 id="detalle-zonas" className="detalle__subtitulo">
            Zonas y precios
          </h2>
          <ZonasEvento zonas={evento.zonas} />
          <p className="detalle__desde">
            Desde <strong>{formatearPrecio(precioDesde(evento))}</strong>
          </p>
          <Boton
            bloque
            disabled={!disponible}
            aria-describedby={disponible ? undefined : 'detalle-motivo'}
            onClick={() => navegar(`/eventos/${evento.id}/boletos`)}
          >
            Comprar boletos
          </Boton>
          {!disponible && (
            <p id="detalle-motivo" className="detalle__motivo">
              {MOTIVOS_SIN_VENTA[evento.estado]}
            </p>
          )}
        </aside>
      </article>
    </div>
  );
}
