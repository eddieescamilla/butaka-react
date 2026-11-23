// PANTALLA COMPARTIDA. La dibuja RutaProtegida cuando el rol no puede ver una sección.
import { useNavigate } from 'react-router';
import EstadoError from '../components/EstadoError.jsx';
import Boton from '../components/Boton.jsx';

export default function SinPermisoPage() {
  const navegar = useNavigate();
  return (
    <div className="contenedor">
      <h1 className="sr-only">Sin permiso</h1>
      <EstadoError
        titulo="No tienes permiso para ver esta sección"
        mensaje="El panel es para administradores y organizadores. Los reportes y los usuarios son solo para administradores."
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Boton variante="secundario" onClick={() => navegar('/')}>
          Volver al inicio
        </Boton>
      </div>
    </div>
  );
}
