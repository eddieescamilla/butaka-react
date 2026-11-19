// DUEÑO: Gabriel. Módulos 4, 5 y 6: proceso de compra, pagos y boletos electrónicos.
// MARCADOR: reemplaza todo el contenido de este archivo con tu pantalla.
// Props que recibe toda pantalla: { params, irA, sesion, carrito }
import MarcadorPantalla from '../../components/MarcadorPantalla.jsx';
import Boton from '../../components/Boton.jsx';

export default function BoletoPage({ params, irA }) {
  return (
    <MarcadorPantalla titulo="Boleto" responsable="Gabriel" modulo="Boletos electrónicos">
      <p>Código recibido: {params.codigo}</p>
      <Boton variante="secundario" onClick={() => irA('mis-boletos')}>
        Volver a mis boletos
      </Boton>
    </MarcadorPantalla>
  );
}
