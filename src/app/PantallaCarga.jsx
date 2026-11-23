// ARCHIVO COMPARTIDO (congelado). Se muestra solo en la primera carga,
// mientras React Router descarga la pantalla de la ruta (carga diferida).
import EstadoCarga from '../components/EstadoCarga.jsx';
import './Raiz.css';

export default function PantallaCarga() {
  return (
    <div className="pantalla-carga">
      <EstadoCarga mensaje="Cargando Butaka…" />
    </div>
  );
}
