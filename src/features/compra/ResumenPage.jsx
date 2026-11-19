// DUEÑO: Gabriel. Módulos 4, 5 y 6: proceso de compra, pagos y boletos electrónicos.
// MARCADOR: reemplaza todo el contenido de este archivo con tu pantalla.
// Props que recibe toda pantalla: { params, irA, sesion, carrito }
import MarcadorPantalla from '../../components/MarcadorPantalla.jsx';
import Boton from '../../components/Boton.jsx';

export default function ResumenPage({ irA }) {
  return (
    <MarcadorPantalla titulo="Resumen de compra" responsable="Gabriel" modulo="Proceso de compra · Paso 2 de 4">
      <Boton onClick={() => irA('pago')}>Ir a pagar</Boton>
    </MarcadorPantalla>
  );
}
