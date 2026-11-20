// DUEÑO: Gabriel. Módulo 6: boletos electrónicos. Boleto en la lista de "Mis boletos".
// Props:
//   boleto: { codigo, eventoTitulo, fecha, lugar, zonaNombre }
//   irA:    función de navegación
import EnlaceVista from '../../components/EnlaceVista.jsx';
import Etiqueta from '../../components/Etiqueta.jsx';
import { formatearFecha } from '../../utils/formato.js';
import CodigoQR from './CodigoQR.jsx';
import './TarjetaBoleto.css';

export default function TarjetaBoleto({ boleto, irA }) {
  const pasado = boleto.fecha && new Date(boleto.fecha) < new Date();

  return (
    <article className={`tarjeta-boleto${pasado ? ' tarjeta-boleto--pasado' : ''}`}>
      <div className="tarjeta-boleto__qr" aria-hidden="true">
        <CodigoQR codigo={boleto.codigo} tamano={72} />
      </div>
      <div className="tarjeta-boleto__info">
        <Etiqueta variante={pasado ? 'finalizado' : 'en-venta'}>{pasado ? 'Evento realizado' : 'Vigente'}</Etiqueta>
        <h3 className="tarjeta-boleto__titulo">
          <EnlaceVista vista="boleto" params={{ codigo: boleto.codigo }} irA={irA} className="tarjeta-boleto__enlace">
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
