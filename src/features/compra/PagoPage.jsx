// DUEÑO: Gabriel. Módulo 5: sistema de pagos. Paso 3: pago.
// Props: { irA, sesion, carrito }
// Prevención de doble compra: el botón se deshabilita mientras se procesa y
// una referencia bloquea un segundo envío aunque llegue antes del render.
import { useRef, useState } from 'react';
import Boton from '../../components/Boton.jsx';
import EstadoVacio from '../../components/EstadoVacio.jsx';
import EnlaceVista from '../../components/EnlaceVista.jsx';
import IndicadorPasos from './IndicadorPasos.jsx';
import ResumenCompra from './ResumenCompra.jsx';
import FormularioPago from './FormularioPago.jsx';
import { procesarPago, soloDigitos } from './pagos.js';
import { problemasDeStock } from './stock.js';
import { useOrdenes } from './useOrdenes.js';
import './Compra.css';

export default function PagoPage({ irA, sesion, carrito }) {
  const { crearOrden } = useOrdenes(sesion.usuario.id);
  const [procesando, setProcesando] = useState(false);
  const enCurso = useRef(false);

  if (carrito.items.length === 0) {
    return (
      <div className="contenedor compra">
        <IndicadorPasos actual={3} />
        <h1 className="pagina__titulo">Pago</h1>
        <EstadoVacio titulo="No hay nada que pagar" mensaje="Tu carrito está vacío.">
          <Boton onClick={() => irA('inicio')}>Ver eventos</Boton>
        </EstadoVacio>
      </div>
    );
  }

  async function pagar(tarjeta) {
    if (enCurso.current) return; // segundo clic ignorado
    if (problemasDeStock(carrito.items).length > 0) {
      irA('resumen');
      return;
    }
    enCurso.current = true;
    setProcesando(true);
    try {
      await procesarPago({ numero: tarjeta.numero, total: carrito.total });
      const orden = crearOrden(carrito, {
        titular: tarjeta.titular.trim(),
        ultimos4: soloDigitos(tarjeta.numero).slice(-4),
      });
      carrito.vaciar();
      irA('resultado-pago', { resultado: 'aprobado', ordenId: orden.id });
    } catch (error) {
      // El carrito se conserva para poder intentar de nuevo
      irA('resultado-pago', { resultado: 'rechazado', motivo: error.message });
    }
  }

  return (
    <div className="contenedor compra">
      <EnlaceVista vista="resumen" irA={irA} className="compra__volver">
        ← Volver al resumen
      </EnlaceVista>
      <IndicadorPasos actual={3} />
      <h1 className="pagina__titulo">Pago</h1>

      <div className="compra__columnas">
        <section className="compra__panel" aria-labelledby="pago-tarjeta">
          <h2 id="pago-tarjeta" className="compra__subtitulo">
            Tarjeta de crédito o débito
          </h2>
          <FormularioPago total={carrito.total} procesando={procesando} onPagar={pagar} />
        </section>

        <ResumenCompra
          titulo={`${carrito.totalItems} ${carrito.totalItems === 1 ? 'boleto' : 'boletos'}`}
          subtotal={carrito.subtotal}
          cargoServicio={carrito.cargoServicio}
          total={carrito.total}
        >
          <ul className="compra__dato">
            {carrito.items.map((item) => (
              <li key={item.clave}>
                {item.cantidad} × {item.eventoTitulo} · {item.zonaNombre}
              </li>
            ))}
          </ul>
        </ResumenCompra>
      </div>
    </div>
  );
}
