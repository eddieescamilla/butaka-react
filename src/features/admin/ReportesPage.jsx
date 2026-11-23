// DUEÑO: Eddie. Módulo 8: reportes y analítica. Ventas e ingresos por evento.
// Ruta: /admin/reportes (solo administrador)
// Las métricas se calculan a partir de los eventos (valores derivados);
// la evolución mensual viene de datos estáticos (src/data/reportes.js).
import { useMemo, useState } from 'react';
import { CATEGORIAS } from '../../data/categorias.js';
import { REEMBOLSOS, VENTAS_POR_MES } from '../../data/reportes.js';
import { formatearNumero, formatearPrecio } from '../../utils/formato.js';
import { capacidadTotal, ingresosEvento, vendidosTotal } from '../../utils/eventos.js';
import { simularPeticion } from '../../utils/simularPeticion.js';
import Boton from '../../components/Boton.jsx';
import CampoTexto from '../../components/CampoTexto.jsx';
import EstadoCarga from '../../components/EstadoCarga.jsx';
import EstadoVacio from '../../components/EstadoVacio.jsx';
import EncabezadoAdmin from './EncabezadoAdmin.jsx';
import TarjetaMetrica from './TarjetaMetrica.jsx';
import TablaDatos from './TablaDatos.jsx';
import GraficoBarras from './GraficoBarras.jsx';
import { eventosVisibles, useEventosAdmin } from './useEventosAdmin.js';
import { useAviso } from './useAviso.js';
import { descargarCSV } from './exportar.js';
import { useSesion } from '../cuenta/useSesion.js';
import './Admin.css';

const FILTRO_CATEGORIAS = [{ valor: '', texto: 'Todas las categorías' }, ...CATEGORIAS.map((c) => ({ valor: c.id, texto: c.nombre }))];

function ocupacion(evento) {
  return Math.round((vendidosTotal(evento) / capacidadTotal(evento)) * 100);
}

// Columnas del archivo CSV
const COLUMNAS_CSV = [
  { titulo: 'Evento', valor: (e) => e.titulo },
  { titulo: 'Categoría', valor: (e) => CATEGORIAS.find((c) => c.id === e.categoria)?.nombre },
  { titulo: 'Ingresos (USD)', valor: (e) => ingresosEvento(e).toFixed(2) },
  { titulo: 'Boletos vendidos', valor: (e) => vendidosTotal(e) },
  { titulo: 'Capacidad', valor: (e) => capacidadTotal(e) },
  { titulo: 'Ocupación (%)', valor: (e) => ocupacion(e) },
];

export default function ReportesPage() {
  const sesion = useSesion();
  const { eventos, cargando } = useEventosAdmin();
  const { aviso, mostrarAviso, cerrarAviso } = useAviso();
  const [categoria, setCategoria] = useState('');
  const [descargando, setDescargando] = useState(false);

  // Los eventos cancelados no generan ventas
  const filas = useMemo(
    () =>
      eventosVisibles(eventos, sesion.usuario)
        .filter((evento) => evento.estado !== 'cancelado')
        .filter((evento) => !categoria || evento.categoria === categoria)
        .sort((a, b) => ingresosEvento(b) - ingresosEvento(a)),
    [eventos, sesion.usuario, categoria],
  );

  // Métricas derivadas de las filas filtradas
  const metricas = useMemo(() => {
    const ingresos = filas.reduce((suma, e) => suma + ingresosEvento(e), 0);
    const boletos = filas.reduce((suma, e) => suma + vendidosTotal(e), 0);
    const promedioOcupacion = filas.length ? Math.round(filas.reduce((suma, e) => suma + ocupacion(e), 0) / filas.length) : 0;
    return { ingresos, boletos, precioPromedio: boletos ? ingresos / boletos : 0, promedioOcupacion };
  }, [filas]);

  async function descargar() {
    setDescargando(true);
    try {
      // Simula que el servidor prepara el reporte
      await simularPeticion(() => null, { retraso: 800 });
      descargarCSV(`reporte-ventas-butaka${categoria ? `-${categoria}` : ''}.csv`, COLUMNAS_CSV, filas);
      mostrarAviso('Reporte descargado');
    } finally {
      setDescargando(false);
    }
  }

  const columnas = [
    { clave: 'titulo', titulo: 'Evento' },
    { clave: 'ingresos', titulo: 'Ingresos', alinear: 'derecha', render: (e) => formatearPrecio(ingresosEvento(e)) },
    {
      clave: 'vendidos',
      titulo: 'Boletos vendidos',
      alinear: 'derecha',
      render: (e) => `${formatearNumero(vendidosTotal(e))} / ${formatearNumero(capacidadTotal(e))}`,
    },
    { clave: 'ocupacion', titulo: 'Ocupación', alinear: 'derecha', render: (e) => `${ocupacion(e)} %` },
  ];

  return (
    <>
      <EncabezadoAdmin
        titulo="Reportes"
        subtitulo="Ventas e ingresos por evento"
        aviso={aviso}
        onCerrarAviso={cerrarAviso}
        accion={
          <Boton onClick={descargar} cargando={descargando} disabled={cargando || filas.length === 0}>
            Descargar reporte
          </Boton>
        }
      />

      <div className="admin-filtros">
        <CampoTexto id="reportes-categoria" etiqueta="Categoría" opciones={FILTRO_CATEGORIAS} value={categoria} onChange={(e) => setCategoria(e.target.value)} />
      </div>

      {cargando && <EstadoCarga mensaje="Calculando reportes…" />}

      {!cargando && (
        <>
          <section className="admin-seccion" aria-labelledby="reportes-metricas">
            <h2 id="reportes-metricas" className="sr-only">
              Indicadores
            </h2>
            <div className="admin-metricas">
              <TarjetaMetrica etiqueta="Ingreso total" valor={formatearPrecio(metricas.ingresos)} detalle={`${formatearNumero(metricas.boletos)} boletos vendidos`} tendencia="neutra" />
              <TarjetaMetrica etiqueta="Precio promedio por boleto" valor={formatearPrecio(metricas.precioPromedio)} detalle="Ingresos ÷ boletos" tendencia="neutra" />
              <TarjetaMetrica etiqueta="Ocupación promedio" valor={`${metricas.promedioOcupacion} %`} detalle={`${filas.length} eventos`} tendencia="neutra" />
              <TarjetaMetrica etiqueta="Reembolsos" valor={formatearNumero(REEMBOLSOS.valor)} detalle={REEMBOLSOS.variacion} />
            </div>
          </section>

          <section className="admin-seccion" aria-labelledby="reportes-eventos">
            <h2 id="reportes-eventos" className="admin-seccion__titulo">
              Ventas por evento
            </h2>
            {filas.length === 0 ? (
              <EstadoVacio titulo="No hay ventas en esta categoría" mensaje="Elige otra categoría para ver sus resultados." />
            ) : (
              <TablaDatos titulo="Ventas e ingresos por evento" columnas={columnas} filas={filas} />
            )}
          </section>

          <section className="admin-seccion" aria-labelledby="reportes-mensual">
            <h2 id="reportes-mensual" className="sr-only">
              Evolución mensual
            </h2>
            <GraficoBarras
              titulo="Ingresos por mes (toda la plataforma)"
              datos={VENTAS_POR_MES.map((mes) => ({ etiqueta: mes.mes, valor: mes.ingresos }))}
              formato={(valor) => `$${formatearNumero(Math.round(valor / 1000))}k`}
            />
          </section>
        </>
      )}
    </>
  );
}
