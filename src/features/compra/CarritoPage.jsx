// DUEÑO: Gabriel. Módulo 4: proceso de compra. Paso 2: carrito.
// Props: { irA, carrito }
import Boton from '../../components/Boton.jsx';
import EstadoVacio from '../../components/EstadoVacio.jsx';
import IndicadorPasos from './IndicadorPasos.jsx';
import ItemCarrito from './ItemCarrito.jsx';
import ResumenCompra from './ResumenCompra.jsx';
import './Compra.css';

export default function CarritoPage({ irA, carrito }) {
  if (carrito.items.length === 0) {
    return (
      <div className="contenedor compra">
        <IndicadorPasos actual={2} />
        <h1 className="pagina__titulo">Tu carrito</h1>
        <EstadoVacio titulo="Tu carrito está vacío" mensaje="Explora los eventos y elige tus boletos.">
          <Boton onClick={() => irA('inicio')}>Ver eventos</Boton>
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
          <Boton variante="texto" onClick={() => irA('inicio')}>
            + Agregar boletos de otro evento
          </Boton>
        </section>

        <ResumenCompra subtotal={carrito.subtotal} cargoServicio={carrito.cargoServicio} total={carrito.total}>
          <Boton bloque onClick={() => irA('resumen')}>
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
