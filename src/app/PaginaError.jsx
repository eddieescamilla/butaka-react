// ARCHIVO COMPARTIDO (congelado). errorElement de React Router: se muestra si
// una pantalla falla al dibujarse o si no se pudo descargar su código
// (por ejemplo, sin conexión y sin la pantalla guardada en caché).
import { isRouteErrorResponse, useRouteError } from 'react-router';
import EstadoError from '../components/EstadoError.jsx';

export default function PaginaError() {
  const error = useRouteError();
  const sinConexion = !navigator.onLine;

  let mensaje = 'Ocurrió un error inesperado al mostrar esta pantalla.';
  if (isRouteErrorResponse(error)) mensaje = `Error ${error.status}: ${error.statusText || 'la página no está disponible'}.`;
  if (sinConexion) mensaje = 'Estás sin conexión y esta pantalla todavía no se guardó en este dispositivo.';

  return (
    <div className="contenedor">
      <h1 className="sr-only">Error</h1>
      <EstadoError titulo="No pudimos mostrar esta pantalla" mensaje={mensaje} onReintentar={() => window.location.reload()} />
      <p style={{ textAlign: 'center' }}>
        <a href={import.meta.env.BASE_URL}>Volver al inicio</a>
      </p>
    </div>
  );
}
