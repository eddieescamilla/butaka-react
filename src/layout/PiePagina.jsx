// DUEÑO: Eddie. Pie de página del sitio del cliente.
import Logo from '../components/Logo.jsx';
import './PiePagina.css';

export default function PiePagina() {
  return (
    <footer className="pie">
      <div className="contenedor pie__contenido">
        <Logo />
        <p className="pie__texto">© 2026 Butaka · Prototipo académico UCA</p>
      </div>
    </footer>
  );
}
