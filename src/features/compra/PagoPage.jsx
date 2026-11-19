// DUEÑO: Gabriel. Módulos 4, 5 y 6: proceso de compra, pagos y boletos electrónicos.
// MARCADOR: reemplaza todo el contenido de este archivo con tu pantalla.
// Props que recibe toda pantalla: { params, irA, sesion, carrito }
import MarcadorPantalla from '../../components/MarcadorPantalla.jsx';
import Boton from '../../components/Boton.jsx';

export default function PagoPage({ irA }) {
  return (
    <MarcadorPantalla titulo="Pago" responsable="Gabriel" modulo="Sistema de pagos · Paso 3 de 4">
      <Boton onClick={() => irA('resultado-pago', { resultado: 'aprobado' })}>Simular pago aprobado</Boton>
      <Boton variante="secundario" onClick={() => irA('resultado-pago', { resultado: 'rechazado' })}>
        Simular pago rechazado
      </Boton>
    </MarcadorPantalla>
  );
}
