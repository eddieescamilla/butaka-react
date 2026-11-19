// DUEÑO: Eddie. Módulo 2: gestión de eventos.
// MARCADOR: reemplaza todo el contenido de este archivo con tu pantalla.
// Props que recibe toda pantalla: { params, irA, sesion, carrito }
import MarcadorPantalla from '../../components/MarcadorPantalla.jsx';
import Boton from '../../components/Boton.jsx';
import { EVENTOS } from '../../data/eventos.js';

export default function InicioPage({ irA }) {
  return (
    <MarcadorPantalla titulo="Inicio" responsable="Eddie" modulo="Gestión de eventos">
      <p>Accesos de prueba para recorrer el flujo:</p>
      <ul>
        {EVENTOS.slice(0, 4).map((evento) => (
          <li key={evento.id}>
            <Boton variante="texto" onClick={() => irA('detalle-evento', { eventoId: evento.id })}>
              Ver detalle: {evento.titulo}
            </Boton>
          </li>
        ))}
      </ul>
    </MarcadorPantalla>
  );
}
