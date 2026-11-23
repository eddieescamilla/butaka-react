// DUEÑO: Eddie. Módulo 8: reportes y analítica. Ruta: /admin/reportes (solo administrador).
// Todo se calcula a partir de las órdenes de la API falsa (analitica.js), por
// evento y por periodo. Los filtros viven en la URL (?periodo=90&evento=evt-001),
// así un reporte se puede recargar o compartir tal cual.
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { CATEGORIAS } from '../../data/categorias.js';
import { listarOrdenes } from '../../api/ordenes.js';
import { listarEventos } from '../../api/eventos.js';
import { usePeticion } from '../../hooks/usePeticion.js';
import { formatearFechaCorta, formatearNumero, formatearPrecio } from '../../utils/formato.js';
import Boton from '../../components/Boton.jsx';
import CampoTexto from '../../components/CampoTexto.jsx';
import EstadoCarga from '../../components/EstadoCarga.jsx';
import EstadoVacio from '../../components/EstadoVacio.jsx';
import EncabezadoAdmin from './EncabezadoAdmin.jsx';
import TarjetaMetrica from './TarjetaMetrica.jsx';
import TablaDatos from './TablaDatos.jsx';
import GraficoBarras from './GraficoBarras.jsx';
import ErrorPanel from './ErrorPanel.jsx';
import { useAviso } from './useAviso.js';
import { descargarCSV } from './exportar.js';
import { filtrarOrdenes, PERIODOS, porEvento, porMes, porZona, rangoDelPeriodo, resumen } from './analitica.js';
import './Admin.css';

const FILTRO_CATEGORIAS = [{ valor: '', texto: 'Todas las categorías' }, ...CATEGORIAS.map((c) => ({ valor: c.id, texto: c.nombre }))];
const nombreCategoria = (id) => CATEGORIAS.find((c) => c.id === id)?.nombre ?? id;
const formatoMiles = (valor) => (valor >= 1000 ? `$${formatearNumero(Math.round(valor / 1000))}k` : formatearPrecio(valor));

