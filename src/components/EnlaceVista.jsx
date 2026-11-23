// COMPONENTE COMPARTIDO (congelado). Enlace entre pantallas sin recargar la página.
// Es un <Link> de React Router: un <a> real (teclado, lector de pantalla,
// clic con la rueda para abrir en otra pestaña) con la ruta completa en href.
// Para menús que marcan la página activa se usa <NavLink> directamente.
// Props:
//   a:         ruta de destino, por ejemplo "/eventos/evt-001"
//   estado:    datos que viajan con la navegación (location.state)
//   activo:    boolean → marca el enlace con aria-current="page"
//   className: clases CSS del dueño del componente que lo usa
import { Link } from 'react-router';
import './EnlaceVista.css';

export default function EnlaceVista({ a, estado, activo = false, className = '', children, ...resto }) {
  return (
    <Link
      to={a}
      state={estado}
      className={`enlace-vista ${className}`}
      aria-current={activo ? 'page' : undefined}
      {...resto}
    >
      {children}
    </Link>
  );
}
