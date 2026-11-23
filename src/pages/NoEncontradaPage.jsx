// PANTALLA COMPARTIDA. Ruta "*": se muestra cuando la dirección no existe.
import { useNavigate } from 'react-router';
import EstadoVacio from '../components/EstadoVacio.jsx';
import Boton from '../components/Boton.jsx';

export default function NoEncontradaPage() {
  const navegar = useNavigate();
  return (
    <div className="contenedor">
      <h1 className="sr-only">Página no encontrada</h1>
      <EstadoVacio titulo="Esta página no existe" mensaje="Puede que el enlace esté mal escrito o que la página se haya movido.">
        <Boton onClick={() => navegar('/')}>Volver al inicio</Boton>
      </EstadoVacio>
    </div>
  );
}
