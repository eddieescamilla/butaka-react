// DUEÑO: Gabriel. Módulo 6: boletos electrónicos. Un boleto con su código QR.
// Props: { params, irA, sesion }  ·  params.codigo: código del boleto
import Boton from '../../components/Boton.jsx';
import EnlaceVista from '../../components/EnlaceVista.jsx';
import EstadoError from '../../components/EstadoError.jsx';
import Logo from '../../components/Logo.jsx';
import { formatearFecha, formatearPrecio } from '../../utils/formato.js';
import CodigoQR from './CodigoQR.jsx';
import { useOrdenes } from './useOrdenes.js';
import './Compra.css';
import './BoletoPage.css';

export default function BoletoPage({ params, irA, sesion }) {
  const { boletos } = useOrdenes(sesion.usuario.id);
  const boleto = boletos.find((item) => item.codigo === params.codigo);

  const volver = (
    <EnlaceVista vista="mis-boletos" irA={irA} className="compra__volver boleto__no-imprimir">
      ← Volver a mis boletos
    </EnlaceVista>
  );

  if (!boleto) {
    return (
      <div className="contenedor compra">
        {volver}
        <h1 className="sr-only">Boleto</h1>
        <EstadoError titulo="No encontramos este boleto" mensaje="Revisa que el código sea correcto o que pertenezca a tu cuenta." />
      </div>
    );
  }

  return (
    <div className="contenedor compra">
      {volver}

      <article className="boleto" aria-labelledby="boleto-titulo">
        <header className="boleto__cabecera">
          <Logo />
          <span className="boleto__tipo">Boleto electrónico</span>
        </header>

        <div className="boleto__cuerpo">
          <div className="boleto__datos">
            <h1 id="boleto-titulo" className="boleto__titulo">
              {boleto.eventoTitulo}
            </h1>
            <dl className="boleto__lista">
              <div>
                <dt>Fecha</dt>
                <dd>{boleto.fecha ? formatearFecha(boleto.fecha) : 'Por confirmar'}</dd>
              </div>
              <div>
                <dt>Lugar</dt>
                <dd>{boleto.lugar}</dd>
              </div>
              <div>
                <dt>Zona</dt>
                <dd>{boleto.zonaNombre}</dd>
              </div>
              <div>
                <dt>Titular</dt>
                <dd>
                  {sesion.usuario.nombre} {sesion.usuario.apellido}
                </dd>
              </div>
              {boleto.precio !== undefined && (
                <div>
                  <dt>Precio</dt>
                  <dd>{formatearPrecio(boleto.precio)}</dd>
                </div>
              )}
              <div>
                <dt>Orden</dt>
                <dd>{boleto.ordenId}</dd>
              </div>
            </dl>
          </div>

          <div className="boleto__qr">
            <CodigoQR codigo={boleto.codigo} tamano={200} />
            <p className="boleto__codigo">{boleto.codigo}</p>
            <p className="boleto__instruccion">Muestra este código en la entrada. Es válido para una sola persona.</p>
          </div>
        </div>
      </article>

      <div className="boleto__acciones boleto__no-imprimir">
        <Boton onClick={() => window.print()}>Imprimir o guardar en PDF</Boton>
      </div>
    </div>
  );
}
