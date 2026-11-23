// DUEÑO: Eddie. Módulo 3: inventario y precios. Zonas, precios y
// disponibilidad de cada evento.
// Ruta: /admin/inventario?evento=evt-001 (administrador u organizador)
// El evento elegido vive en la URL (useSearchParams): se puede recargar o compartir.
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { formatearFecha, formatearNumero, formatearPrecio } from '../../utils/formato.js';
import { disponiblesZona, estadoZona } from '../../utils/eventos.js';
import Boton from '../../components/Boton.jsx';
import CampoTexto from '../../components/CampoTexto.jsx';
import Modal from '../../components/Modal.jsx';
import EstadoCarga from '../../components/EstadoCarga.jsx';
import EstadoVacio from '../../components/EstadoVacio.jsx';
import EncabezadoAdmin from './EncabezadoAdmin.jsx';
import TablaDatos from './TablaDatos.jsx';
import ModalConfirmacion from './ModalConfirmacion.jsx';
import FormularioZona from './FormularioZona.jsx';
import { eventosVisibles, useEventosAdmin } from './useEventosAdmin.js';
import { useAviso } from './useAviso.js';
import ErrorPanel from './ErrorPanel.jsx';
import { useSesion } from '../cuenta/useSesion.js';
import './Admin.css';

const TEXTO_ESTADO_ZONA = { 'en-venta': 'Disponible', 'pocos-boletos': 'Pocos boletos', agotado: 'Agotado' };

export default function InventarioPage() {
  const sesion = useSesion();
  const [parametros, setParametros] = useSearchParams();
  const { eventos, cargando, error, reintentar, guardarZona, eliminarZona } = useEventosAdmin();
  const { aviso, mostrarAviso, cerrarAviso } = useAviso();
  const visibles = eventosVisibles(eventos, sesion.usuario).filter((evento) => evento.estado !== 'finalizado');
  const eventoId = parametros.get('evento') ?? '';
  // Sin elección, se muestra el primer evento de la lista (valor derivado)
  const evento = visibles.find((item) => item.id === eventoId) ?? visibles[0];

  // Modal de zona: null = cerrado · { zona: null } = agregar · { zona } = editar
  const [edicion, setEdicion] = useState(null);
  const [porEliminar, setPorEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  async function guardar(zona) {
    const esNueva = !evento.zonas.some((item) => item.id === zona.id);
    try {
      await guardarZona(evento.id, zona);
      setEdicion(null);
      mostrarAviso(esNueva ? 'Zona agregada' : 'Zona actualizada');
    } catch (falla) {
      mostrarAviso(falla.message || 'No pudimos guardar la zona. Inténtalo de nuevo.', 'error');
    }
  }

  async function confirmarEliminar() {
    setEliminando(true);
    try {
      await eliminarZona(evento.id, porEliminar.id);
      mostrarAviso('Zona eliminada');
      setPorEliminar(null);
    } catch (falla) {
      mostrarAviso(falla.message, 'error');
    } finally {
      setEliminando(false);
    }
  }

  const encabezado = (accion, subtitulo) => (
    <EncabezadoAdmin titulo="Inventario y precios" subtitulo={subtitulo} aviso={aviso} onCerrarAviso={cerrarAviso} accion={accion} />
  );

  if (cargando) {
    return (
      <>
        {encabezado(null, 'Zonas, precios y disponibilidad por evento')}
        <EstadoCarga />
      </>
    );
  }

  if (error) {
    return (
      <>
        {encabezado(null, 'Zonas, precios y disponibilidad por evento')}
        <ErrorPanel mensaje={error} onReintentar={reintentar} />
      </>
    );
  }

  if (!evento) {
    return (
      <>
        {encabezado(null, 'Zonas, precios y disponibilidad por evento')}
        <EstadoVacio titulo="No hay eventos para administrar" mensaje="Crea un evento para definir sus zonas y precios." />
      </>
    );
  }

  const columnas = [
    { clave: 'nombre', titulo: 'Zona' },
    { clave: 'precio', titulo: 'Precio', render: (zona) => formatearPrecio(zona.precio) },
    {
      clave: 'vendidos',
      titulo: 'Boletos vendidos',
      render: (zona) => `${formatearNumero(zona.vendidos)} / ${formatearNumero(zona.capacidad)}`,
    },
    { clave: 'disponibles', titulo: 'Disponibles', render: (zona) => formatearNumero(disponiblesZona(zona)) },
    {
      clave: 'estado',
      titulo: 'Estado',
      render: (zona) => {
        const estado = estadoZona(zona);
        return <span className={`admin-estado admin-estado--${estado}`}>{TEXTO_ESTADO_ZONA[estado]}</span>;
      },
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      render: (zona) => {
        const bloqueada = zona.vendidos > 0 || evento.zonas.length === 1;
        return (
          <span className="admin-acciones">
            <Boton variante="texto" tamano="pequeno" onClick={() => setEdicion({ zona })} aria-label={`Editar zona ${zona.nombre}`}>
              Editar
            </Boton>
            <Boton
              variante="texto"
              tamano="pequeno"
              className="admin-acciones__peligro"
              disabled={bloqueada}
              title={bloqueada ? 'No se puede eliminar una zona con boletos vendidos ni la única zona del evento' : undefined}
              onClick={() => setPorEliminar(zona)}
              aria-label={`Eliminar zona ${zona.nombre}`}
            >
              Eliminar
            </Boton>
          </span>
        );
      },
    },
  ];

  return (
    <>
      {encabezado(
        <Boton onClick={() => setEdicion({ zona: null })}>Agregar zona</Boton>,
        `${evento.titulo} · ${formatearFecha(evento.fecha)} · ${evento.lugar}`,
      )}

      <div className="admin-filtros">
        <CampoTexto
          id="inventario-evento"
          etiqueta="Evento"
          opciones={visibles.map((item) => ({ valor: item.id, texto: item.titulo }))}
          value={evento.id}
          onChange={(e) => setParametros({ evento: e.target.value }, { replace: true })}
        />
      </div>

      <div className="admin-seccion">
        <TablaDatos titulo={`Zonas de ${evento.titulo}`} columnas={columnas} filas={evento.zonas} />
        <p className="pagina__subtitulo">Las zonas con boletos vendidos no se pueden eliminar; solo puedes cambiar su precio o ampliar su capacidad.</p>
      </div>

      <Modal abierto={edicion !== null} titulo={edicion?.zona ? `Editar zona ${edicion.zona.nombre}` : 'Agregar zona'} onCerrar={() => setEdicion(null)}>
        {edicion && (
          <FormularioZona
            key={edicion.zona?.id ?? 'nueva'}
            zona={edicion.zona}
            todas={evento.zonas}
            onGuardar={guardar}
            onCancelar={() => setEdicion(null)}
          />
        )}
      </Modal>

      <ModalConfirmacion
        abierto={porEliminar !== null}
        titulo="¿Deseas eliminar esta zona?"
        mensaje={porEliminar ? `Vas a eliminar la zona “${porEliminar.nombre}” de ${evento.titulo}.` : ''}
        textoConfirmar="Sí, eliminar zona"
        procesando={eliminando}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  );
}
