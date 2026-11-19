// COMPONENTE COMPARTIDO (congelado). Se muestra mientras una operación simulada carga.
// Props:
//   mensaje: texto visible (por defecto "Cargando…")
import './Estados.css';

export default function EstadoCarga({ mensaje = 'Cargando…' }) {
  return (
    <div className="estado" role="status">
      <span className="estado__indicador" aria-hidden="true" />
      <p className="estado__texto">{mensaje}</p>
    </div>
  );
}
