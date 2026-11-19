// DUEÑO: Eddie. Módulo 7: panel de administración. Crear o editar un usuario.
// Props: { params, irA }  ·  params.usuarioId: si viene, se edita ese usuario
import EstadoCarga from '../../components/EstadoCarga.jsx';
import EstadoError from '../../components/EstadoError.jsx';
import Boton from '../../components/Boton.jsx';
import EncabezadoAdmin from './EncabezadoAdmin.jsx';
import FormularioUsuario from './FormularioUsuario.jsx';
import { useUsuariosAdmin } from './useUsuariosAdmin.js';
import './Admin.css';

export default function CrearUsuarioPage({ params, irA }) {
  const { usuarios, cargando, crearUsuario, actualizarUsuario } = useUsuariosAdmin();
  const esNuevo = !params.usuarioId;
  const usuario = esNuevo ? undefined : usuarios.find((item) => item.id === params.usuarioId);
  const otrosUsuarios = usuarios.filter((item) => item.id !== params.usuarioId);

  async function guardar(datos) {
    if (esNuevo) {
      await crearUsuario(datos);
      irA('admin-usuarios', { aviso: 'Usuario creado con éxito' });
    } else {
      await actualizarUsuario(usuario.id, datos);
      irA('admin-usuarios', { aviso: 'Cambios guardados' });
    }
  }

  const encabezado = (
    <EncabezadoAdmin
      titulo={esNuevo ? 'Crear usuario' : 'Editar usuario'}
      subtitulo={esNuevo ? 'Completa los datos del usuario. Podrás editarlos después.' : 'Actualiza los datos de la cuenta.'}
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

  if (!esNuevo && !usuario) {
    return (
      <>
        {encabezado}
        <EstadoError titulo="No encontramos este usuario" />
        <Boton variante="secundario" onClick={() => irA('admin-usuarios')}>
          Volver a usuarios
        </Boton>
      </>
    );
  }

  return (
    <>
      {encabezado}
      <FormularioUsuario inicial={usuario} otrosUsuarios={otrosUsuarios} onGuardar={guardar} onCancelar={() => irA('admin-usuarios')} />
    </>
  );
}
