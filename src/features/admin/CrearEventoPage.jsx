// DUEÑO: Eddie. Módulo 7: panel de administración. Crear o editar un evento.
// Rutas: /admin/eventos/nuevo y /admin/eventos/:id/editar (el id viene de useParams)
import { useNavigate, useParams } from 'react-router';
import EstadoCarga from '../../components/EstadoCarga.jsx';
import EstadoError from '../../components/EstadoError.jsx';
import Boton from '../../components/Boton.jsx';
import EncabezadoAdmin from './EncabezadoAdmin.jsx';
import FormularioEvento from './FormularioEvento.jsx';
import { eventosVisibles, useEventosAdmin } from './useEventosAdmin.js';
import { useSesion } from '../cuenta/useSesion.js';
import './Admin.css';

export default function CrearEventoPage() {
  const { id } = useParams();
  const navegar = useNavigate();
  const sesion = useSesion();
  const { eventos, cargando, error, reintentar, crearEvento, actualizarEvento } = useEventosAdmin();
  const esNuevo = !id;
  // Un organizador solo puede editar sus propios eventos
  const evento = esNuevo ? undefined : eventosVisibles(eventos, sesion.usuario).find((item) => item.id === id);

  async function guardar(datos) {
    if (esNuevo) {
      await crearEvento(datos, sesion.usuario.id);
      navegar('/admin/eventos', { state: { aviso: 'Evento creado con éxito' } });
    } else {
      await actualizarEvento(evento.id, datos);
      navegar('/admin/eventos', { state: { aviso: 'Cambios guardados' } });
    }
  }

  const encabezado = (
    <EncabezadoAdmin
      titulo={esNuevo ? 'Crear evento' : 'Editar evento'}
      subtitulo={
        esNuevo
          ? 'Completa los datos del evento. Podrás editarlos después.'
          : 'Las zonas y precios se editan en Inventario y precios.'
      }
    />
  );

  if (cargando) {
    return (
      <>
        {encabezado}
        <EstadoCarga />
      </>
    );
  }

  if (error) {
    return (
      <>
        {encabezado}
        <EstadoError titulo="No pudimos cargar el evento" mensaje={error} onReintentar={reintentar} />
      </>
    );
  }

  if (!esNuevo && !evento) {
    return (
      <>
        {encabezado}
        <EstadoError titulo="No encontramos este evento" mensaje="Puede que se haya eliminado o que no sea uno de tus eventos." />
        <Boton variante="secundario" onClick={() => navegar('/admin/eventos')}>
          Volver a eventos
        </Boton>
      </>
    );
  }

  return (
    <>
      {encabezado}
      <FormularioEvento inicial={evento} esNuevo={esNuevo} onGuardar={guardar} onCancelar={() => navegar('/admin/eventos')} />
    </>
  );
}
