// DUEÑO: Eddie. Listado de eventos con filtros, orden y los tres estados
// (carga, error y vacío). Lo usan Inicio y Resultados de búsqueda.
// Props:
//   busqueda:     texto a buscar ('' = todos)
//   tituloId:     id del <h2> que da nombre a la sección
//   titulo:       texto del <h2>
// Los datos vienen de la API falsa (listarEventos) con usePeticion: si cambia
// la búsqueda o la categoría, la petición anterior se cancela con AbortController.
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { usePeticion } from '../../hooks/usePeticion.js';
import { listarEventos } from '../../api/eventos.js';
import { precioDesde } from '../../utils/eventos.js';
import CampoTexto from '../../components/CampoTexto.jsx';
import Boton from '../../components/Boton.jsx';
import EstadoCarga from '../../components/EstadoCarga.jsx';
import EstadoError from '../../components/EstadoError.jsx';
import EstadoVacio from '../../components/EstadoVacio.jsx';
import FiltroCategorias from './FiltroCategorias.jsx';
import TarjetaEvento from './TarjetaEvento.jsx';
import { usePreferencias } from './PreferenciasContext.jsx';
import './CatalogoEventos.css';

const ORDENES = [
  { valor: 'fecha', texto: 'Fecha más próxima' },
  { valor: 'precio', texto: 'Precio más bajo' },
];

function ordenar(eventos, orden) {
  const copia = [...eventos];
  if (orden === 'precio') return copia.sort((a, b) => precioDesde(a) - precioDesde(b));
  return copia.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
}

export default function CatalogoEventos({ busqueda = '', tituloId, titulo }) {
  const navegar = useNavigate();
  // Categoría y orden: estado global (PreferenciasContext), se recuerdan entre visitas
  const { preferencias, cambiarPreferencia } = usePreferencias();
  const { categoria, orden } = preferencias;

  const { estado, datos, error, reintentar } = usePeticion(
    (signal) => listarEventos({ busqueda, categoria }, { signal }),
    [busqueda, categoria],
  );

  // Valor derivado: los eventos finalizados no se muestran al cliente
  const eventos = useMemo(
    () => ordenar((datos ?? []).filter((evento) => evento.estado !== 'finalizado'), orden),
    [datos, orden],
  );

  return (
    <section className="catalogo" aria-labelledby={tituloId}>
      <div className="catalogo__barra">
        <h2 id={tituloId} className="catalogo__titulo">
          {titulo}
        </h2>
        <CampoTexto
          id="orden-eventos"
          etiqueta="Ordenar por"
          opciones={ORDENES}
          value={orden}
          onChange={(evento) => cambiarPreferencia('orden', evento.target.value)}
          className="catalogo__orden"
        />
      </div>

      <FiltroCategorias valor={categoria} onCambiar={(id) => cambiarPreferencia('categoria', id)} />

      {estado === 'cargando' && <EstadoCarga mensaje="Buscando eventos…" />}

      {estado === 'error' && <EstadoError mensaje={error} onReintentar={reintentar} />}

      {estado === 'exito' && eventos.length === 0 && (
        <EstadoVacio
          titulo="No encontramos eventos"
          mensaje={
            busqueda
              ? `No hay eventos que coincidan con “${busqueda}”${categoria ? ' en esta categoría' : ''}. Revisa cómo lo escribiste o prueba con otra palabra.`
              : 'Por ahora no hay eventos en esta categoría. Prueba con otra.'
          }
        >
          <Boton
            variante="secundario"
            onClick={() => {
              cambiarPreferencia('categoria', '');
              if (busqueda) navegar('/eventos');
            }}
          >
            Ver todos los eventos
          </Boton>
        </EstadoVacio>
      )}

      {estado === 'exito' && eventos.length > 0 && (
        <>
          <p className="catalogo__conteo" aria-live="polite">
            {eventos.length === 1 ? '1 evento' : `${eventos.length} eventos`}
          </p>
          <ul className="catalogo__lista">
            {eventos.map((evento) => (
              <li key={evento.id}>
                <TarjetaEvento evento={evento} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
