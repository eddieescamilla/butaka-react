// DUEÑO: Gabriel. Módulo 6: boletos electrónicos. Un boleto con su código QR.
// Ruta: /boletos/:codigo (requiere sesión). El boleto viene de la API falsa.
import { useParams } from 'react-router';
import Boton from '../../components/Boton.jsx';
import EnlaceVista from '../../components/EnlaceVista.jsx';
import EstadoCarga from '../../components/EstadoCarga.jsx';
import EstadoError from '../../components/EstadoError.jsx';
import Logo from '../../components/Logo.jsx';
import { usePeticion } from '../../hooks/usePeticion.js';
import { obtenerBoleto } from '../../api/ordenes.js';
import { formatearFecha, formatearPrecio } from '../../utils/formato.js';
import { useSesion } from '../cuenta/useSesion.js';
import CodigoQR from './CodigoQR.jsx';
import './Compra.css';
import './BoletoPage.css';

export default function BoletoPage() {
  const { codigo } = useParams();
  const sesion = useSesion();
  const { estado, datos: boleto, error, reintentar } = usePeticion(
    (signal) => obtenerBoleto(codigo, { usuarioId: sesion.usuario.id }, { signal }),
    [codigo, sesion.usuario.id],
  );

  const volver = (
    <EnlaceVista a="/boletos" className="compra__volver boleto__no-imprimir">
      ← Volver a mis boletos
    </EnlaceVista>
  );

  if (estado !== 'exito') {
    return (
      <div className="contenedor compra">
        {volver}
        <h1 className="sr-only">Boleto</h1>
        {estado === 'cargando' ? (
          <EstadoCarga mensaje="Cargando tu boleto…" />
        ) : (
          <EstadoError titulo="No encontramos este boleto" mensaje={error} onReintentar={reintentar} />
        )}
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
