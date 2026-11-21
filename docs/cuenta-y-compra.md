# Cuenta, compra, pagos y boletos

> **Dueño:** Gabriel Enrique Mejía Castillo. El README principal enlaza este archivo.

## Módulos

- **1. Gestión de usuarios y autenticación:** inicio de sesión, registro, recuperación de contraseña y perfil.
- **4. Proceso de compra:** selección de zona y cantidad, carrito y resumen.
- **5. Sistema de pagos:** formulario de tarjeta, pago simulado aprobado o rechazado.
- **6. Boletos electrónicos:** mis boletos y boleto con código QR.

## Flujo de compra (4 pasos)

| Paso | Vista | Qué pasa |
|---|---|---|
| 1. Boletos | `seleccion` | Se elige la zona (las agotadas aparecen deshabilitadas) y la cantidad, de 1 a 10, sin pasar de lo disponible |
| 2. Carrito | `carrito` y `resumen` | Se ajustan cantidades; el resumen vuelve a revisar la disponibilidad antes de pagar. Desde aquí se pide sesión |
| 3. Pago | `pago` | Formulario de tarjeta validado; el pago se procesa con un retraso simulado |
| 4. Confirmación | `resultado-pago` | Aprobado: se crea la orden con sus boletos y se vacía el carrito. Rechazado: el carrito se conserva para reintentar |

## Inventario de componentes

| Componente | Uso | Props principales |
|---|---|---|
| `TarjetaAuth` | Contenedor centrado de las pantallas de cuenta | `titulo`, `subtitulo`, `pie` |
| `CampoContrasena` | Campo de contraseña con botón Mostrar/Ocultar | las mismas de `CampoTexto` |
| `IndicadorPasos` | Progreso de los 4 pasos de la compra | `actual` |
| `SelectorZona` | Zonas como radio buttons con precio y disponibilidad | `zonas`, `valor`, `onCambiar` |
| `SelectorCantidad` | Botones − y + con límites | `valor`, `minimo`, `maximo`, `onCambiar` |
| `ItemCarrito` | Línea del carrito, editable o solo lectura | `item`, `editable`, `onCambiarCantidad`, `onQuitar` |
| `ResumenCompra` | Subtotal, cargo por servicio y total | `subtotal`, `cargoServicio`, `total` |
| `FormularioPago` | Datos de la tarjeta con formato automático y validación | `total`, `procesando`, `onPagar` |
| `TarjetaBoleto` | Boleto en la lista de "Mis boletos" | `boleto`, `irA` |
| `CodigoQR` | Código QR simulado, siempre igual para el mismo boleto | `codigo`, `tamano` |
| `LoginPage`, `RegistroPage`, `RecuperarPage`, `PerfilPage` | Pantallas de cuenta | `params`, `irA`, `sesion` |
| `SeleccionPage`, `CarritoPage`, `ResumenPage`, `PagoPage`, `ResultadoPagoPage`, `MisBoletosPage`, `BoletoPage` | Pantallas de compra, pago y boletos | `params`, `irA`, `sesion`, `carrito` |

Hooks y módulos de lógica: `useSesion`, `useCarrito`, `useOrdenes`, `autenticacion.js` (login y registro simulados), `pagos.js` (validación y pasarela simulada), `stock.js` (revisión de disponibilidad) y `validaciones.js`.

## Estado y persistencia

| Estado | Dónde vive | Persistencia |
|---|---|---|
| Sesión | `useSesion()` en `App.jsx` | `butaka:sesion` (sin contraseña) |
| Carrito | `useCarrito()` en `App.jsx` | `butaka:carrito` |
| Órdenes y boletos | `useOrdenes()` | `butaka:ordenes` (más las órdenes de ejemplo de `data/ordenes.js`) |
| Cuentas registradas | `autenticacion.js` | `butaka:registros` |

Valores derivados: `totalItems`, `subtotal`, `cargoServicio` y `total` del carrito; las órdenes y los boletos del usuario; los boletos vigentes y pasados; los problemas de disponibilidad del carrito.

## Validaciones de los formularios

