// DUEÑO: Eddie. Módulo 7: panel de administración. Usuarios.
// Ruta: /admin/usuarios (solo administrador)
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ROLES } from '../../data/categorias.js';
import Boton from '../../components/Boton.jsx';
import CampoTexto from '../../components/CampoTexto.jsx';
import EstadoCarga from '../../components/EstadoCarga.jsx';
import EstadoVacio from '../../components/EstadoVacio.jsx';
import EncabezadoAdmin from './EncabezadoAdmin.jsx';
import TablaDatos from './TablaDatos.jsx';
import { useUsuariosAdmin } from './useUsuariosAdmin.js';
import { useAviso } from './useAviso.js';
import ErrorPanel from './ErrorPanel.jsx';
import { useSesion } from '../cuenta/useSesion.js';
import './Admin.css';

const FILTRO_ROLES = [{ valor: '', texto: 'Todos los roles' }, ...Object.entries(ROLES).map(([valor, texto]) => ({ valor, texto }))];

export default function UsuariosPage() {
  const sesion = useSesion();
  const navegar = useNavigate();
  const { usuarios, cargando, error, reintentar, cambiarEstado } = useUsuariosAdmin();
  const { aviso, mostrarAviso, cerrarAviso } = useAviso();
  const [busqueda, setBusqueda] = useState('');
  const [rol, setRol] = useState('');
  const [procesandoId, setProcesandoId] = useState(null);

  const filas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return usuarios
      .filter((usuario) => !rol || usuario.rol === rol)
      .filter(
        (usuario) =>
          !termino || `${usuario.nombre} ${usuario.apellido} ${usuario.correo}`.toLowerCase().includes(termino),
      );
  }, [usuarios, busqueda, rol]);

  async function alternarEstado(usuario) {
    if (procesandoId) return; // una operación a la vez
    setProcesandoId(usuario.id);
    try {
      await cambiarEstado(usuario.id);
      mostrarAviso(usuario.estado === 'activo' ? 'Usuario desactivado' : 'Usuario activado');
    } catch (falla) {
      mostrarAviso(falla.message, 'error');
    } finally {
      setProcesandoId(null);
    }
  }

  const columnas = [
    { clave: 'nombre', titulo: 'Nombre', render: (u) => `${u.nombre} ${u.apellido}` },
    { clave: 'correo', titulo: 'Correo' },
    { clave: 'rol', titulo: 'Rol', render: (u) => ROLES[u.rol] },
    {
      clave: 'estado',
      titulo: 'Estado',
      render: (u) => <span className={`admin-estado admin-estado--${u.estado}`}>{u.estado === 'activo' ? 'Activo' : 'Inactivo'}</span>,
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      render: (u) => {
        const esUnoMismo = u.id === sesion.usuario?.id;
        return (
          <span className="admin-acciones">
            <Boton variante="texto" tamano="pequeno" onClick={() => navegar(`/admin/usuarios/${u.id}/editar`)} aria-label={`Editar a ${u.nombre} ${u.apellido}`}>
              Editar
            </Boton>
            <Boton
              variante="texto"
              tamano="pequeno"
              className={u.estado === 'activo' ? 'admin-acciones__peligro' : undefined}
              disabled={esUnoMismo || (procesandoId !== null && procesandoId !== u.id)}
              cargando={procesandoId === u.id}
              title={esUnoMismo ? 'No puedes desactivar tu propia cuenta' : undefined}
              onClick={() => alternarEstado(u)}
              aria-label={`${u.estado === 'activo' ? 'Desactivar' : 'Activar'} a ${u.nombre} ${u.apellido}`}
            >
              {u.estado === 'activo' ? 'Desactivar' : 'Activar'}
            </Boton>
          </span>
        );
      },
    },
  ];

  return (
    <>
      <EncabezadoAdmin
        titulo="Usuarios"
        subtitulo="Consulta y administra las cuentas de clientes, organizadores y administradores"
        aviso={aviso}
        onCerrarAviso={cerrarAviso}
        accion={<Boton onClick={() => navegar('/admin/usuarios/nuevo')}>Agregar usuario</Boton>}
      />

      <div className="admin-filtros">
        <CampoTexto id="usuarios-buscar" etiqueta="Buscar por nombre o correo" type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        <CampoTexto id="usuarios-rol" etiqueta="Rol" opciones={FILTRO_ROLES} value={rol} onChange={(e) => setRol(e.target.value)} />
      </div>

      <div className="admin-seccion">
        {cargando && <EstadoCarga mensaje="Cargando usuarios…" />}
        {error && <ErrorPanel mensaje={error} onReintentar={reintentar} />}
        {!cargando && !error && filas.length === 0 && <EstadoVacio titulo="Ningún usuario coincide" mensaje="Cambia la búsqueda o el rol." />}
        {!cargando && filas.length > 0 && <TablaDatos titulo="Lista de usuarios" columnas={columnas} filas={filas} />}
      </div>
    </>
  );
}
