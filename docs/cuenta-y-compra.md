# Cuenta, compra, pagos y boletos

> **Dueño:** Gabriel Enrique Mejía Castillo. El README principal enlaza este archivo.

## Módulos

- **1. Gestión de usuarios y autenticación:** inicio de sesión, registro, recuperación de contraseña, perfil y sesión global.
- **4. Proceso de compra:** selección de zona y cantidad, carrito global y resumen.
- **5. Sistema de pagos:** formulario de tarjeta, pasarela simulada, estados de la orden y prevención de doble envío.
- **6. Boletos electrónicos:** mis boletos, boleto con código QR real, verificación del QR y correo de confirmación simulado.

## Rutas

| Ruta | Pantalla | Acceso |
|---|---|---|
| `/login`, `/registro`, `/recuperar` | Cuenta | Público |
| `/perfil` | Perfil | Sesión |
| `/eventos/:id/boletos` | Paso 1: zona y cantidad | Público |
| `/carrito` | Paso 2: carrito | Público |
| `/checkout` | Paso 2: resumen y revisión de disponibilidad | Público (pide sesión para pagar) |
| `/checkout/pago` | Paso 3: pago simulado | Sesión |
| `/checkout/resultado` | Paso 4: pago aprobado o rechazado | Sesión |
| `/boletos`, `/boletos/:codigo` | Mis boletos y boleto con QR | Sesión |
| `/verificar/:codigo?f=FIRMA` | Verificación del QR | Público |

Si una ruta pide sesión y no la hay, `RutaProtegida` manda a `/login` con `state.desde`. Después de iniciar sesión, `LoginPage` regresa a esa ruta (por ejemplo, de `/checkout` directo a `/checkout/pago`).

## Estado global con Context y `useReducer`

| Context | Archivo | Acciones | Persistencia |
|---|---|---|---|
| Sesión | `SesionContext.jsx` | `sesion/iniciar`, `sesion/cerrar`, `sesion/actualizar`, `sesion/sincronizar` | `butaka:sesion` |
| Carrito | `CarritoContext.jsx` | `carrito/agregar`, `carrito/cambiarCantidad`, `carrito/quitar`, `carrito/vaciar`, `carrito/sincronizar` | `butaka:carrito` |

- Los reductores son funciones puras y lanzan un error ante una acción desconocida.
- Los valores derivados (`haySesion`, `esAdmin`, `totalItems`, `subtotal`, `cargoServicio`, `total`) se calculan con `useMemo`, no se guardan.
- `sincronizar`: si se cierra sesión o cambia el carrito en otra pestaña, el evento `storage` actualiza esta pestaña.
- Las pantallas leen el estado con `useSesion()` y `useCarrito()`, sin props. Los nombres que devuelven son el contrato con Eddie (ver `CONTRIBUIR.md`).
- Nunca se guarda la contraseña en la sesión.

## Flujo de compra

1. **Boletos:** se elige la zona (las agotadas aparecen deshabilitadas) y la cantidad, de 1 a 10, sin pasar de lo disponible.
2. **Carrito y resumen:** el resumen vuelve a pedir el inventario a la API y avisa si algo se agotó.
3. **Pago:** `procesarPago` simula la pasarela (1.5 s). Si se aprueba, `crearOrden` de la API recalcula los montos, revisa y descuenta el inventario y genera los boletos.
4. **Confirmación:** la orden queda en estado `pagada`, el carrito se vacía y se muestra el correo simulado. Si se rechaza, el carrito se conserva para reintentar.

**Prevención de doble envío:** el botón se deshabilita mientras se procesa (`cargando`) y una referencia (`useRef`) ignora un segundo envío aunque llegue antes del siguiente render. Al terminar se navega con `replace`, así el botón Atrás no vuelve al formulario de un pago ya hecho. Sin conexión, el formulario de pago se desactiva.

**Tarjetas de prueba:** `4242 4242 4242 4242` (aprobada) y `4000 0000 0000 0002` (rechazada), con cualquier fecha futura y cualquier CVV de 3 dígitos. Solo se guardan el titular y los últimos 4 dígitos.

## Boletos y código QR

- Cada orden pagada genera un boleto por entrada, con evento, fecha, lugar, zona, precio, orden y código (`BTK-2536-01`).
- El QR se genera en el navegador con la librería `qrcode` (`CodigoQR.jsx`) y se dibuja como SVG con texto alternativo.
- El QR codifica el enlace `/verificar/BTK-2536-01?f=FIRMA`. La firma (`firmarBoleto` en `src/api/ordenes.js`) es un hash del código: si alguien cambia un dígito, la verificación responde "Boleto no válido". Un boleto reembolsado tampoco es válido.
- La verificación es académica: sin backend no hay una clave secreta real, y un boleto comprado en otro dispositivo solo se valida por su firma.
- El envío por correo se simula con `CorreoSimulado.jsx`, que muestra el mensaje que recibiría el comprador.

## Inventario de componentes

| Componente | Uso | Props principales |
|---|---|---|
| `TarjetaAuth` | Contenedor de las pantallas de cuenta | `titulo`, `subtitulo`, `pie` |
| `CampoContrasena` | Contraseña con botón Mostrar/Ocultar | las mismas de `CampoTexto` |
| `IndicadorPasos` | Progreso de los 4 pasos de la compra | `actual` |
| `SelectorZona`, `SelectorCantidad` | Zona (radio) y cantidad (− y +) | `zonas`, `valor`, `maximo`, `onCambiar` |
| `ItemCarrito`, `ResumenCompra` | Línea del carrito y totales | `item`, `editable`, `subtotal`, `total` |
| `FormularioPago` | Tarjeta con formato automático y validación (Luhn, vencimiento) | `total`, `procesando`, `deshabilitado`, `onPagar` |
| `CorreoSimulado` | Correo de confirmación simulado | `orden`, `correo` |
| `TarjetaBoleto` | Boleto en "Mis boletos" | `boleto` |
| `CodigoQR` | QR real en SVG | `valor`, `etiqueta`, `tamano` |

## Capturas

En `docs/capturas/gabriel/`, en 375, 768 y 1440 px: login, registro, recuperar, perfil, selección, carrito, checkout sin sesión, resumen, pago, resultado aprobado y rechazado, mis boletos, boleto con QR, verificación válida y alterada, y modo sin conexión.
