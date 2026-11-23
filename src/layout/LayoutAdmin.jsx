// DUEÑO: Eddie. Estructura del panel de administración: barra lateral + contenido.
// Ruta de layout de /admin: dibuja la pantalla del panel con <Outlet />.
import { Outlet } from 'react-router';
import BarraLateralAdmin from './BarraLateralAdmin.jsx';
import './LayoutAdmin.css';

// Mueve el foco al contenido sin cambiar la URL
function saltarAlContenido(evento) {
  evento.preventDefault();
  document.getElementById('contenido')?.focus();
}

export default function LayoutAdmin() {
  return (
    <div className="layout-admin">
      <a href="#contenido" className="saltar-contenido" onClick={saltarAlContenido}>
        Saltar al contenido
      </a>
      <BarraLateralAdmin />
      <main id="contenido" className="layout-admin__contenido" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}
