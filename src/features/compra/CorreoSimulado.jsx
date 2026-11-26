// DUEÑO: Gabriel. Módulo 6: confirmación simulada por correo.
// No se envía ningún correo real: se muestra cómo se vería el mensaje
// que recibiría el comprador, con sus boletos y el enlace para verlos.
// Props:
//   orden:  orden creada por la API (con sus boletos)
//   correo: correo del comprador
import EnlaceVista from '../../components/EnlaceVista.jsx';
import { formatearFecha, formatearPrecio } from '../../utils/formato.js';
import './CorreoSimulado.css';

export default function CorreoSimulado({ orden, correo }) {
  const titulos = [...new Set(orden.boletos.map((boleto) => boleto.eventoTitulo))];

  return (
    <section className="correo-simulado" aria-labelledby="correo-asunto">
      <p className="correo-simulado__aviso">Correo simulado: así se vería el mensaje en tu bandeja de entrada.</p>
      <dl className="correo-simulado__cabecera">
        <div>
          <dt>De</dt>
          <dd>Butaka &lt;boletos@butaka.com&gt;</dd>
        </div>
        <div>
          <dt>Para</dt>
          <dd>{correo}</dd>
        </div>
      </dl>
      <h2 id="correo-asunto" className="correo-simulado__asunto">
        Tus boletos para {titulos.join(' y ')} · Orden {orden.id}
      </h2>
      <p>Gracias por tu compra. Estos son tus boletos; presenta el código QR de cada uno en la entrada.</p>
      <ul className="correo-simulado__boletos">
        {orden.boletos.map((boleto) => (
          <li key={boleto.codigo}>
            <strong>{boleto.codigo}</strong> · {boleto.eventoTitulo} · Zona {boleto.zonaNombre}
            {boleto.fecha && <> · {formatearFecha(boleto.fecha)}</>}
          </li>
        ))}
      </ul>
      <p>
        Total pagado: <strong>{formatearPrecio(orden.total)}</strong>
      </p>
      <EnlaceVista a="/boletos" className="correo-simulado__enlace">
        Ver mis boletos con su código QR
      </EnlaceVista>
    </section>
  );
}
