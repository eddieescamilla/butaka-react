// PANTALLA COMPARTIDA. Se muestra cuando el rol del usuario no puede ver una vista.
import EstadoError from '../components/EstadoError.jsx';
import Boton from '../components/Boton.jsx';

export default function SinPermisoPage({ irA }) {
  return (
    <div className="contenedor">
      <h1 className="sr-only">Sin permiso</h1>
      <EstadoError
        titulo="No tienes permiso para ver esta sección"
        mensaje="El panel de administración es solo para administradores y organizadores."
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Boton variante="secundario" onClick={() => irA('inicio')}>
          Volver al inicio
        </Boton>
      </div>
    </div>
  );
}
