// DUEÑO: Eddie. Módulo 2: gestión de eventos. Resultados de búsqueda.
// Props: { params, irA }  ·  params.busqueda: texto escrito en el buscador
import EnlaceVista from '../../components/EnlaceVista.jsx';
import CatalogoEventos from './CatalogoEventos.jsx';
import './ResultadosPage.css';

export default function ResultadosPage({ params, irA }) {
  const busqueda = params.busqueda ?? '';

  return (
    <div className="contenedor resultados">
      <EnlaceVista vista="inicio" irA={irA} className="resultados__volver">
        ← Volver al inicio
      </EnlaceVista>
      <h1 className="pagina__titulo">{busqueda ? `Resultados para “${busqueda}”` : 'Todos los eventos'}</h1>
      <CatalogoEventos busqueda={busqueda} irA={irA} tituloId="resultados-lista" titulo="Eventos encontrados" />
    </div>
  );
}
