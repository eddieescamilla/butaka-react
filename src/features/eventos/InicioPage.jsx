// DUEÑO: Eddie. Módulo 2: gestión de eventos. Pantalla de inicio.
// Props: { irA }
import Boton from '../../components/Boton.jsx';
import CatalogoEventos from './CatalogoEventos.jsx';
import './InicioPage.css';

export default function InicioPage({ irA }) {
  function irAlListado() {
    document.getElementById('eventos-titulo')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="contenedor inicio">
      <section className="inicio__hero" aria-labelledby="hero-titulo">
        <h1 id="hero-titulo" className="inicio__hero-titulo">
          Tu lugar te espera.
        </h1>
        <p className="inicio__hero-texto">
          Conciertos, teatro y deportes en un solo lugar. Elige tu zona, paga en línea y recibe tu boleto con
          código QR al instante.
        </p>
        <Boton onClick={irAlListado}>Explorar eventos</Boton>
      </section>

      <CatalogoEventos irA={irA} tituloId="eventos-titulo" titulo="Próximos eventos" />
    </div>
  );
}
