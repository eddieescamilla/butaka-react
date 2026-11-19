// COMPONENTE COMPARTIDO (congelado). Se muestra cuando no hay resultados.
// Props:
//   titulo:   por ejemplo "No encontramos eventos"
//   mensaje:  sugerencia para el usuario
//   children: acción opcional (por ejemplo, un <Boton> "Ver todos los eventos")
import './Estados.css';

export default function EstadoVacio({ titulo, mensaje, children }) {
  return (
    <div className="estado">
      <span className="estado__icono" aria-hidden="true">
        ○
      </span>
      <h2 className="estado__titulo">{titulo}</h2>
      {mensaje && <p className="estado__texto">{mensaje}</p>}
      {children && <div className="estado__accion">{children}</div>}
    </div>
  );
}
