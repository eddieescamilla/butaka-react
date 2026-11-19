// DUEÑO: Eddie. Estructura del sitio del cliente: encabezado, contenido y pie.
// Props: { vista, irA, sesion, carrito, children }
import Encabezado from './Encabezado.jsx';
import PiePagina from './PiePagina.jsx';
import './LayoutCliente.css';

// Mueve el foco al contenido sin cambiar la URL
function saltarAlContenido(evento) {
  evento.preventDefault();
  document.getElementById('contenido')?.focus();
}

export default function LayoutCliente({ vista, irA, sesion, carrito, children }) {
  return (
    <div className="layout-cliente">
      <a href="#contenido" className="saltar-contenido" onClick={saltarAlContenido}>
        Saltar al contenido
      </a>
      <Encabezado vista={vista} irA={irA} sesion={sesion} carrito={carrito} />
      <main id="contenido" className="layout-cliente__contenido" tabIndex={-1}>
        {children}
      </main>
      <PiePagina />
    </div>
  );
}
