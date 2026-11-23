// DUEÑO: Eddie. Módulo 2: gestión de eventos. Listado y búsqueda.
// Ruta: /eventos?q=texto  ·  el texto viene del buscador del encabezado.
// Como la búsqueda vive en la URL, se puede compartir, recargar y volver atrás.
import { useSearchParams } from 'react-router';
import EnlaceVista from '../../components/EnlaceVista.jsx';
import CatalogoEventos from './CatalogoEventos.jsx';
import './ResultadosPage.css';

export default function ResultadosPage() {
  const [parametros] = useSearchParams();
  const busqueda = parametros.get('q')?.trim() ?? '';

  return (
    <div className="contenedor resultados">
      <EnlaceVista a="/" className="resultados__volver">
        ← Volver al inicio
      </EnlaceVista>
      <h1 className="pagina__titulo">{busqueda ? `Resultados para “${busqueda}”` : 'Todos los eventos'}</h1>
      <CatalogoEventos busqueda={busqueda} tituloId="resultados-lista" titulo={busqueda ? 'Eventos encontrados' : 'Catálogo'} />
    </div>
  );
}
