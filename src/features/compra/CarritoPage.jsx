// DUEÑO: Gabriel. Módulos 4, 5 y 6: proceso de compra, pagos y boletos electrónicos.
// MARCADOR: reemplaza todo el contenido de este archivo con tu pantalla.
// Props que recibe toda pantalla: { params, irA, sesion, carrito }
import MarcadorPantalla from '../../components/MarcadorPantalla.jsx';
import Boton from '../../components/Boton.jsx';
import { formatearPrecio } from '../../utils/formato.js';

export default function CarritoPage({ irA, carrito }) {
  return (
    <MarcadorPantalla titulo="Carrito" responsable="Gabriel" modulo="Proceso de compra · Paso 2 de 4">
      <ul>
        {carrito.items.map((item) => (
          <li key={item.clave}>
            {item.cantidad} × {item.eventoTitulo} · {item.zonaNombre}
          </li>
        ))}
      </ul>
      <p>Total: {formatearPrecio(carrito.total)}</p>
      <Boton onClick={() => irA('resumen')} disabled={carrito.items.length === 0}>
        Continuar
      </Boton>
      <Boton variante="texto" onClick={carrito.vaciar}>
        Vaciar carrito
      </Boton>
    </MarcadorPantalla>
  );
}
