// DUEÑO: Eddie. Módulo 2: gestión de eventos.
// Registra las rutas públicas de eventos y el Context de preferencias.
import InicioPage from './InicioPage.jsx';
import ResultadosPage from './ResultadosPage.jsx';
import DetalleEventoPage from './DetalleEventoPage.jsx';
import { PreferenciasProveedor } from './PreferenciasContext.jsx';

export default {
  nombre: 'eventos',
  orden: 30,
  Proveedor: PreferenciasProveedor,
  rutas: {
    publicas: [
      { index: true, Component: InicioPage, handle: { titulo: 'Inicio' } },
      { path: 'eventos', Component: ResultadosPage, handle: { titulo: 'Eventos' } },
      { path: 'eventos/:id', Component: DetalleEventoPage, handle: { titulo: 'Detalle del evento' } },
    ],
  },
};
