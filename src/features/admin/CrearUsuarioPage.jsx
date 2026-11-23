// DUEÑO: Eddie. Módulo 7: panel de administración. Crear o editar un usuario.
// Rutas: /admin/usuarios/nuevo y /admin/usuarios/:id/editar (solo administrador)
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Aviso from '../../components/Aviso.jsx';
import EstadoCarga from '../../components/EstadoCarga.jsx';
import EstadoError from '../../components/EstadoError.jsx';
import Boton from '../../components/Boton.jsx';
import EncabezadoAdmin from './EncabezadoAdmin.jsx';
import FormularioUsuario from './FormularioUsuario.jsx';
import { useUsuariosAdmin } from './useUsuariosAdmin.js';
import './Admin.css';

export default function CrearUsuarioPage() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { usuarios, cargando, error, reintentar, crearUsuario, actualizarUsuario } = useUsuariosAdmin();
  const [errorGuardar, setErrorGuardar] = useState('');
  const esNuevo = !id;
  const usuario = esNuevo ? undefined : usuarios.find((item) => item.id === id);
  const otrosUsuarios = usuarios.filter((item) => item.id !== id);

  async function guardar(datos) {
    setErrorGuardar('');
    try {
      if (esNuevo) {
        await crearUsuario(datos);
        navegar('/admin/usuarios', { state: { aviso: 'Usuario creado con éxito' } });
      } else {
        await actualizarUsuario(usuario.id, datos);
        navegar('/admin/usuarios', { state: { aviso: 'Cambios guardados' } });
      }
    } catch (falla) {
      setErrorGuardar(falla.message);
      throw falla; // el formulario vuelve a habilitar el botón
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

  if (error) {
    return (
      <>
        {encabezado}
        <EstadoError titulo="No pudimos cargar los usuarios" mensaje={error} onReintentar={reintentar} />
      </>
    );
  }

  if (!esNuevo && !usuario) {
    return (
      <>
        {encabezado}
        <EstadoError titulo="No encontramos este usuario" />
        <Boton variante="secundario" onClick={() => navegar('/admin/usuarios')}>
          Volver a usuarios
        </Boton>
      </>
    );
  }

  return (
    <>
      {encabezado}
      {errorGuardar && <Aviso tipo="error" mensaje={errorGuardar} duracion={0} onCerrar={() => setErrorGuardar('')} />}
      <FormularioUsuario inicial={usuario} otrosUsuarios={otrosUsuarios} onGuardar={guardar} onCancelar={() => navegar('/admin/usuarios')} />
    </>
  );
}
