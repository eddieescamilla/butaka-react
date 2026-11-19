// DUEÑO: Gabriel. Módulos 4, 5 y 6: proceso de compra, pagos y boletos electrónicos.
// MARCADOR: reemplaza todo el contenido de este archivo con tu pantalla.
// Props que recibe toda pantalla: { params, irA, sesion, carrito }
import MarcadorPantalla from '../../components/MarcadorPantalla.jsx';
import Boton from '../../components/Boton.jsx';

export default function MisBoletosPage({ irA }) {
  return (
    <MarcadorPantalla titulo="Mis boletos" responsable="Gabriel" modulo="Boletos electrónicos">
      <Boton variante="texto" onClick={() => irA('boleto', { codigo: 'BTK-1001-01' })}>
        Ver boleto BTK-1001-01
      </Boton>
    </MarcadorPantalla>
  );
}
