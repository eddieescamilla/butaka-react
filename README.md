# Butaka: Tu lugar te espera

Implementación en React del MVP de **Butaka**, una plataforma de venta y gestión de boletos para conciertos, teatro y deportes en El Salvador. Segunda entrega del proyecto: traslada el prototipo de Figma a una aplicación funcional con datos simulados y persistencia en el navegador.


## Equipo

| Integrante | Carné | GitHub | Módulos |
|---|---|---|---|
| José Edgardo Rosales Escamilla | 00129426 | [@eddieescamilla](https://github.com/eddieescamilla) | Eventos · Inventario y precios · Panel de administración · Reportes |
| Gabriel Enrique Mejía Castillo | 00063924 | [@MMejiaC05](https://github.com/MMejiaC05) | Autenticación · Proceso de compra · Pagos · Boletos electrónicos |

**Materia:** Programación Orientada al Usuario · **Docente:** Ing. Néstor Aldana · **Universidad Centroamericana "José Simeón Cañas" (UCA)**

- Prototipo en Figma: [Proyecto Butaka](https://www.figma.com/design/k1uoWzu1qftWTfvz2IlBuv/Proyecto-Butaka?node-id=3-2)
- Primera entrega (HTML y CSS): [butaka-project](https://github.com/eddieescamilla/butaka-project)

## Instalación y ejecución

Requisitos: Node.js 20.19 o superior (o 22.12 en adelante) y npm.

```bash
git clone https://github.com/eddieescamilla/butaka-react.git
cd butaka-react
npm install
npm run dev
```

Abre la dirección que muestra la terminal (normalmente `http://localhost:5173`).

Otros comandos: `npm run build` genera la versión de producción en `dist/`, y `npm run preview` la sirve localmente.

### Usuarios de prueba

Contraseña de todos: `Butaka2026`

| Correo | Rol |
|---|---|
| `ana.lopez@correo.com` | Cliente |
| `carlos.m@correo.com` | Administrador |
| `sofia.h@correo.com` | Organizador |

## Tecnologías

- React 19 y Vite 8, con JavaScript y JSX.
- CSS propio por componente, con variables del manual de marca y clases BEM en español.
- Sin backend: datos simulados en `src/data/` y operaciones asíncronas simuladas con promesas.
- Persistencia de sesión, carrito, órdenes y preferencias en `localStorage`.
- Navegación con estado de vista en `App.jsx` (React Router no se exige en esta entrega).

## Estructura del proyecto

```
src/
├── App.jsx            Estado global: navegación, sesión y carrito
├── rutas.js           Registro de todas las vistas
├── main.jsx           Punto de entrada
├── styles/            tokens.css (manual de marca) y base.css
├── components/        Componentes base del Design System (compartidos)
├── layout/            Encabezado, pie y barra lateral del panel
├── features/
│   ├── eventos/       Inicio, búsqueda y detalle de eventos
│   ├── admin/         Dashboard, eventos, inventario, usuarios y reportes
│   ├── cuenta/        Login, registro, recuperación y perfil
│   └── compra/        Selección, carrito, pago, confirmación y boletos
├── pages/             Pantallas compartidas (404 y sin permiso)
├── data/              Datos simulados
├── servicios/         "API" simulada que devuelve promesas
├── hooks/             useLocalStorage y usePeticion
└── utils/             Formatos, cálculos de eventos y simulación de peticiones
```

Las reglas de trabajo del equipo están en [CONTRIBUIR.md](CONTRIBUIR.md).

## Inventario de componentes

### Componentes base (Design System)

| Componente | Uso | Props principales |
|---|---|---|
| `Logo` | Logotipo de Butaka | `tamano` |
| `Boton` | Acciones primarias, secundarias, de peligro y de texto | `variante`, `tamano`, `cargando`, `bloque` |
| `Etiqueta` | Píldoras de categoría y de estado | `variante` |
| `CampoTexto` | Input, select o textarea con label, ayuda y error | `id`, `etiqueta`, `error`, `ayuda`, `opciones`, `multilinea` |
| `Modal` | Diálogo accesible (confirmaciones) | `abierto`, `titulo`, `onCerrar` |
| `Aviso` | Mensaje de confirmación tipo toast | `tipo`, `mensaje`, `onCerrar`, `duracion` |
| `EstadoCarga` | Estado de carga | `mensaje` |
| `EstadoVacio` | Estado sin resultados | `titulo`, `mensaje` |
| `EstadoError` | Estado de error con reintento | `titulo`, `mensaje`, `onReintentar` |
| `EnlaceVista` | Enlace entre vistas sin recargar | `vista`, `params`, `irA`, `activo` |

### Layout

| Componente | Uso |
|---|---|
| `LayoutCliente`, `Encabezado`, `PiePagina` | Estructura del sitio del cliente |
| `LayoutAdmin`, `BarraLateralAdmin` | Estructura del panel de administración |

### Eventos (Eddie)

| Componente | Uso | Props principales |
|---|---|---|
| `CatalogoEventos` | Listado con filtro por categoría, orden y estados de carga, error y vacío. Lo usan Inicio y Resultados | `busqueda`, `irA`, `titulo` |
| `FiltroCategorias` | Píldoras para filtrar por categoría (`aria-pressed`) | `valor`, `onCambiar` |
| `TarjetaEvento` | Tarjeta de evento con imagen, categoría, fecha, lugar y precio desde | `evento`, `irA` |
| `ZonasEvento` | Zonas del evento con precio, barra de ocupación y disponibilidad | `zonas` |
| `InicioPage`, `ResultadosPage`, `DetalleEventoPage` | Pantallas del módulo de eventos | `params`, `irA` |

### Panel de administración, inventario y reportes (Eddie)

| Componente | Uso | Props principales |
|---|---|---|
| `EncabezadoAdmin` | Título, subtítulo, aviso de confirmación y acción principal de cada pantalla | `titulo`, `subtitulo`, `accion`, `aviso` |
| `TablaDatos` | Tabla reutilizable; en móvil cada fila se muestra como tarjeta | `titulo`, `columnas`, `filas` |
| `TarjetaMetrica` | Indicador del dashboard y de los reportes | `etiqueta`, `valor`, `detalle` |
| `GraficoBarras` | Gráfico de barras con CSS y tabla alternativa para lectores de pantalla | `titulo`, `datos`, `formato` |
| `ModalConfirmacion` | Confirmación de acciones críticas (eliminar) | `abierto`, `mensaje`, `procesando`, `onConfirmar` |
| `FormularioEvento` | Crear o editar un evento, con zonas y validación | `inicial`, `esNuevo`, `onGuardar` |
| `FormularioZona` | Agregar o editar una zona dentro de un modal | `zona`, `todas`, `onGuardar` |
| `FormularioUsuario` | Crear o editar un usuario, con validación | `inicial`, `otrosUsuarios`, `onGuardar` |
| `DashboardPage`, `EventosAdminPage`, `CrearEventoPage`, `InventarioPage`, `UsuariosPage`, `CrearUsuarioPage`, `ReportesPage` | Pantallas del panel | `params`, `irA`, `sesion` |

Hooks propios: `usePreferencias` (categoría y orden del listado), `useEventosAdmin`, `useUsuariosAdmin` y `useAviso`.

### Cuenta, compra y boletos (Gabriel)

Ver [docs/cuenta-y-compra.md](docs/cuenta-y-compra.md).

## Mapa de estado y persistencia

| Estado | Dónde vive | Quién lo usa | Persistencia |
|---|---|---|---|
| Vista actual y parámetros | `App.jsx` (`useState`) | Todas las pantallas, vía `irA` | Historial del navegador (botón Atrás y recarga) |
| Sesión | `useSesion()` en `App.jsx` | Encabezado, panel, pantallas protegidas | `localStorage` → `butaka:sesion` |
| Carrito | `useCarrito()` en `App.jsx` | Encabezado, flujo de compra | `localStorage` → `butaka:carrito` |
| Órdenes y boletos | `useOrdenes()` | Mis boletos, boleto | `localStorage` → `butaka:ordenes` |
| Preferencias | `usePreferencias()` | Listado de eventos | `localStorage` → `butaka:preferencias` |
| Eventos del panel | `useEventosAdmin()` | Panel, inventario, reportes y catálogo del cliente | `localStorage` → `butaka:admin-eventos` |
| Usuarios del panel | `useUsuariosAdmin()` | Pantallas de usuarios | `localStorage` → `butaka:admin-usuarios` |
| Datos de cada pantalla | `usePeticion()` en cada pantalla | La pantalla que los pide | No se guardan |

Valores derivados que se calculan y no se guardan como estado: `totalItems`, `subtotal`, `cargoServicio` y `total` del carrito; `haySesion` y `esAdmin` de la sesión; disponibilidad por zona, "precio desde" y estado de venta de cada evento; las métricas de los reportes y la lista de próximos eventos del dashboard.

Los eventos que crea, edita o elimina el panel se guardan en `butaka:admin-eventos`, y `src/servicios/eventos.js` lee esa misma clave. Por eso un evento creado en el panel aparece en el sitio del cliente.

El detalle del flujo de estado está en [docs/arquitectura.md](docs/arquitectura.md).

## Datos simulados

| Archivo | Contenido |
|---|---|
| `data/eventos.js` | 12 eventos en 4 categorías, cada uno con 3 zonas (precio, capacidad y vendidos) y un estado: en venta, pocos boletos, agotado, cancelado o finalizado |
| `data/usuarios.js` | 6 usuarios ficticios con roles de cliente, organizador y administrador |
| `data/categorias.js` | Categorías, estados, roles, máximo de boletos por zona y cargo por servicio |
| `data/ordenes.js` | Órdenes de ejemplo con sus boletos |
| `data/reportes.js` | Métricas y ventas por mes para el dashboard y los reportes |

Las funciones de `servicios/eventos.js` devuelven los datos después de un retraso, para mostrar los estados de carga. La búsqueda falla al azar en el 10 % de los intentos, para demostrar el estado de error con "Reintentar".

Todos los datos son ficticios: los correos usan el dominio de ejemplo `correo.com`.

## Capturas

Hay 72 capturas en `docs/capturas/`: 24 pantallas en 375 px (móvil), 768 px (tablet) y 1440 px (escritorio). Ninguna tiene scroll horizontal en esos anchos.

| Pantalla | Móvil | Tablet | Escritorio |
|---|---|---|---|
| Inicio | [375 px](docs/capturas/eddie/inicio-375.png) | [768 px](docs/capturas/eddie/inicio-768.png) | [1440 px](docs/capturas/eddie/inicio-1440.png) |
| Resultados de búsqueda | [375 px](docs/capturas/eddie/resultados-375.png) | [768 px](docs/capturas/eddie/resultados-768.png) | [1440 px](docs/capturas/eddie/resultados-1440.png) |
| Sin resultados | [375 px](docs/capturas/eddie/sin-resultados-375.png) | [768 px](docs/capturas/eddie/sin-resultados-768.png) | [1440 px](docs/capturas/eddie/sin-resultados-1440.png) |
| Detalle del evento | [375 px](docs/capturas/eddie/detalle-375.png) | [768 px](docs/capturas/eddie/detalle-768.png) | [1440 px](docs/capturas/eddie/detalle-1440.png) |
| Inicio de sesión | [375 px](docs/capturas/gabriel/login-375.png) | [768 px](docs/capturas/gabriel/login-768.png) | [1440 px](docs/capturas/gabriel/login-1440.png) |
| Registro | [375 px](docs/capturas/gabriel/registro-375.png) | [768 px](docs/capturas/gabriel/registro-768.png) | [1440 px](docs/capturas/gabriel/registro-1440.png) |
| Recuperar contraseña | [375 px](docs/capturas/gabriel/recuperar-375.png) | [768 px](docs/capturas/gabriel/recuperar-768.png) | [1440 px](docs/capturas/gabriel/recuperar-1440.png) |
| Perfil | [375 px](docs/capturas/gabriel/perfil-375.png) | [768 px](docs/capturas/gabriel/perfil-768.png) | [1440 px](docs/capturas/gabriel/perfil-1440.png) |
| Selección de zona y cantidad | [375 px](docs/capturas/gabriel/seleccion-375.png) | [768 px](docs/capturas/gabriel/seleccion-768.png) | [1440 px](docs/capturas/gabriel/seleccion-1440.png) |
| Carrito | [375 px](docs/capturas/gabriel/carrito-375.png) | [768 px](docs/capturas/gabriel/carrito-768.png) | [1440 px](docs/capturas/gabriel/carrito-1440.png) |
| Resumen de compra | [375 px](docs/capturas/gabriel/resumen-375.png) | [768 px](docs/capturas/gabriel/resumen-768.png) | [1440 px](docs/capturas/gabriel/resumen-1440.png) |
| Pago | [375 px](docs/capturas/gabriel/pago-375.png) | [768 px](docs/capturas/gabriel/pago-768.png) | [1440 px](docs/capturas/gabriel/pago-1440.png) |
| Pago aprobado | [375 px](docs/capturas/gabriel/resultado-aprobado-375.png) | [768 px](docs/capturas/gabriel/resultado-aprobado-768.png) | [1440 px](docs/capturas/gabriel/resultado-aprobado-1440.png) |
| Pago rechazado | [375 px](docs/capturas/gabriel/resultado-rechazado-375.png) | [768 px](docs/capturas/gabriel/resultado-rechazado-768.png) | [1440 px](docs/capturas/gabriel/resultado-rechazado-1440.png) |
| Mis boletos | [375 px](docs/capturas/gabriel/mis-boletos-375.png) | [768 px](docs/capturas/gabriel/mis-boletos-768.png) | [1440 px](docs/capturas/gabriel/mis-boletos-1440.png) |
| Boleto con código QR | [375 px](docs/capturas/gabriel/boleto-375.png) | [768 px](docs/capturas/gabriel/boleto-768.png) | [1440 px](docs/capturas/gabriel/boleto-1440.png) |
| Dashboard | [375 px](docs/capturas/eddie/dashboard-375.png) | [768 px](docs/capturas/eddie/dashboard-768.png) | [1440 px](docs/capturas/eddie/dashboard-1440.png) |
| Eventos (panel) | [375 px](docs/capturas/eddie/eventos-375.png) | [768 px](docs/capturas/eddie/eventos-768.png) | [1440 px](docs/capturas/eddie/eventos-1440.png) |
| Crear evento | [375 px](docs/capturas/eddie/crear-evento-375.png) | [768 px](docs/capturas/eddie/crear-evento-768.png) | [1440 px](docs/capturas/eddie/crear-evento-1440.png) |
| Modal de eliminar evento | [375 px](docs/capturas/eddie/eliminar-evento-375.png) | [768 px](docs/capturas/eddie/eliminar-evento-768.png) | [1440 px](docs/capturas/eddie/eliminar-evento-1440.png) |
| Inventario y precios | [375 px](docs/capturas/eddie/inventario-375.png) | [768 px](docs/capturas/eddie/inventario-768.png) | [1440 px](docs/capturas/eddie/inventario-1440.png) |
| Usuarios | [375 px](docs/capturas/eddie/usuarios-375.png) | [768 px](docs/capturas/eddie/usuarios-768.png) | [1440 px](docs/capturas/eddie/usuarios-1440.png) |
| Crear usuario | [375 px](docs/capturas/eddie/crear-usuario-375.png) | [768 px](docs/capturas/eddie/crear-usuario-768.png) | [1440 px](docs/capturas/eddie/crear-usuario-1440.png) |
| Reportes | [375 px](docs/capturas/eddie/reportes-375.png) | [768 px](docs/capturas/eddie/reportes-768.png) | [1440 px](docs/capturas/eddie/reportes-1440.png) |

## Limitaciones y decisiones de diseño

- **Sin backend:** la autenticación, los pagos y el envío de correos son simulados. La contraseña de prueba está en los datos simulados solo con fines de demostración.
- **Navegación sin React Router:** la vista actual se guarda en el estado de `App.jsx` y se sincroniza con el historial del navegador, para que funcionen el botón Atrás y la recarga.
- **Estado global sin Context:** la sesión y el carrito viven en `App.jsx` y se pasan por props. Context se incorpora en la tercera entrega.
- **Color de advertencia:** se oscureció de `#F59E0B` a `#B45309` para cumplir el contraste mínimo cuando se usa como texto.
- **Roles en el panel:** el administrador ve todo; el organizador ve y administra solo sus eventos, y no tiene acceso a Usuarios.
- **Los usuarios no se borran:** se desactivan, y un administrador no puede desactivar su propia cuenta.
- **Inventario:** una zona con boletos vendidos no se puede eliminar, y su capacidad no puede bajar de lo ya vendido.
- **Reportes:** las métricas se calculan a partir de los eventos; la evolución mensual es estática. "Descargar reporte" genera un CSV en el navegador.
- **Cuenta y compra:** el pago es simulado y solo se guardan el titular y los últimos 4 dígitos de la tarjeta; el código QR de los boletos es simulado; una compra no descuenta boletos del inventario, pero antes de pagar se revisa la disponibilidad. El detalle está en [docs/cuenta-y-compra.md](docs/cuenta-y-compra.md).
