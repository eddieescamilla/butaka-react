// DUEÑO: Gabriel. Módulo 6: boletos electrónicos. Boleto en la lista de "Mis boletos".
// Props:
//   boleto: { codigo, eventoTitulo, fecha, lugar, zonaNombre, firma, estado }
import EnlaceVista from '../../components/EnlaceVista.jsx';
import Etiqueta from '../../components/Etiqueta.jsx';
import { formatearFecha } from '../../utils/formato.js';
import CodigoQR, { enlaceVerificacion } from './CodigoQR.jsx';
import './TarjetaBoleto.css';

export default function TarjetaBoleto({ boleto }) {
  const pasado = boleto.fecha && new Date(boleto.fecha) < new Date();
  const reembolsado = boleto.estado === 'reembolsada';

  return (
    <article className={`tarjeta-boleto${pasado ? ' tarjeta-boleto--pasado' : ''}`}>
      <div className="tarjeta-boleto__qr" aria-hidden="true">
        <CodigoQR valor={enlaceVerificacion(boleto)} etiqueta={`Código QR del boleto ${boleto.codigo}`} tamano={72} />
      </div>
      <div className="tarjeta-boleto__info">
        {reembolsado ? (
          <Etiqueta variante="cancelado">Reembolsado</Etiqueta>
        ) : (
          <Etiqueta variante={pasado ? 'finalizado' : 'en-venta'}>{pasado ? 'Evento realizado' : 'Vigente'}</Etiqueta>
        )}
        <h3 className="tarjeta-boleto__titulo">
          <EnlaceVista a={`/boletos/${boleto.codigo}`} className="tarjeta-boleto__enlace">
            {boleto.eventoTitulo}
          </EnlaceVista>
        </h3>
        <p className="tarjeta-boleto__dato">
          {boleto.fecha ? formatearFecha(boleto.fecha) : 'Fecha por confirmar'} · {boleto.lugar}
        </p>
        <p className="tarjeta-boleto__dato">
          Zona {boleto.zonaNombre} · <span className="tarjeta-boleto__codigo">{boleto.codigo}</span>
        </p>
      </div>
    </article>
  );
}
