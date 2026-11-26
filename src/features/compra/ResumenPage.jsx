// DUEÑO: Gabriel. Módulo 4: proceso de compra. Paso 2: revisar antes de pagar.
// Ruta: /checkout (pública). Sin sesión, muestra el resumen y pide iniciar
// sesión para pagar; el login regresa a /checkout/pago.
// La disponibilidad se revisa contra la API falsa cada vez que se abre.
import { useLocation, useNavigate } from 'react-router';
import Boton from '../../components/Boton.jsx';
import EstadoVacio from '../../components/EstadoVacio.jsx';
import EstadoCarga from '../../components/EstadoCarga.jsx';
import EstadoError from '../../components/EstadoError.jsx';
import EnlaceVista from '../../components/EnlaceVista.jsx';
import { usePeticion } from '../../hooks/usePeticion.js';
import { listarEventos } from '../../api/eventos.js';
import { useSesion } from '../cuenta/useSesion.js';
import IndicadorPasos from './IndicadorPasos.jsx';
import ItemCarrito from './ItemCarrito.jsx';
import ResumenCompra from './ResumenCompra.jsx';
import { problemasDeStock } from './stock.js';
import { useCarrito } from './useCarrito.js';
import './Compra.css';

export default function ResumenPage() {
  const carrito = useCarrito();
  const { usuario, haySesion } = useSesion();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const hayItems = carrito.items.length > 0;
  const inventario = usePeticion((signal) => (hayItems ? listarEventos({}, { signal }) : Promise.resolve([])), [hayItems]);

  if (!hayItems) {
    return (
      <div className="contenedor compra">
        <IndicadorPasos actual={2} />
        <h1 className="pagina__titulo">Resumen de compra</h1>
        <EstadoVacio titulo="No hay boletos para comprar" mensaje="Tu carrito está vacío.">
          <Boton onClick={() => navegar('/eventos')}>Ver eventos</Boton>
        </EstadoVacio>
      </div>
    );
  }

  // Valor derivado: se recalcula con el inventario más reciente
  const problemas = inventario.estado === 'exito' ? problemasDeStock(carrito.items, inventario.datos) : [];
  const puedePagar = inventario.estado === 'exito' && problemas.length === 0;

  function continuar() {
    if (haySesion) navegar('/checkout/pago');
    // Al iniciar sesión, el login regresa directo al pago
    else navegar('/login', { state: { desde: { ...ubicacion, pathname: '/checkout/pago' } } });
  }

  return (
    <div className="contenedor compra">
      <EnlaceVista a="/carrito" className="compra__volver">
        ← Volver al carrito
      </EnlaceVista>
      <IndicadorPasos actual={2} />
      <h1 className="pagina__titulo">Resumen de compra</h1>

      <div className="compra__columnas">
        <div className="compra__panel">
          {inventario.estado === 'cargando' && <EstadoCarga mensaje="Revisando la disponibilidad…" />}
          {inventario.estado === 'error' && (
            <EstadoError titulo="No pudimos revisar la disponibilidad" mensaje={inventario.error} onReintentar={inventario.reintentar} />
          )}
          {problemas.length > 0 && (
            <div className="compra__alerta" role="alert">
              <strong>Revisa tu carrito antes de pagar:</strong>
              <ul>
                {problemas.map((problema) => (
                  <li key={problema}>{problema}</li>
                ))}
              </ul>
            </div>
          )}

          <section aria-labelledby="resumen-boletos">
            <h2 id="resumen-boletos" className="compra__subtitulo">
              Boletos
            </h2>
            <ul>
              {carrito.items.map((item) => (
                <ItemCarrito key={item.clave} item={item} editable={false} />
              ))}
            </ul>
          </section>

          <section aria-labelledby="resumen-comprador">
            <h2 id="resumen-comprador" className="compra__subtitulo">
              Comprador
            </h2>
            {haySesion ? (
              <>
                <p>
                  {usuario.nombre} {usuario.apellido}
                </p>
                <p className="compra__dato">Enviaremos los boletos a {usuario.correo}</p>
              </>
            ) : (
              <p className="compra__dato">Inicia sesión o crea una cuenta para pagar. Tu carrito se conserva.</p>
            )}
          </section>
        </div>

        <ResumenCompra subtotal={carrito.subtotal} cargoServicio={carrito.cargoServicio} total={carrito.total}>
          <Boton bloque disabled={!puedePagar} onClick={continuar}>
            {haySesion ? 'Continuar al pago' : 'Iniciar sesión para pagar'}
          </Boton>
          {problemas.length > 0 && (
            <Boton variante="secundario" bloque onClick={() => navegar('/carrito')}>
              Ajustar carrito
            </Boton>
          )}
        </ResumenCompra>
      </div>
    </div>
  );
}