| Formulario | Qué se valida | Mensaje de ejemplo |
|---|---|---|
| Inicio de sesión | Correo con formato válido y contraseña obligatoria; usuario inexistente, contraseña incorrecta o cuenta desactivada | "El correo o la contraseña no son correctos." |
| Registro | Nombre y apellidos; correo válido y no registrado; contraseña de 8+ caracteres con letras y números; confirmación igual; aceptar términos | "Las contraseñas no coinciden." |
| Recuperar contraseña | Correo con formato válido | "Escribe un correo válido, por ejemplo ana@correo.com." |
| Perfil | Nombre y apellidos obligatorios; el botón se activa solo si hay cambios | "Escribe tu nombre." |
| Pago | Nombre y apellido del titular; 16 dígitos que pasen el algoritmo de Luhn; vencimiento MM/AA no vencido; CVV de 3 o 4 dígitos | "La tarjeta está vencida." |

En todos los formularios, al enviar con errores el foco va al primer campo inválido, y cada mensaje está asociado a su campo con `aria-describedby`.

## Prevención de doble compra

- El botón "Pagar" se deshabilita y muestra "Procesando…" mientras se procesa el pago.
- Una referencia (`useRef`) bloquea un segundo envío aunque llegue antes de que React vuelva a dibujar el botón.
- Antes de cobrar, se revisa otra vez que los boletos sigan disponibles.

## Tarjetas de prueba

| Número | Resultado |
|---|---|
| `4242 4242 4242 4242` | Pago aprobado |
| `4000 0000 0000 0002` | Pago rechazado (fondos insuficientes) |

Cualquier fecha futura y cualquier CVV de 3 dígitos.

## Capturas

Están en `docs/capturas/gabriel/`, con el formato `pantalla-ancho.png` y a tres anchos: 375 (móvil), 768 (tablet) y 1440 px (escritorio). Ninguna pantalla tiene scroll horizontal en esos anchos.

| Pantalla | Archivos |
|---|---|
| Inicio de sesión | `login-375.png`, `login-768.png`, `login-1440.png` |
| Registro | `registro-375.png`, `registro-768.png`, `registro-1440.png` |
| Recuperar contraseña | `recuperar-375.png`, `recuperar-768.png`, `recuperar-1440.png` |
| Perfil | `perfil-375.png`, `perfil-768.png`, `perfil-1440.png` |
| Selección de zona y cantidad | `seleccion-375.png`, `seleccion-768.png`, `seleccion-1440.png` |
| Carrito | `carrito-375.png`, `carrito-768.png`, `carrito-1440.png` |
| Resumen de compra | `resumen-375.png`, `resumen-768.png`, `resumen-1440.png` |
| Pago | `pago-375.png`, `pago-768.png`, `pago-1440.png` |
| Resultado: pago aprobado | `resultado-aprobado-375.png`, `resultado-aprobado-768.png`, `resultado-aprobado-1440.png` |
| Resultado: pago rechazado | `resultado-rechazado-375.png`, `resultado-rechazado-768.png`, `resultado-rechazado-1440.png` |
| Mis boletos | `mis-boletos-375.png`, `mis-boletos-768.png`, `mis-boletos-1440.png` |
| Boleto con código QR | `boleto-375.png`, `boleto-768.png`, `boleto-1440.png` |

## Decisiones y limitaciones

- **Pagos simulados:** no hay pasarela real. Nunca se guarda el número completo de la tarjeta ni el CVV: la orden solo guarda el titular y los últimos 4 dígitos.
- **Código QR simulado:** el patrón se genera a partir del código del boleto y siempre es el mismo, pero no es escaneable. Un QR real necesitaría una librería y un sistema de validación en la entrada.
- **Inventario:** una compra no descuenta boletos de la zona, porque el inventario lo administra el panel de administración (otro módulo). Antes de pagar sí se revisa que haya disponibilidad.
- **Cuentas registradas:** se guardan aparte (`butaka:registros`) y el login las reconoce junto con los usuarios del panel. No aparecen en la tabla de Usuarios del panel.
- **Recuperar contraseña:** siempre muestra el mismo mensaje, exista o no el correo, para no revelar qué cuentas están registradas.
