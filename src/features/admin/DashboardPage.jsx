// DUEÑO: Eddie. Módulo 7: panel de administración. Dashboard.
// Ruta: /admin (administrador u organizador).
// Los indicadores se calculan con las órdenes de la API falsa: este mes contra
// el anterior. Un organizador solo ve las ventas de sus propios eventos.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ESTADOS_EVENTO } from '../../data/categorias.js';
import { listarOrdenes } from '../../api/ordenes.js';
import { listarUsuarios } from '../../api/usuarios.js';
import { restablecerDatos } from '../../api/cliente.js';
import { usePeticion } from '../../hooks/usePeticion.js';
import { formatearFecha, formatearNumero, formatearPrecio } from '../../utils/formato.js';
import { capacidadTotal, vendidosTotal } from '../../utils/eventos.js';
import EstadoCarga from '../../components/EstadoCarga.jsx';
import EstadoVacio from '../../components/EstadoVacio.jsx';
import Boton from '../../components/Boton.jsx';
import EncabezadoAdmin from './EncabezadoAdmin.jsx';
import TarjetaMetrica from './TarjetaMetrica.jsx';
import TablaDatos from './TablaDatos.jsx';
import GraficoBarras from './GraficoBarras.jsx';
import ModalConfirmacion from './ModalConfirmacion.jsx';
import ErrorPanel from './ErrorPanel.jsx';
import { eventosVisibles, useEventosAdmin } from './useEventosAdmin.js';
import { filtrarOrdenes, porMes, resumen, variacion } from './analitica.js';
import { useSesion } from '../cuenta/useSesion.js';
import './Admin.css';

const COLUMNAS = [
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
];

const NOMBRE_MES = new Intl.DateTimeFormat('es-SV', { month: 'long', year: 'numeric' });

