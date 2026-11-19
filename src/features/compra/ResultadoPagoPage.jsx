// DUEÑO: Gabriel. Módulos 4, 5 y 6: proceso de compra, pagos y boletos electrónicos.
// MARCADOR: reemplaza todo el contenido de este archivo con tu pantalla.
// Props que recibe toda pantalla: { params, irA, sesion, carrito }
import MarcadorPantalla from '../../components/MarcadorPantalla.jsx';
import Boton from '../../components/Boton.jsx';

export default function ResultadoPagoPage({ params, irA }) {
  return (
    <MarcadorPantalla titulo="Resultado del pago" responsable="Gabriel" modulo="Sistema de pagos · Paso 4 de 4">
      <p>Resultado recibido: {params.resultado}</p>
      <Boton onClick={() => irA('mis-boletos')}>Ver mis boletos</Boton>
    </MarcadorPantalla>
  );
}
