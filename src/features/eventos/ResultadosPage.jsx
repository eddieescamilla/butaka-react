// DUEÑO: Eddie. Módulo 2: gestión de eventos.
// MARCADOR: reemplaza todo el contenido de este archivo con tu pantalla.
// Props que recibe toda pantalla: { params, irA, sesion, carrito }
import MarcadorPantalla from '../../components/MarcadorPantalla.jsx';
import Boton from '../../components/Boton.jsx';

export default function ResultadosPage({ params, irA }) {
  // params.busqueda trae el texto escrito en el buscador del encabezado
  return (
    <MarcadorPantalla titulo="Resultados de búsqueda" responsable="Eddie" modulo="Gestión de eventos">
      <p>Búsqueda recibida: “{params.busqueda || '(vacía)'}”</p>
      <Boton variante="secundario" onClick={() => irA('inicio')}>
        Volver al inicio
      </Boton>
    </MarcadorPantalla>
  );
}
