// DUEÑO: Eddie. Estado de error de las pantallas del panel (API falsa sin respuesta).
import EstadoError from '../../components/EstadoError.jsx';

export default function ErrorPanel({ mensaje, onReintentar }) {
  return <EstadoError titulo="No pudimos cargar los datos del panel" mensaje={mensaje} onReintentar={onReintentar} />;
}
