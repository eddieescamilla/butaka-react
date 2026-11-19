// ARCHIVO COMPARTIDO (congelado). Ver CONTRIBUIR.md antes de cambiarlo.
// Registro de todas las pantallas de la aplicación. No usamos React Router
// (no se exige en esta entrega): App.jsx guarda en el estado qué vista se
// muestra y cada pantalla navega llamando a irA('nombre-vista', params).
//
// Campos de cada vista:
//   componente:     la pantalla que se dibuja
//   area:           'cliente' (encabezado + pie) o 'admin' (barra lateral)
//   titulo:         título de la pestaña del navegador
//   requiereSesion: si no hay sesión, se muestra el login y luego se regresa
//   roles:          roles que pueden entrar (si no se indica, cualquiera)

// Pantallas compartidas
import NoEncontradaPage from './pages/NoEncontradaPage.jsx';
import SinPermisoPage from './pages/SinPermisoPage.jsx';

// Eddie: eventos
import InicioPage from './features/eventos/InicioPage.jsx';
import ResultadosPage from './features/eventos/ResultadosPage.jsx';
import DetalleEventoPage from './features/eventos/DetalleEventoPage.jsx';

// Eddie: panel de administración y reportes
import DashboardPage from './features/admin/DashboardPage.jsx';
import EventosAdminPage from './features/admin/EventosAdminPage.jsx';
import CrearEventoPage from './features/admin/CrearEventoPage.jsx';
import InventarioPage from './features/admin/InventarioPage.jsx';
import UsuariosPage from './features/admin/UsuariosPage.jsx';
import CrearUsuarioPage from './features/admin/CrearUsuarioPage.jsx';
import ReportesPage from './features/admin/ReportesPage.jsx';

// Gabriel: cuenta de usuario
import LoginPage from './features/cuenta/LoginPage.jsx';
import RegistroPage from './features/cuenta/RegistroPage.jsx';
import RecuperarPage from './features/cuenta/RecuperarPage.jsx';
import PerfilPage from './features/cuenta/PerfilPage.jsx';

// Gabriel: compra, pagos y boletos
import SeleccionPage from './features/compra/SeleccionPage.jsx';
import CarritoPage from './features/compra/CarritoPage.jsx';
import ResumenPage from './features/compra/ResumenPage.jsx';
import PagoPage from './features/compra/PagoPage.jsx';
import ResultadoPagoPage from './features/compra/ResultadoPagoPage.jsx';
import MisBoletosPage from './features/compra/MisBoletosPage.jsx';
import BoletoPage from './features/compra/BoletoPage.jsx';

const PANEL = ['admin', 'organizador'];

export const VISTAS = {
  // ---- Eventos (Eddie) ----
  inicio: { componente: InicioPage, area: 'cliente', titulo: 'Inicio' },
  resultados: { componente: ResultadosPage, area: 'cliente', titulo: 'Resultados de búsqueda' },
  'detalle-evento': { componente: DetalleEventoPage, area: 'cliente', titulo: 'Detalle del evento' },

  // ---- Cuenta (Gabriel) ----
  login: { componente: LoginPage, area: 'cliente', titulo: 'Iniciar sesión' },
  registro: { componente: RegistroPage, area: 'cliente', titulo: 'Crear cuenta' },
  recuperar: { componente: RecuperarPage, area: 'cliente', titulo: 'Recuperar contraseña' },
  perfil: { componente: PerfilPage, area: 'cliente', titulo: 'Mi perfil', requiereSesion: true },

  // ---- Compra, pagos y boletos (Gabriel) ----
  seleccion: { componente: SeleccionPage, area: 'cliente', titulo: 'Selecciona tus boletos' },
  carrito: { componente: CarritoPage, area: 'cliente', titulo: 'Carrito' },
  resumen: { componente: ResumenPage, area: 'cliente', titulo: 'Resumen de compra', requiereSesion: true },
  pago: { componente: PagoPage, area: 'cliente', titulo: 'Pago', requiereSesion: true },
  'resultado-pago': { componente: ResultadoPagoPage, area: 'cliente', titulo: 'Resultado del pago', requiereSesion: true },
  'mis-boletos': { componente: MisBoletosPage, area: 'cliente', titulo: 'Mis boletos', requiereSesion: true },
  boleto: { componente: BoletoPage, area: 'cliente', titulo: 'Boleto', requiereSesion: true },

  // ---- Panel de administración y reportes (Eddie) ----
  'admin-dashboard': { componente: DashboardPage, area: 'admin', titulo: 'Dashboard', requiereSesion: true, roles: PANEL },
  'admin-eventos': { componente: EventosAdminPage, area: 'admin', titulo: 'Eventos', requiereSesion: true, roles: PANEL },
  'admin-crear-evento': { componente: CrearEventoPage, area: 'admin', titulo: 'Crear evento', requiereSesion: true, roles: PANEL },
  'admin-inventario': { componente: InventarioPage, area: 'admin', titulo: 'Inventario y precios', requiereSesion: true, roles: PANEL },
  'admin-usuarios': { componente: UsuariosPage, area: 'admin', titulo: 'Usuarios', requiereSesion: true, roles: ['admin'] },
  'admin-crear-usuario': { componente: CrearUsuarioPage, area: 'admin', titulo: 'Crear usuario', requiereSesion: true, roles: ['admin'] },
  'admin-reportes': { componente: ReportesPage, area: 'admin', titulo: 'Reportes', requiereSesion: true, roles: PANEL },

  // ---- Compartidas ----
  'sin-permiso': { componente: SinPermisoPage, area: 'cliente', titulo: 'Sin permiso' },
  'no-encontrada': { componente: NoEncontradaPage, area: 'cliente', titulo: 'Página no encontrada' },
};
