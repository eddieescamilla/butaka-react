// DUEÑO: Gabriel. Módulo 5: sistema de pagos. Paso 3: pago simulado.
// Ruta: /checkout/pago (requiere sesión).
// Flujo: pasarela simulada → la API crea la orden (recalcula montos, revisa y
// descuenta inventario, genera los boletos) → se vacía el carrito → resultado.
// Prevención de doble envío: el botón se deshabilita mientras se procesa y una
// referencia bloquea un segundo envío aunque llegue antes del siguiente render.
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Boton from '../../components/Boton.jsx';
import EstadoVacio from '../../components/EstadoVacio.jsx';
import EnlaceVista from '../../components/EnlaceVista.jsx';
import { crearOrden } from '../../api/ordenes.js';
import { useSesion } from '../cuenta/useSesion.js';
import IndicadorPasos from './IndicadorPasos.jsx';
import ResumenCompra from './ResumenCompra.jsx';
import FormularioPago from './FormularioPago.jsx';
import { procesarPago, soloDigitos } from './pagos.js';
import { useCarrito } from './useCarrito.js';
import { useEnLinea } from '../pwa/useEnLinea.js';
import './Compra.css';

export default function PagoPage() {
  const carrito = useCarrito();
  const { usuario } = useSesion();
  const navegar = useNavigate();
  const [procesando, setProcesando] = useState(false);
  const enCurso = useRef(false);
  // Un pago real necesita conexión: sin red el formulario se desactiva
  const enLinea = useEnLinea();

  if (carrito.items.length === 0 && !procesando) {
    return (
      <div className="contenedor compra">
        <IndicadorPasos actual={3} />
        <h1 className="pagina__titulo">Pago</h1>
        <EstadoVacio titulo="No hay nada que pagar" mensaje="Tu carrito está vacío.">
          <Boton onClick={() => navegar('/eventos')}>Ver eventos</Boton>
        </EstadoVacio>
      </div>
    );
  }

  async function pagar(tarjeta) {
    if (enCurso.current) return; // segundo clic ignorado
    enCurso.current = true;
    setProcesando(true);
    try {
      // 1. Pasarela simulada (la tarjeta de prueba "rechazada" siempre falla)
      await procesarPago({ numero: tarjeta.numero, total: carrito.total });
      // 2. La API crea la orden; nunca se guarda el número completo ni el CVV
      const orden = await crearOrden({
        usuarioId: usuario.id,
        items: carrito.items,
        tarjeta: { titular: tarjeta.titular.trim(), ultimos4: soloDigitos(tarjeta.numero).slice(-4) },
      });
      carrito.vaciar();
      // replace: el botón Atrás no regresa al formulario de un pago ya hecho
      navegar('/checkout/resultado', { replace: true, state: { resultado: 'aprobado', ordenId: orden.id } });
    } catch (error) {
      // El carrito se conserva para poder intentar de nuevo
      navegar('/checkout/resultado', { state: { resultado: 'rechazado', motivo: error.message } });
    }
  }

  return (
    <div className="contenedor compra">
      <EnlaceVista a="/checkout" className="compra__volver">
        ← Volver al resumen
      </EnlaceVista>
      <IndicadorPasos actual={3} />
      <h1 className="pagina__titulo">Pago</h1>

      <div className="compra__columnas">
        <section className="compra__panel" aria-labelledby="pago-tarjeta">
          <h2 id="pago-tarjeta" className="compra__subtitulo">
            Tarjeta de crédito o débito
          </h2>
          {!enLinea && (
            <p className="compra__alerta" role="alert">
              Estás sin conexión. Tu carrito se guardó; podrás pagar cuando vuelva la conexión.
            </p>
          )}
          <FormularioPago total={carrito.total} procesando={procesando} deshabilitado={!enLinea} onPagar={pagar} />
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
