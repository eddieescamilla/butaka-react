// COMPONENTE COMPARTIDO (congelado). Enlace para moverse entre vistas sin
// recargar la página. Es un <a> real (funciona con teclado y lector de
// pantalla) que llama a irA en lugar de navegar.
// Props:
//   vista:     nombre de la vista de destino (ver src/rutas.js)
//   params:    parámetros de la vista (por ejemplo { eventoId: 'evt-001' })
//   irA:       la función que recibe cada pantalla por props
//   activo:    boolean → marca el enlace con aria-current="page"
//   className: clases CSS del dueño del componente que lo usa
import './EnlaceVista.css';

export default function EnlaceVista({ vista, params, irA, activo = false, className = '', children, ...resto }) {
  function alHacerClic(evento) {
    evento.preventDefault();
    irA(vista, params);
  }

  return (
    <a
      href={`#${vista}`}
      className={`enlace-vista ${className}`}
      aria-current={activo ? 'page' : undefined}
      onClick={alHacerClic}
      {...resto}
    >
      {children}
    </a>
  );
}
