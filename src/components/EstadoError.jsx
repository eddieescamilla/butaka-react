// COMPONENTE COMPARTIDO (congelado). Se muestra cuando falla una operación simulada.
// Props:
//   titulo:       por defecto "Algo salió mal"
//   mensaje:      texto comprensible del error
//   onReintentar: si se pasa, aparece el botón "Reintentar"
import Boton from './Boton.jsx';
import './Estados.css';

export default function EstadoError({ titulo = 'Algo salió mal', mensaje, onReintentar }) {
  return (
    <div className="estado estado--error" role="alert">
      <span className="estado__icono" aria-hidden="true">
        !
      </span>
      <h2 className="estado__titulo">{titulo}</h2>
      {mensaje && <p className="estado__texto">{mensaje}</p>}
      {onReintentar && (
        <div className="estado__accion">
          <Boton variante="secundario" onClick={onReintentar}>
            Reintentar
          </Boton>
        </div>
      )}
    </div>
  );
}
