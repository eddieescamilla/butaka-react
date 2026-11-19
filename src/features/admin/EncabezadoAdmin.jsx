// DUEÑO: Eddie. Encabezado de cada pantalla del panel: título, subtítulo,
// aviso de confirmación (toast) y botón de acción principal.
// Props:
//   titulo, subtitulo
//   accion:   nodo opcional (por ejemplo <Boton>Crear evento</Boton>)
//   aviso:    { tipo, mensaje } o null
//   onCerrarAviso: función para cerrar el aviso
import Aviso from '../../components/Aviso.jsx';
import './EncabezadoAdmin.css';

export default function EncabezadoAdmin({ titulo, subtitulo, accion, aviso, onCerrarAviso }) {
  return (
    <header className="encabezado-admin">
      <div className="encabezado-admin__textos">
        <h1 className="pagina__titulo">{titulo}</h1>
        {subtitulo && <p className="pagina__subtitulo">{subtitulo}</p>}
      </div>
      {/* La región existe siempre para que el lector de pantalla anuncie el aviso */}
      <div className="encabezado-admin__aviso" aria-live="polite">
        {aviso && <Aviso tipo={aviso.tipo} mensaje={aviso.mensaje} onCerrar={onCerrarAviso} />}
      </div>
      {accion && <div className="encabezado-admin__accion">{accion}</div>}
    </header>
  );
}
