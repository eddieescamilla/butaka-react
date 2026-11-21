// DUEÑO: Gabriel. Módulo 4: proceso de compra. Paso 2: revisar antes de pagar.
// Props: { irA, sesion, carrito }  (pide sesión: App.jsx muestra el login si no la hay)
import Boton from '../../components/Boton.jsx';
import EstadoVacio from '../../components/EstadoVacio.jsx';
import EnlaceVista from '../../components/EnlaceVista.jsx';
import IndicadorPasos from './IndicadorPasos.jsx';
import ItemCarrito from './ItemCarrito.jsx';
import ResumenCompra from './ResumenCompra.jsx';
import { problemasDeStock } from './stock.js';
import './Compra.css';

export default function ResumenPage({ irA, sesion, carrito }) {
  if (carrito.items.length === 0) {
    return (
      <div className="contenedor compra">
        <IndicadorPasos actual={2} />
        <h1 className="pagina__titulo">Resumen de compra</h1>
        <EstadoVacio titulo="No hay boletos para comprar" mensaje="Tu carrito está vacío.">
          <Boton onClick={() => irA('inicio')}>Ver eventos</Boton>
        </EstadoVacio>
      </div>
    );
  }

  // Se revisa la disponibilidad cada vez que se muestra la pantalla (valor derivado)
  const problemas = problemasDeStock(carrito.items);
  const { usuario } = sesion;

  return (
    <div className="contenedor compra">
      <EnlaceVista vista="carrito" irA={irA} className="compra__volver">
        ← Volver al carrito
      </EnlaceVista>
      <IndicadorPasos actual={2} />
      <h1 className="pagina__titulo">Resumen de compra</h1>

      <div className="compra__columnas">
        <div className="compra__panel">
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
            <p>
              {usuario.nombre} {usuario.apellido}
            </p>
            <p className="compra__dato">Enviaremos los boletos a {usuario.correo}</p>
          </section>
        </div>

        <ResumenCompra subtotal={carrito.subtotal} cargoServicio={carrito.cargoServicio} total={carrito.total}>
          <Boton bloque disabled={problemas.length > 0} onClick={() => irA('pago')}>
            Continuar al pago
          </Boton>
          {problemas.length > 0 && (
            <Boton variante="secundario" bloque onClick={() => irA('carrito')}>
              Ajustar carrito
            </Boton>
          )}
        </ResumenCompra>
      </div>
    </div>
  );
}
