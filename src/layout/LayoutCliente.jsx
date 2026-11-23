// DUEÑO: Eddie. Estructura del sitio del cliente: encabezado, contenido y pie.
// Es una ruta de layout: dibuja la pantalla hija con <Outlet />.
// También acepta children (la usa "Sin permiso" cuando un cliente entra a /admin).
import { Outlet } from 'react-router';
import Encabezado from './Encabezado.jsx';
import PiePagina from './PiePagina.jsx';
import './LayoutCliente.css';

// Mueve el foco al contenido sin cambiar la URL
function saltarAlContenido(evento) {
  evento.preventDefault();
  document.getElementById('contenido')?.focus();
}

export default function LayoutCliente({ children }) {
  return (
    <div className="layout-cliente">
      <a href="#contenido" className="saltar-contenido" onClick={saltarAlContenido}>
        Saltar al contenido
      </a>
      <Encabezado />
      <main id="contenido" className="layout-cliente__contenido" tabIndex={-1}>
        {children ?? <Outlet />}
      </main>
      <PiePagina />
    </div>
  );
}