export default function ReportesPage() {
  const [parametros, setParametros] = useSearchParams();
  const periodo = parametros.get('periodo') ?? '90';
  const eventoId = parametros.get('evento') ?? '';
  const categoria = parametros.get('categoria') ?? '';
  const desdeTexto = parametros.get('desde') ?? '';
  const hastaTexto = parametros.get('hasta') ?? '';

  const { aviso, mostrarAviso, cerrarAviso } = useAviso();
  const [descargando, setDescargando] = useState(false);
  const { estado, datos, error, reintentar } = usePeticion(
    (signal) => Promise.all([listarOrdenes({}, { signal }), listarEventos({}, { signal })]),
    [],
  );

  function cambiarFiltro(nombre, valor) {
    setParametros(
      (actuales) => {
        const siguientes = new URLSearchParams(actuales);
        if (valor) siguientes.set(nombre, valor);
        else siguientes.delete(nombre);
        if (nombre === 'evento' && valor) siguientes.delete('categoria');
        return siguientes;
      },
      { replace: true },
    );
  }

  // ---------- Valores derivados de las órdenes ----------
  const reporte = useMemo(() => {
    if (!datos) return null;
    const [ordenes, eventos] = datos;
    const rango = rangoDelPeriodo(periodo, { desde: desdeTexto, hasta: hastaTexto });
    const elegidos = eventos.filter((e) => (eventoId ? e.id === eventoId : !categoria || e.categoria === categoria));
    const filtradas = filtrarOrdenes(ordenes, { ...rango, eventosIds: new Set(elegidos.map((e) => e.id)) });
    const evento = eventos.find((e) => e.id === eventoId);
    return {
      eventos,
      rango,
      evento,
      totales: resumen(filtradas),
      meses: porMes(filtradas, rango.desde ? rango : {}),
      filas: evento ? porZona(filtradas, evento) : porEvento(filtradas, elegidos),
    };
  }, [datos, periodo, desdeTexto, hastaTexto, eventoId, categoria]);

  const columnasEventos = [
    { clave: 'titulo', titulo: 'Evento' },
    { clave: 'categoria', titulo: 'Categoría', render: (e) => nombreCategoria(e.categoria) },
    { clave: 'boletos', titulo: 'Boletos', alinear: 'derecha', render: (e) => formatearNumero(e.boletos) },
    { clave: 'ingresos', titulo: 'Ingresos', alinear: 'derecha', render: (e) => formatearPrecio(e.ingresos) },
    { clave: 'ordenes', titulo: 'Órdenes', alinear: 'derecha', render: (e) => formatearNumero(e.ordenes) },
    { clave: 'ocupacion', titulo: 'Ocupación total', alinear: 'derecha', render: (e) => `${e.ocupacion} %` },
  ];
  const columnasZonas = [
    { clave: 'nombre', titulo: 'Zona' },
    { clave: 'precio', titulo: 'Precio', alinear: 'derecha', render: (z) => formatearPrecio(z.precio) },
    { clave: 'boletos', titulo: 'Boletos en el periodo', alinear: 'derecha', render: (z) => formatearNumero(z.boletos) },
    { clave: 'ingresos', titulo: 'Venta de boletos', alinear: 'derecha', render: (z) => formatearPrecio(z.ingresos) },
    { clave: 'vendidos', titulo: 'Vendidos / capacidad', alinear: 'derecha', render: (z) => `${formatearNumero(z.vendidos)} / ${formatearNumero(z.capacidad)}` },
  ];

  async function descargar() {
    setDescargando(true);
    try {
      const columnasCSV = reporte.evento
        ? [
            { titulo: 'Zona', valor: (z) => z.nombre },
            { titulo: 'Precio (USD)', valor: (z) => z.precio.toFixed(2) },
            { titulo: 'Boletos en el periodo', valor: (z) => z.boletos },
            { titulo: 'Venta de boletos (USD)', valor: (z) => z.ingresos.toFixed(2) },
          ]
        : [
            { titulo: 'Evento', valor: (e) => e.titulo },
            { titulo: 'Categoría', valor: (e) => nombreCategoria(e.categoria) },
            { titulo: 'Boletos', valor: (e) => e.boletos },
            { titulo: 'Ingresos (USD)', valor: (e) => e.ingresos.toFixed(2) },
            { titulo: 'Órdenes', valor: (e) => e.ordenes },
            { titulo: 'Ocupación total (%)', valor: (e) => e.ocupacion },
          ];
      descargarCSV(`reporte-butaka-${reporte.evento?.id || categoria || 'todos'}-${periodo}.csv`, columnasCSV, reporte.filas);
      mostrarAviso('Reporte descargado');
    } finally {
      setDescargando(false);
    }
  }

  const textoRango = reporte?.rango.desde
    ? `${formatearFechaCorta(reporte.rango.desde)} al ${formatearFechaCorta(reporte.rango.hasta ?? new Date())}`
    : 'Todo el historial';

  return (
    <>
      <EncabezadoAdmin
        titulo="Reportes"
        subtitulo={reporte?.evento ? `${reporte.evento.titulo} · ${textoRango}` : `Ventas e ingresos por evento · ${textoRango}`}
        aviso={aviso}
        onCerrarAviso={cerrarAviso}
        accion={
          <Boton onClick={descargar} cargando={descargando} disabled={!reporte || reporte.filas.length === 0}>
            Descargar CSV
          </Boton>
        }
      />

      <div className="admin-filtros admin-filtros--reportes">
        <CampoTexto id="reportes-periodo" etiqueta="Periodo" opciones={PERIODOS} value={periodo} onChange={(e) => cambiarFiltro('periodo', e.target.value)} />
        {periodo === 'personalizado' && (
          <>
            <CampoTexto id="reportes-desde" etiqueta="Desde" type="date" value={desdeTexto} max={hastaTexto || undefined} onChange={(e) => cambiarFiltro('desde', e.target.value)} />
            <CampoTexto id="reportes-hasta" etiqueta="Hasta" type="date" value={hastaTexto} min={desdeTexto || undefined} onChange={(e) => cambiarFiltro('hasta', e.target.value)} />
          </>
        )}
        <CampoTexto
          id="reportes-evento"
          etiqueta="Evento"
          opciones={[{ valor: '', texto: 'Todos los eventos' }, ...(reporte?.eventos ?? []).map((e) => ({ valor: e.id, texto: e.titulo }))]}
          value={eventoId}
          onChange={(e) => cambiarFiltro('evento', e.target.value)}
        />
        <CampoTexto
          id="reportes-categoria"
          etiqueta="Categoría"
          opciones={FILTRO_CATEGORIAS}
          value={categoria}
          disabled={Boolean(eventoId)}
          ayuda={eventoId ? 'Se ignora al elegir un evento.' : undefined}
          onChange={(e) => cambiarFiltro('categoria', e.target.value)}
        />
      </div>

      {estado === 'cargando' && !reporte && <EstadoCarga mensaje="Calculando reportes a partir de las órdenes…" />}
      {estado === 'error' && <ErrorPanel mensaje={error} onReintentar={reintentar} />}

      {reporte && (
        <>
          <section className="admin-seccion" aria-labelledby="reportes-metricas">
            <h2 id="reportes-metricas" className="sr-only">
              Indicadores del periodo
            </h2>
            <div className="admin-metricas" aria-live="polite">
              <TarjetaMetrica
                etiqueta="Ingresos"
                valor={formatearPrecio(reporte.totales.ingresos)}
                detalle={`${formatearNumero(reporte.totales.ordenes)} órdenes pagadas`}
                tendencia="neutra"
              />
              <TarjetaMetrica
                etiqueta="Boletos vendidos"
                valor={formatearNumero(reporte.totales.boletos)}
                detalle={`${formatearNumero(reporte.totales.boletosEnLinea)} en línea · ${formatearNumero(reporte.totales.boletos - reporte.totales.boletosEnLinea)} en taquilla`}
                tendencia="neutra"
              />
              <TarjetaMetrica
                etiqueta="Precio promedio por boleto"
                valor={formatearPrecio(reporte.totales.precioPromedio)}
                detalle={`${formatearPrecio(reporte.totales.ingresoPorOrden)} por orden`}
                tendencia="neutra"
              />
              <TarjetaMetrica
                etiqueta="Reembolsos"
                valor={formatearNumero(reporte.totales.reembolsos)}
                detalle={reporte.totales.reembolsos ? `${formatearPrecio(reporte.totales.montoReembolsado)} devueltos` : 'Ninguno en el periodo'}
                tendencia={reporte.totales.reembolsos ? 'negativa' : 'neutra'}
              />
            </div>
          </section>

          {reporte.totales.ordenes === 0 && reporte.totales.reembolsos === 0 ? (
            <EstadoVacio titulo="No hay ventas con estos filtros" mensaje="Prueba con un periodo más amplio u otro evento." />
          ) : (
            <>
              <section className="admin-seccion" aria-labelledby="reportes-mensual">
                <h2 id="reportes-mensual" className="sr-only">
                  Evolución mensual
                </h2>
                <GraficoBarras
                  titulo={reporte.evento ? `Ingresos por mes de ${reporte.evento.titulo}` : 'Ingresos por mes'}
                  datos={reporte.meses.map((mes) => ({ etiqueta: mes.etiqueta, valor: mes.ingresos }))}
                  formato={formatoMiles}
                />
              </section>

              <section className="admin-seccion" aria-labelledby="reportes-detalle">
                <h2 id="reportes-detalle" className="admin-seccion__titulo">
                  {reporte.evento ? 'Ventas por zona' : 'Ventas por evento'}
                </h2>
                <TablaDatos
                  titulo={reporte.evento ? `Ventas por zona de ${reporte.evento.titulo}` : 'Ventas e ingresos por evento'}
                  columnas={reporte.evento ? columnasZonas : columnasEventos}
                  filas={reporte.filas}
                />
              </section>
            </>
          )}
        </>
      )}
    </>
  );
}
