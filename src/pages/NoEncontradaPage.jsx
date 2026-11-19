// PANTALLA COMPARTIDA. Se muestra cuando se pide una vista que no existe.
import EstadoVacio from '../components/EstadoVacio.jsx';
import Boton from '../components/Boton.jsx';

export default function NoEncontradaPage({ irA }) {
  return (
    <div className="contenedor">
      <h1 className="sr-only">Página no encontrada</h1>
      <EstadoVacio titulo="Esta página no existe" mensaje="Puede que el enlace esté mal escrito o que la página se haya movido.">
        <Boton onClick={() => irA('inicio')}>Volver al inicio</Boton>
      </EstadoVacio>
    </div>
  );
}
