// DUEÑO: Gabriel. Módulo 6: verificación del código QR (pública).
// Ruta: /verificar/:codigo?f=FIRMA. Es la pantalla que abre el QR al escanearlo:
// simula lo que vería el personal en la entrada del evento.
//   - Vuelve a calcular la firma del código: si no coincide, el boleto fue alterado.
//   - Si el boleto está en este dispositivo, muestra sus datos y si fue reembolsado.
// Sin backend, un boleto comprado en otro teléfono solo se puede validar por su firma.
import { useParams, useSearchParams } from 'react-router';
import EstadoCarga from '../../components/EstadoCarga.jsx';
import EstadoError from '../../components/EstadoError.jsx';
import EnlaceVista from '../../components/EnlaceVista.jsx';
import { usePeticion } from '../../hooks/usePeticion.js';
import { verificarBoleto } from '../../api/ordenes.js';
import { formatearFecha } from '../../utils/formato.js';
import './Compra.css';
import './ResultadoPagoPage.css';

export default function VerificarBoletoPage() {
  const { codigo } = useParams();
  const [parametros] = useSearchParams();
  const firma = parametros.get('f') ?? '';
  const { estado, datos, error, reintentar } = usePeticion((signal) => verificarBoleto(codigo, firma, { signal }), [codigo, firma]);

  if (estado === 'cargando') {
    return (
      <div className="contenedor compra">
        <h1 className="sr-only">Verificar boleto</h1>
        <EstadoCarga mensaje="Verificando el boleto…" />
      </div>
    );
  }

  if (estado === 'error') {
    return (
      <div className="contenedor compra">
        <h1 className="sr-only">Verificar boleto</h1>
        <EstadoError mensaje={error} onReintentar={reintentar} />
      </div>
    );
  }

  const { valido, motivo, boleto } = datos;

  return (
    <div className="contenedor compra">
      <section
        className={`resultado-pago resultado-pago--${valido ? 'aprobado' : 'rechazado'}`}
        role={valido ? 'status' : 'alert'}
        aria-labelledby="verificar-titulo"
      >
        <span className="resultado-pago__icono" aria-hidden="true">
          {valido ? '✓' : '✕'}
        </span>
        <h1 id="verificar-titulo" className="pagina__titulo">
          {valido ? 'Boleto válido' : 'Boleto no válido'}
        </h1>
        <p className="resultado-pago__texto">
          Código <strong>{codigo}</strong>. {motivo}
        </p>
        {boleto ? (
          <p className="resultado-pago__texto">
            {boleto.eventoTitulo} · Zona {boleto.zonaNombre}
            {boleto.fecha && <> · {formatearFecha(boleto.fecha)}</>} · Orden {boleto.ordenId}
          </p>
        ) : (
          valido && <p className="resultado-pago__texto">La firma es correcta. Los datos del boleto no están guardados en este dispositivo.</p>
        )}
        <EnlaceVista a="/" className="compra__volver">
          Ir a Butaka
        </EnlaceVista>
      </section>
    </div>
  );
}
