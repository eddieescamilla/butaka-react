// DUEÑO: Gabriel. Módulos 4, 5 y 6: compra, pagos y boletos.
// Registra el Context del carrito y las rutas del flujo de compra:
//   /eventos/:id/boletos → /carrito → /checkout → /checkout/pago → /checkout/resultado
// Las pantallas de boletos usan carga diferida: la librería de QR solo se
// descarga cuando se abre un boleto.
import { perezosa } from '../../app/modulos.js';
import { CarritoProveedor } from './CarritoContext.jsx';
import SeleccionPage from './SeleccionPage.jsx';
import CarritoPage from './CarritoPage.jsx';
import ResumenPage from './ResumenPage.jsx';
import PagoPage from './PagoPage.jsx';
import ResultadoPagoPage from './ResultadoPagoPage.jsx';

export default {
  nombre: 'compra',
  orden: 20,
  Proveedor: CarritoProveedor,
  rutas: {
    publicas: [
      { path: 'eventos/:id/boletos', Component: SeleccionPage, handle: { titulo: 'Selecciona tus boletos' } },
      { path: 'carrito', Component: CarritoPage, handle: { titulo: 'Carrito' } },
      { path: 'checkout', Component: ResumenPage, handle: { titulo: 'Resumen de compra' } },
      { path: 'verificar/:codigo', lazy: perezosa(() => import('./VerificarBoletoPage.jsx')), handle: { titulo: 'Verificar boleto' } },
    ],
    privadas: [
      { path: 'checkout/pago', Component: PagoPage, handle: { titulo: 'Pago' } },
      { path: 'checkout/resultado', Component: ResultadoPagoPage, handle: { titulo: 'Resultado del pago' } },
      { path: 'boletos', lazy: perezosa(() => import('./MisBoletosPage.jsx')), handle: { titulo: 'Mis boletos' } },
      { path: 'boletos/:codigo', lazy: perezosa(() => import('./BoletoPage.jsx')), handle: { titulo: 'Boleto' } },
    ],
  },
};
