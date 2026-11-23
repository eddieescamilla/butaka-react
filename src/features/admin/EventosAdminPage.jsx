// DUEÑO: Eddie. Módulo 7: panel de administración. Listado de eventos
// con crear, editar y eliminar (con modal de confirmación).
// Ruta: /admin/eventos (administrador u organizador)
// Si llega location.state.aviso (después de crear o editar), se muestra el toast.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { CATEGORIAS, ESTADOS_EVENTO } from '../../data/categorias.js';
import { formatearFecha, formatearNumero } from '../../utils/formato.js';
import { capacidadTotal, vendidosTotal } from '../../utils/eventos.js';
import Boton from '../../components/Boton.jsx';
import CampoTexto from '../../components/CampoTexto.jsx';
import EstadoCarga from '../../components/EstadoCarga.jsx';
import EstadoVacio from '../../components/EstadoVacio.jsx';
import EncabezadoAdmin from './EncabezadoAdmin.jsx';
import TablaDatos from './TablaDatos.jsx';
import ModalConfirmacion from './ModalConfirmacion.jsx';
import { eventosVisibles, useEventosAdmin } from './useEventosAdmin.js';
import { useAviso } from './useAviso.js';
import ErrorPanel from './ErrorPanel.jsx';
import { useSesion } from '../cuenta/useSesion.js';
import './Admin.css';

const FILTRO_CATEGORIAS = [{ valor: '', texto: 'Todas las categorías' }, ...CATEGORIAS.map((c) => ({ valor: c.id, texto: c.nombre }))];

export default function EventosAdminPage() {
  const sesion = useSesion();
  const navegar = useNavigate();
  const { eventos, cargando, error, reintentar, eliminarEvento } = useEventosAdmin();
  const { aviso, mostrarAviso, cerrarAviso } = useAviso();
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [porEliminar, setPorEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const filas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return eventosVisibles(eventos, sesion.usuario)
      .filter((evento) => !categoria || evento.categoria === categoria)
      .filter((evento) => !termino || evento.titulo.toLowerCase().includes(termino))
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  }, [eventos, sesion.usuario, busqueda, categoria]);

  async function confirmarEliminar() {
    setEliminando(true);
    try {
      await eliminarEvento(porEliminar.id);
      mostrarAviso('Evento eliminado');
      setPorEliminar(null);
    } catch (falla) {
      mostrarAviso(falla.message || 'No pudimos eliminar el evento. Inténtalo de nuevo.', 'error');
    } finally {
      setEliminando(false);
    }
  }

  const columnas = [
    { clave: 'titulo', titulo: 'Evento' },
    { clave: 'fecha', titulo: 'Fecha', render: (evento) => formatearFecha(evento.fecha) },
    {
      clave: 'vendidos',
      titulo: 'Boletos vendidos',
      render: (evento) => `${formatearNumero(vendidosTotal(evento))} / ${formatearNumero(capacidadTotal(evento))}`,
    },
    {
      clave: 'estado',
      titulo: 'Estado',
      render: (evento) => <span className={`admin-estado admin-estado--${evento.estado}`}>{ESTADOS_EVENTO[evento.estado]}</span>,
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      render: (evento) => (
        <span className="admin-acciones">
          <Boton
            variante="texto"
            tamano="pequeno"
            onClick={() => navegar(`/admin/eventos/${evento.id}/editar`)}
            aria-label={`Editar ${evento.titulo}`}
          >
            Editar
          </Boton>
          <Boton
            variante="texto"
            tamano="pequeno"
            onClick={() => navegar(`/admin/inventario?evento=${evento.id}`)}
            aria-label={`Zonas y precios de ${evento.titulo}`}
          >
            Precios
          </Boton>
          <Boton
            variante="texto"
            tamano="pequeno"
            className="admin-acciones__peligro"
            onClick={() => setPorEliminar(evento)}
            aria-label={`Eliminar ${evento.titulo}`}
          >
            Eliminar
          </Boton>
        </span>
      ),
    },
  ];

  return (
    <>
      <EncabezadoAdmin
        titulo="Eventos"
        subtitulo="Crea, edita y administra los eventos de la plataforma"
        aviso={aviso}
        onCerrarAviso={cerrarAviso}
        accion={<Boton onClick={() => navegar('/admin/eventos/nuevo')}>Crear evento</Boton>}
      />

      <div className="admin-filtros">
        <CampoTexto
          id="eventos-buscar"
          etiqueta="Buscar por nombre"
          type="search"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
        />
        <CampoTexto
          id="eventos-categoria"
          etiqueta="Categoría"
          opciones={FILTRO_CATEGORIAS}
          value={categoria}
          onChange={(evento) => setCategoria(evento.target.value)}
        />
      </div>

      <div className="admin-seccion">
        {cargando && <EstadoCarga mensaje="Cargando eventos…" />}
        {error && <ErrorPanel mensaje={error} onReintentar={reintentar} />}
        {!cargando && !error && filas.length === 0 && (
          <EstadoVacio
            titulo={busqueda || categoria ? 'Ningún evento coincide con los filtros' : 'Todavía no hay eventos'}
            mensaje={busqueda || categoria ? 'Cambia la búsqueda o la categoría.' : 'Crea el primer evento de la plataforma.'}
          />
        )}
        {!cargando && filas.length > 0 && <TablaDatos titulo="Lista de eventos" columnas={columnas} filas={filas} />}
      </div>

      <ModalConfirmacion
        abierto={porEliminar !== null}
        titulo="¿Deseas eliminar este evento?"
        mensaje={
          porEliminar
            ? `Vas a eliminar “${porEliminar.titulo}”. Esta acción no se puede deshacer y los compradores recibirán un aviso.`
            : ''
        }
        textoConfirmar="Sí, eliminar evento"
        procesando={eliminando}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  );
}
