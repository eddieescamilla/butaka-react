// DUEÑO: Gabriel. Módulo 4: proceso de compra. Paso 2: carrito.
// Ruta: /carrito  ·  el carrito es estado global (CarritoContext)
import { useNavigate } from 'react-router';
import Boton from '../../components/Boton.jsx';
import EstadoVacio from '../../components/EstadoVacio.jsx';
import IndicadorPasos from './IndicadorPasos.jsx';
import ItemCarrito from './ItemCarrito.jsx';
import ResumenCompra from './ResumenCompra.jsx';
import { useCarrito } from './useCarrito.js';
import './Compra.css';

export default function CarritoPage() {
  const carrito = useCarrito();
  const navegar = useNavigate();

  if (carrito.items.length === 0) {
    return (
      <div className="contenedor compra">
        <IndicadorPasos actual={2} />
        <h1 className="pagina__titulo">Tu carrito</h1>
        <EstadoVacio titulo="Tu carrito está vacío" mensaje="Explora los eventos y elige tus boletos.">
          <Boton onClick={() => navegar('/eventos')}>Ver eventos</Boton>
        </EstadoVacio>
      </div>
    );
  }

  return (
    <div className="contenedor compra">
      <IndicadorPasos actual={2} />
      <h1 className="pagina__titulo">Tu carrito</h1>

      <div className="compra__columnas">
        <section className="compra__panel" aria-labelledby="carrito-lista">
          <h2 id="carrito-lista" className="sr-only">
            Boletos en el carrito
          </h2>
          <ul>
            {carrito.items.map((item) => (
              <ItemCarrito key={item.clave} item={item} onCambiarCantidad={carrito.cambiarCantidad} onQuitar={carrito.quitar} />
            ))}
          </ul>
          <Boton variante="texto" onClick={() => navegar('/eventos')}>
            + Agregar boletos de otro evento
          </Boton>
        </section>

        <ResumenCompra subtotal={carrito.subtotal} cargoServicio={carrito.cargoServicio} total={carrito.total}>
          <Boton bloque onClick={() => navegar('/checkout')}>
            Continuar
          </Boton>
          <Boton variante="texto" onClick={carrito.vaciar}>
            Vaciar carrito
          </Boton>
        </ResumenCompra>
      </div>
    </div>
  );
}
