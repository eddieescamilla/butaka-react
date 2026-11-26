// DUEÑO: Gabriel. Módulo 5: sistema de pagos. Paso 4: pago aprobado o rechazado.
// Ruta: /checkout/resultado (requiere sesión). El resultado llega en location.state:
//   { resultado: 'aprobado', ordenId }  o  { resultado: 'rechazado', motivo }
// Si se abre sin ese estado (por ejemplo, escribiendo la URL), se va a Mis boletos.
import { Navigate, useLocation, useNavigate } from 'react-router';
import Boton from '../../components/Boton.jsx';
import Etiqueta from '../../components/Etiqueta.jsx';
import EstadoCarga from '../../components/EstadoCarga.jsx';
import EstadoError from '../../components/EstadoError.jsx';
import { usePeticion } from '../../hooks/usePeticion.js';
import { obtenerOrden } from '../../api/ordenes.js';
import { formatearPrecio } from '../../utils/formato.js';
import { useSesion } from '../cuenta/useSesion.js';
import IndicadorPasos from './IndicadorPasos.jsx';
import CorreoSimulado from './CorreoSimulado.jsx';
import './Compra.css';
import './ResultadoPagoPage.css';

export default function ResultadoPagoPage() {
  const { state: estado } = useLocation();
  const navegar = useNavigate();
  const { usuario } = useSesion();
  const aprobado = estado?.resultado === 'aprobado';
  const peticion = usePeticion(
    (signal) => (aprobado ? obtenerOrden(estado.ordenId, { usuarioId: usuario.id }, { signal }) : Promise.resolve(null)),
    [aprobado, estado?.ordenId, usuario.id],
  );

  if (!estado?.resultado) return <Navigate to="/boletos" replace />;

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
          <p className="resultado-pago__texto">{estado.motivo ?? 'El pago fue rechazado.'} No se hizo ningún cargo a tu tarjeta.</p>
          <p className="resultado-pago__texto">Tus boletos siguen en el carrito.</p>
          <div className="resultado-pago__acciones">
            <Boton onClick={() => navegar('/checkout/pago')}>Intentar de nuevo</Boton>
            <Boton variante="secundario" onClick={() => navegar('/carrito')}>
              Volver al carrito
            </Boton>
          </div>
        </section>
      </div>
    );
  }

  const orden = peticion.datos;

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

        {peticion.estado === 'cargando' && <EstadoCarga mensaje="Generando tus boletos…" />}
        {peticion.estado === 'error' && <EstadoError mensaje={peticion.error} onReintentar={peticion.reintentar} />}
        {orden && (
          <>
            <p className="resultado-pago__texto">
              Tu orden <strong>{orden.id}</strong> por <strong>{formatearPrecio(orden.total)}</strong> está{' '}
              <Etiqueta variante="en-venta">Pagada</Etiqueta>. Te enviamos{' '}
              {orden.boletos.length === 1 ? 'tu boleto' : `tus ${orden.boletos.length} boletos`} a {usuario.correo}.
            </p>
            {orden.tarjeta && <p className="resultado-pago__texto">Pagado con tarjeta terminada en {orden.tarjeta.ultimos4}.</p>}
            <CorreoSimulado orden={orden} correo={usuario.correo} />
          </>
        )}

        <div className="resultado-pago__acciones">
          <Boton onClick={() => navegar('/boletos')}>Ver mis boletos</Boton>
          <Boton variante="secundario" onClick={() => navegar('/eventos')}>
            Seguir explorando
          </Boton>
        </div>
      </section>
    </div>
  );
}
