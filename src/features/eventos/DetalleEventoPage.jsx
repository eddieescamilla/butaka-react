// DUEÑO: Eddie. Módulo 2: gestión de eventos.
// MARCADOR: reemplaza todo el contenido de este archivo con tu pantalla.
// Props que recibe toda pantalla: { params, irA, sesion, carrito }
import MarcadorPantalla from '../../components/MarcadorPantalla.jsx';
import Boton from '../../components/Boton.jsx';

export default function DetalleEventoPage({ params, irA }) {
  // params.eventoId trae el id del evento (por ejemplo 'evt-001').
  // El botón "Comprar boletos" debe llamar a irA('seleccion', { eventoId }).
  return (
    <MarcadorPantalla titulo="Detalle del evento" responsable="Eddie" modulo="Gestión de eventos">
      <p>Evento recibido: {params.eventoId}</p>
      <Boton onClick={() => irA('seleccion', { eventoId: params.eventoId })}>Comprar boletos</Boton>
    </MarcadorPantalla>
  );
}
