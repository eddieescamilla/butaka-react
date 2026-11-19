// DUEÑO: Eddie. Módulo 7: panel de administración. Crear o editar un evento.
// Props: { params, irA, sesion }  ·  params.eventoId: si viene, se edita ese evento
import EstadoCarga from '../../components/EstadoCarga.jsx';
import EstadoError from '../../components/EstadoError.jsx';
import Boton from '../../components/Boton.jsx';
import EncabezadoAdmin from './EncabezadoAdmin.jsx';
import FormularioEvento from './FormularioEvento.jsx';
import { useEventosAdmin } from './useEventosAdmin.js';
import './Admin.css';

export default function CrearEventoPage({ params, irA, sesion }) {
  const { eventos, cargando, crearEvento, actualizarEvento } = useEventosAdmin();
  const esNuevo = !params.eventoId;
  const evento = esNuevo ? undefined : eventos.find((item) => item.id === params.eventoId);

  async function guardar(datos) {
    if (esNuevo) {
      await crearEvento(datos, sesion.usuario.id);
      irA('admin-eventos', { aviso: 'Evento creado con éxito' });
    } else {
      await actualizarEvento(evento.id, datos);
      irA('admin-eventos', { aviso: 'Cambios guardados' });
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

  if (!esNuevo && !evento) {
    return (
      <>
        {encabezado}
        <EstadoError titulo="No encontramos este evento" mensaje="Puede que se haya eliminado." />
        <Boton variante="secundario" onClick={() => irA('admin-eventos')}>
          Volver a eventos
        </Boton>
      </>
    );
  }

  return (
    <>
      {encabezado}
      <FormularioEvento inicial={evento} esNuevo={esNuevo} onGuardar={guardar} onCancelar={() => irA('admin-eventos')} />
    </>
  );
}
