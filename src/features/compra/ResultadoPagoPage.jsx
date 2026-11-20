// DUEÑO: Gabriel. Módulo 5: sistema de pagos. Paso 4: pago aprobado o rechazado.
// Props: { params, irA, sesion }
//   params.resultado: 'aprobado' | 'rechazado'
//   params.ordenId (si fue aprobado) · params.motivo (si fue rechazado)
import Boton from '../../components/Boton.jsx';
import { formatearPrecio } from '../../utils/formato.js';
import IndicadorPasos from './IndicadorPasos.jsx';
import { useOrdenes } from './useOrdenes.js';
import './Compra.css';
import './ResultadoPagoPage.css';

export default function ResultadoPagoPage({ params, irA, sesion }) {
  const { ordenes } = useOrdenes(sesion.usuario.id);
  const aprobado = params.resultado === 'aprobado';
  const orden = ordenes.find((item) => item.id === params.ordenId);

  if (!aprobado) {
    return (
      <div className="contenedor compra">
        <IndicadorPasos actual={3} />
        <section className="resultado-pago resultado-pago--rechazado" role="alert" aria-labelledby="resultado-titulo">
          <span className="resultado-pago__icono" aria-hidden="true">
            ✕
          </span>
          <h1 id="resultado-titulo" className="pagina__titulo">
            No pudimos procesar tu pago
          </h1>
          <p className="resultado-pago__texto">{params.motivo ?? 'El pago fue rechazado.'} No se hizo ningún cargo a tu tarjeta.</p>
          <p className="resultado-pago__texto">Tus boletos siguen en el carrito.</p>
          <div className="resultado-pago__acciones">
            <Boton onClick={() => irA('pago')}>Intentar de nuevo</Boton>
            <Boton variante="secundario" onClick={() => irA('carrito')}>
              Volver al carrito
            </Boton>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="contenedor compra">
      <IndicadorPasos actual={4} />
      <section className="resultado-pago resultado-pago--aprobado" role="status" aria-labelledby="resultado-titulo">
        <span className="resultado-pago__icono" aria-hidden="true">
          ✓
        </span>
        <h1 id="resultado-titulo" className="pagina__titulo">
          ¡Pago aprobado!
        </h1>
        {orden ? (
          <>
            <p className="resultado-pago__texto">
              Tu orden <strong>{orden.id}</strong> por <strong>{formatearPrecio(orden.total)}</strong> está confirmada. Te
              enviamos {orden.boletos.length === 1 ? 'tu boleto' : `tus ${orden.boletos.length} boletos`} a{' '}
              {sesion.usuario.correo}.
            </p>
            {orden.tarjeta && <p className="resultado-pago__texto">Pagado con tarjeta terminada en {orden.tarjeta.ultimos4}.</p>}
          </>
        ) : (
          <p className="resultado-pago__texto">Tu compra está confirmada.</p>
        )}
        <div className="resultado-pago__acciones">
          <Boton onClick={() => irA('mis-boletos')}>Ver mis boletos</Boton>
          <Boton variante="secundario" onClick={() => irA('inicio')}>
            Seguir explorando
          </Boton>
        </div>
      </section>
    </div>
  );
}
