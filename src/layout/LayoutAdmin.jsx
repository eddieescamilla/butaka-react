// DUEÑO: Eddie. Estructura del panel de administración: barra lateral + contenido.
// Props: { vista, irA, sesion, carrito, children }
import BarraLateralAdmin from './BarraLateralAdmin.jsx';
import './LayoutAdmin.css';

// Mueve el foco al contenido sin cambiar la URL
function saltarAlContenido(evento) {
  evento.preventDefault();
  document.getElementById('contenido')?.focus();
}

export default function LayoutAdmin({ vista, irA, sesion, children }) {
  return (
    <div className="layout-admin">
      <a href="#contenido" className="saltar-contenido" onClick={saltarAlContenido}>
        Saltar al contenido
      </a>
      <BarraLateralAdmin vista={vista} irA={irA} sesion={sesion} />
      <main id="contenido" className="layout-admin__contenido" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