export default function DashboardPage() {
  const { usuario } = useSesion();
  const navegar = useNavigate();
  const { eventos, cargando, error, reintentar } = useEventosAdmin();
  const extra = usePeticion((signal) => Promise.all([listarOrdenes({}, { signal }), listarUsuarios({ signal })]), []);
  const [confirmarReinicio, setConfirmarReinicio] = useState(false);

  const visibles = useMemo(() => eventosVisibles(eventos, usuario), [eventos, usuario]);

  // Valores derivados: indicadores de este mes y del anterior
  const indicadores = useMemo(() => {
    if (!extra.datos) return null;
    const [ordenes, usuarios] = extra.datos;
    const eventosIds = new Set(visibles.map((evento) => evento.id));
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const inicioAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const actual = resumen(filtrarOrdenes(ordenes, { desde: inicioMes, eventosIds }));
    const anterior = resumen(filtrarOrdenes(ordenes, { desde: inicioAnterior, hasta: new Date(inicioMes.getTime() - 1), eventosIds }));
    const inicioSemestre = new Date(hoy.getFullYear(), hoy.getMonth() - 5, 1);
    return {
      periodo: NOMBRE_MES.format(hoy),
      actual,
      anterior,
      meses: porMes(filtrarOrdenes(ordenes, { desde: inicioSemestre, eventosIds }), { desde: inicioSemestre, hasta: hoy }),
      clientes: usuarios.filter((u) => u.rol === 'cliente').length,
      nuevosClientes: usuarios.filter((u) => u.rol === 'cliente' && new Date(u.creado) >= inicioMes).length,
    };
  }, [extra.datos, visibles]);

  // Próximos 5 eventos que siguen activos
  const proximos = useMemo(
    () =>
      visibles
        .filter((evento) => evento.estado !== 'cancelado' && evento.estado !== 'finalizado')
        .filter((evento) => new Date(evento.fecha) >= new Date())
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .slice(0, 5),
    [visibles],
  );
  const activos = visibles.filter((evento) => evento.estado === 'en-venta' || evento.estado === 'pocos-boletos').length;

  function reiniciarDemo() {
    restablecerDatos();
    window.location.reload();
  }

  const a = indicadores?.actual;
  const b = indicadores?.anterior;

  return (
    <>
      <EncabezadoAdmin
        titulo="Dashboard"
        subtitulo={indicadores ? `Resumen de ventas · ${indicadores.periodo}` : 'Resumen de ventas'}
        accion={
          usuario.rol === 'admin' && (
            <Boton variante="secundario" tamano="pequeno" onClick={() => setConfirmarReinicio(true)}>
              Restablecer datos de demostración
            </Boton>
          )
        }
      />

      {(error || extra.estado === 'error') && <ErrorPanel mensaje={error ?? extra.error} onReintentar={error ? reintentar : extra.reintentar} />}

      <section aria-labelledby="dashboard-metricas">
        <h2 id="dashboard-metricas" className="sr-only">
          Indicadores del mes
        </h2>
        {!indicadores && extra.estado === 'cargando' && <EstadoCarga mensaje="Calculando indicadores…" />}
        {indicadores && (
          <div className="admin-metricas">
            <TarjetaMetrica
              etiqueta="Boletos vendidos este mes"
              valor={formatearNumero(a.boletos)}
              detalle={variacion(a.boletos, b.boletos)}
              tendencia={a.boletos >= b.boletos ? 'positiva' : 'negativa'}
            />
            <TarjetaMetrica
              etiqueta="Ingresos este mes"
              valor={formatearPrecio(a.ingresos)}
              detalle={variacion(a.ingresos, b.ingresos)}
              tendencia={a.ingresos >= b.ingresos ? 'positiva' : 'negativa'}
            />
            <TarjetaMetrica etiqueta="Eventos activos" valor={formatearNumero(activos)} detalle={`${formatearNumero(visibles.length)} eventos en total`} tendencia="neutra" />
            <TarjetaMetrica
              etiqueta="Clientes registrados"
              valor={formatearNumero(indicadores.clientes)}
              detalle={`${indicadores.nuevosClientes} ${indicadores.nuevosClientes === 1 ? "nuevo" : "nuevos"} este mes`}
              tendencia="neutra"
            />
          </div>
        )}
      </section>

      <section className="admin-seccion" aria-labelledby="dashboard-proximos">
        <h2 id="dashboard-proximos" className="admin-seccion__titulo">
          Próximos eventos
        </h2>
        {cargando && <EstadoCarga mensaje="Cargando eventos…" />}
        {!cargando && !error && proximos.length === 0 && (
          <EstadoVacio titulo="No hay eventos próximos" mensaje="Crea un evento para empezar a vender boletos.">
            <Boton onClick={() => navegar('/admin/eventos/nuevo')}>Crear evento</Boton>
          </EstadoVacio>
        )}
        {!cargando && proximos.length > 0 && <TablaDatos titulo="Próximos eventos" columnas={COLUMNAS} filas={proximos} />}
      </section>

      {indicadores && (
        <section className="admin-seccion" aria-labelledby="dashboard-grafico">
          <h2 id="dashboard-grafico" className="sr-only">
            Ventas de los últimos seis meses
          </h2>
          <GraficoBarras
            titulo="Boletos vendidos por mes"
            datos={indicadores.meses.map((mes) => ({ etiqueta: mes.etiqueta, valor: mes.boletos }))}
            formato={formatearNumero}
          />
        </section>
      )}

      <ModalConfirmacion
        abierto={confirmarReinicio}
        titulo="¿Restablecer los datos de demostración?"
        mensaje="Se borran los eventos, usuarios y órdenes creados o editados en este navegador, y se vuelve a los datos de prueba. Tu sesión y tu carrito no cambian."
        textoConfirmar="Sí, restablecer"
        procesando={false}
        onConfirmar={reiniciarDemo}
        onCancelar={() => setConfirmarReinicio(false)}
      />
    </>
  );
}
