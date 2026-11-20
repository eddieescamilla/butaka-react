// DUEÑO: Gabriel. Módulo 4: proceso de compra. Paso 1: zona y cantidad.
// Props: { params, irA, carrito }  ·  params.eventoId llega desde el detalle (Eddie)
import { useState } from 'react';
import { usePeticion } from '../../hooks/usePeticion.js';
import { obtenerEventoPorId } from '../../servicios/eventos.js';
import { MAXIMO_BOLETOS_POR_ZONA } from '../../data/categorias.js';
import { disponiblesZona, sePuedeComprar } from '../../utils/eventos.js';
import { formatearFecha, formatearPrecio, rutaPublica } from '../../utils/formato.js';
import Boton from '../../components/Boton.jsx';
import EnlaceVista from '../../components/EnlaceVista.jsx';
import EstadoCarga from '../../components/EstadoCarga.jsx';
import EstadoError from '../../components/EstadoError.jsx';
import IndicadorPasos from './IndicadorPasos.jsx';
import SelectorZona from './SelectorZona.jsx';
import SelectorCantidad from './SelectorCantidad.jsx';
import './Compra.css';

export default function SeleccionPage({ params, irA, carrito }) {
  const { estado, datos: evento, error, reintentar } = usePeticion(
    (signal) => obtenerEventoPorId(params.eventoId, { signal }),
    [params.eventoId],
  );
  const [zonaId, setZonaId] = useState('');
  const [cantidad, setCantidad] = useState(1);

  const encabezado = (
    <>
      <EnlaceVista vista="detalle-evento" params={{ eventoId: params.eventoId }} irA={irA} className="compra__volver">
        ← Volver al evento
      </EnlaceVista>
      <IndicadorPasos actual={1} />
    </>
  );

  if (estado === 'cargando') {
    return (
      <div className="contenedor compra">
        {encabezado}
        <h1 className="sr-only">Selecciona tus boletos</h1>
        <EstadoCarga mensaje="Cargando zonas y precios…" />
      </div>
    );
  }

  if (estado === 'error') {
    return (
      <div className="contenedor compra">
        {encabezado}
        <h1 className="sr-only">Selecciona tus boletos</h1>
        <EstadoError mensaje={error} onReintentar={reintentar} />
      </div>
    );
  }

  if (!sePuedeComprar(evento)) {
    return (
      <div className="contenedor compra">
        {encabezado}
        <h1 className="sr-only">Selecciona tus boletos</h1>
        <EstadoError titulo="Este evento no está a la venta" mensaje="Puede que esté agotado, cancelado o que ya se haya realizado." />
      </div>
    );
  }

  const zona = evento.zonas.find((item) => item.id === zonaId);
  // Ya en el carrito: no se puede pasar del máximo ni de lo disponible
  const enCarrito = carrito.items.find((item) => item.clave === `${evento.id}:${zonaId}`)?.cantidad ?? 0;
  const maximo = zona ? Math.max(Math.min(MAXIMO_BOLETOS_POR_ZONA - enCarrito, disponiblesZona(zona) - enCarrito), 0) : MAXIMO_BOLETOS_POR_ZONA;

  function elegirZona(id) {
    setZonaId(id);
    setCantidad(1);
  }

  function agregar() {
    carrito.agregar({
      eventoId: evento.id,
      eventoTitulo: evento.titulo,
      fecha: evento.fecha,
      lugar: evento.lugar,
      zonaId: zona.id,
      zonaNombre: zona.nombre,
      precio: zona.precio,
      cantidad,
    });
    irA('carrito');
  }

  return (
    <div className="contenedor compra">
      {encabezado}

      <div className="compra__evento">
        <img className="compra__miniatura" src={rutaPublica(evento.imagen)} alt="" width="80" height="80" />
        <div>
          <h1 className="pagina__titulo">{evento.titulo}</h1>
          <p className="compra__dato">
            {formatearFecha(evento.fecha)} · {evento.lugar}
          </p>
        </div>
      </div>

      <div className="compra__columnas">
        <div className="compra__panel">
          <SelectorZona zonas={evento.zonas} valor={zonaId} onCambiar={elegirZona} />

          {zona && (
            <div>
              <h2 className="compra__subtitulo">2. ¿Cuántos boletos?</h2>
              {maximo > 0 ? (
                <>
                  <SelectorCantidad
                    id="cantidad-boletos"
                    etiqueta={`Boletos en zona ${zona.nombre}`}
                    valor={Math.min(cantidad, maximo)}
                    maximo={maximo}
                    onCambiar={setCantidad}
                  />
                  <p className="compra__dato">Máximo {MAXIMO_BOLETOS_POR_ZONA} boletos por zona en cada compra.</p>
                </>
              ) : (
                <p className="compra__alerta">Ya tienes el máximo de boletos de esta zona en tu carrito.</p>
              )}
            </div>
          )}
        </div>

        <aside className="resumen-compra" aria-labelledby="seleccion-resumen">
          <h2 id="seleccion-resumen" className="compra__subtitulo">
            Tu selección
          </h2>
          {zona && maximo > 0 ? (
            <>
              <p>
                {Math.min(cantidad, maximo)} × {zona.nombre} ({formatearPrecio(zona.precio)} c/u)
              </p>
              <p className="resumen-compra__total">
                Subtotal: <strong>{formatearPrecio(zona.precio * Math.min(cantidad, maximo))}</strong>
              </p>
            </>
          ) : (
            <p className="compra__dato">Elige una zona para ver el precio.</p>
          )}
          <Boton bloque disabled={!zona || maximo === 0} onClick={agregar}>
            Agregar al carrito
          </Boton>
          {carrito.totalItems > 0 && (
            <Boton variante="secundario" bloque onClick={() => irA('carrito')}>
              Ir al carrito ({carrito.totalItems})
            </Boton>
          )}
        </aside>
      </div>
    </div>
  );
}
