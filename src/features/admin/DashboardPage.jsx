// DUEÑO: Eddie. Módulo 7: panel de administración. Dashboard.
// Props: { irA, sesion }
import { useMemo } from 'react';
import { RESUMEN_DASHBOARD, VENTAS_POR_MES } from '../../data/reportes.js';
import { ESTADOS_EVENTO } from '../../data/categorias.js';
import { formatearFecha, formatearNumero, formatearPrecio } from '../../utils/formato.js';
import { capacidadTotal, vendidosTotal } from '../../utils/eventos.js';
import EstadoCarga from '../../components/EstadoCarga.jsx';
import EstadoVacio from '../../components/EstadoVacio.jsx';
import Boton from '../../components/Boton.jsx';
import EncabezadoAdmin from './EncabezadoAdmin.jsx';
import TarjetaMetrica from './TarjetaMetrica.jsx';
import TablaDatos from './TablaDatos.jsx';
import GraficoBarras from './GraficoBarras.jsx';
import { eventosVisibles, useEventosAdmin } from './useEventosAdmin.js';
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

export default function DashboardPage({ irA, sesion }) {
  const { eventos, cargando } = useEventosAdmin();
  const r = RESUMEN_DASHBOARD;

  // Valor derivado: próximos 5 eventos que siguen activos
  const proximos = useMemo(
    () =>
      eventosVisibles(eventos, sesion.usuario)
        .filter((evento) => evento.estado !== 'cancelado' && evento.estado !== 'finalizado')
        .filter((evento) => new Date(evento.fecha) >= new Date())
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .slice(0, 5),
    [eventos, sesion.usuario],
  );

  return (
    <>
      <EncabezadoAdmin titulo="Dashboard" subtitulo={`Resumen de ventas · ${r.periodo}`} />

      <section aria-labelledby="dashboard-metricas">
        <h2 id="dashboard-metricas" className="sr-only">
          Indicadores del mes
        </h2>
        <div className="admin-metricas">
          <TarjetaMetrica
            etiqueta="Boletos vendidos"
            valor={formatearNumero(r.boletosVendidos.valor)}
            detalle={r.boletosVendidos.variacion}
          />
          <TarjetaMetrica etiqueta="Ingresos" valor={formatearPrecio(r.ingresos.valor)} detalle={r.ingresos.variacion} />
          <TarjetaMetrica
            etiqueta="Eventos activos"
            valor={formatearNumero(r.eventosActivos.valor)}
            detalle={r.eventosActivos.variacion}
          />
          <TarjetaMetrica
            etiqueta="Usuarios registrados"
            valor={formatearNumero(r.usuariosRegistrados.valor)}
            detalle={r.usuariosRegistrados.variacion}
          />
        </div>
      </section>

      <section className="admin-seccion" aria-labelledby="dashboard-proximos">
        <h2 id="dashboard-proximos" className="admin-seccion__titulo">
          Próximos eventos
        </h2>
        {cargando && <EstadoCarga mensaje="Cargando eventos…" />}
        {!cargando && proximos.length === 0 && (
          <EstadoVacio titulo="No hay eventos próximos" mensaje="Crea un evento para empezar a vender boletos.">
            <Boton onClick={() => irA('admin-crear-evento')}>Crear evento</Boton>
          </EstadoVacio>
        )}
        {!cargando && proximos.length > 0 && <TablaDatos titulo="Próximos eventos" columnas={COLUMNAS} filas={proximos} />}
      </section>

      <section className="admin-seccion" aria-labelledby="dashboard-grafico">
        <h2 id="dashboard-grafico" className="sr-only">
          Ventas recientes
        </h2>
        <GraficoBarras
          titulo="Boletos vendidos por mes"
          datos={VENTAS_POR_MES.map((mes) => ({ etiqueta: mes.mes, valor: mes.boletos }))}
          formato={formatearNumero}
        />
      </section>
    </>
  );
}
