# Butaka: Tu lugar te espera

PWA en React del MVP de **Butaka**, una plataforma de venta y gestión de boletos para conciertos, teatro y deportes en El Salvador. Es la **entrega final** del proyecto: la app se navega con React Router, comparte estado con Context y `useReducer`, consume una API falsa, tiene panel de administración con CRUD y reportes, genera boletos con código QR, se instala como aplicación y funciona sin conexión.

**App publicada:** https://eddieescamilla.github.io/butaka-react/

## Equipo

| Integrante | Carné | GitHub | Módulos |
|---|---|---|---|
| José Edgardo Rosales Escamilla | 00129426 | [@eddieescamilla](https://github.com/eddieescamilla) | 2. Eventos · 3. Inventario y precios · 7. Panel de administración · 8. Reportes · Router, API falsa y GitHub Pages |
| Gabriel Enrique Mejía Castillo | 00063924 | [@MMejiaC05](https://github.com/MMejiaC05) | 1. Usuarios y autenticación · 4. Compra · 5. Pagos · 6. Boletos con QR · PWA |

**Materia:** Programación Orientada al Usuario · **Docente:** Ing. Néstor Aldana · **Universidad Centroamericana "José Simeón Cañas" (UCA)**

- Prototipo en Figma: [Proyecto Butaka](https://www.figma.com/design/k1uoWzu1qftWTfvz2IlBuv/Proyecto-Butaka?node-id=3-2)
- Primera entrega (HTML y CSS): [butaka-project](https://github.com/eddieescamilla/butaka-project)

## Alcance

Los **ocho módulos del MVP** están implementados:

| Módulo | Qué incluye |
|---|---|
| 1. Usuarios y autenticación | Login, registro, recuperación simulada, perfil persistente, roles de cliente, organizador y administrador, rutas protegidas |
| 2. Gestión de eventos | Listado, búsqueda en la URL, filtro por categoría, orden, detalle y estados de venta desde la API falsa |
| 3. Inventario y precios | Zonas, precios y disponibilidad; edición de zonas en el panel; cada compra descuenta del inventario |
| 4. Proceso de compra | Carrito global con Context y `useReducer`, flujo de 4 pasos, resumen y persistencia |
| 5. Sistema de pagos | Pago simulado, orden en estado `pagada`, rechazo con reintento y prevención de doble envío |
| 6. Boletos electrónicos | QR real generado en el cliente, verificación del QR, lista de boletos y correo de confirmación simulado |
| 7. Panel de administración | Dashboard, CRUD de eventos, inventario y precios, usuarios y acceso por rol |
| 8. Reportes y analítica | Ingresos, boletos, reembolsos y gráficos calculados a partir de las órdenes, por evento y por periodo, con descarga CSV |

## Instalación y ejecución

Requisitos: Node.js 20.19 o superior (o 22.12 en adelante) y npm.

```bash
git clone https://github.com/eddieescamilla/butaka-react.git
cd butaka-react
npm install
npm run dev        # http://localhost:5173
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (sin service worker) |
| `npm run build` | Compila en `dist/`, genera el service worker y crea `404.html` y `.nojekyll` |
| `npm run preview` | Sirve `dist/` en `http://localhost:4173/butaka-react/` con la PWA activa |
| `npm run datos` | Regenera `public/api/ordenes.json` a partir de los eventos y usuarios |

## Credenciales de prueba y roles

Contraseña de todas las cuentas: `Butaka2026`. Son cuentas ficticias (dominio `correo.com`): no hay datos personales reales.

| Correo | Rol | Puede ver |
|---|---|---|
| `ana.lopez@correo.com` | Cliente | Sitio, compra, Mis boletos y perfil (ya tiene boletos comprados) |
| `sofia.h@correo.com` | Organizador | Lo anterior más el panel: dashboard, eventos e inventario **de sus propios eventos** |
| `carlos.m@correo.com` | Administrador | Todo el panel, incluidos **Usuarios** y **Reportes** |

Tarjetas de prueba: `4242 4242 4242 4242` (aprobada) y `4000 0000 0000 0002` (rechazada), con cualquier fecha futura y CVV de 3 dígitos.

## Tecnologías

- React 19, Vite 8, JavaScript y JSX.
- React Router 8 en modo datos (`createBrowserRouter` y `RouterProvider`) con carga diferida de rutas.
- Context + `useReducer` para sesión, carrito y preferencias.
- `vite-plugin-pwa` (Workbox) para el manifest y el service worker.
- `qrcode` para generar los códigos QR en el navegador.
- CSS propio por componente, variables del manual de marca y BEM en español.
- Sin backend, sin base de datos, sin pagos reales y sin envío real de correos.

## Arquitectura de carpetas

```
public/
├── api/               API falsa: eventos.json, usuarios.json, ordenes.json
├── iconos/            Íconos de la PWA (192, 512 y maskable)
└── img/               Fotos de los eventos
src/
├── main.jsx           RouterProvider
├── app/               router.jsx, Raiz.jsx (proveedores), RutaProtegida, modulos.js, errores
├── api/               Capa de acceso a datos: cliente.js, eventos.js, usuarios.js, ordenes.js
├── layout/            LayoutCliente y LayoutAdmin con <Outlet />, encabezado y barra lateral
├── features/
│   ├── eventos/       Inicio, listado, detalle y PreferenciasContext (Eddie)
│   ├── admin/         Dashboard, CRUD, inventario, usuarios y reportes (Eddie)
│   ├── cuenta/        Login, registro, perfil y SesionContext (Gabriel)
│   ├── compra/        Carrito, checkout, pago, boletos, QR y CarritoContext (Gabriel)
│   └── pwa/           Avisos de actualización, sin conexión e instalación (Gabriel)
├── components/        Design System compartido: Boton, CampoTexto, Modal, Aviso, Estados…
├── hooks/             usePeticion (carga, error, cancelación) y useLocalStorage
├── pages/             404 y Sin permiso
├── data/              Constantes: categorías, estados, roles, cargo por servicio
├── styles/            tokens.css (manual de marca) y base.css
└── utils/             Formatos y cálculos de eventos
scripts/               generar-datos.mjs y postbuild.mjs
.github/workflows/     deploy.yml (GitHub Pages)
```

Cada carpeta de `features/` registra sus rutas, su Context y sus componentes globales en un archivo `modulo.jsx`; el router los descubre con `import.meta.glob`. Así cada integrante trabajó solo en sus carpetas, con sus ramas y pull requests, sin conflictos. El detalle está en [docs/arquitectura.md](docs/arquitectura.md) y las reglas del equipo en [CONTRIBUIR.md](CONTRIBUIR.md).

## Mapa de rutas

| Ruta | Contenido | Acceso |
|---|---|---|
| `/` | Inicio y próximos eventos | Público |
| `/eventos?q=` | Listado y búsqueda | Público |
| `/eventos/:id` | Detalle del evento | Público |
| `/eventos/:id/boletos` | Zona y cantidad | Público |
| `/carrito` | Carrito | Público |
| `/checkout` | Resumen de compra (pide sesión para pagar) | Público |
| `/checkout/pago` · `/checkout/resultado` | Pago simulado y resultado | Autenticado |
| `/boletos` · `/boletos/:codigo` | Boletos del usuario y boleto con QR | Autenticado |
| `/verificar/:codigo?f=` | Verificación del QR | Público |
| `/login` · `/registro` · `/recuperar` | Cuenta | Público |
| `/perfil` | Perfil | Autenticado |
| `/admin` | Dashboard | Administrador u organizador |
| `/admin/eventos` · `/nuevo` · `/:id/editar` | CRUD de eventos | Administrador u organizador |
| `/admin/inventario?evento=` | Inventario y precios | Administrador u organizador |
| `/admin/usuarios` · `/nuevo` · `/:id/editar` | Usuarios | Administrador |
| `/admin/reportes?periodo=&evento=` | Reportes | Administrador |
| `*` | 404 | Público |

Sin sesión, una ruta protegida redirige a `/login` y, al iniciar sesión, regresa a la ruta pedida. Un rol sin permiso ve "Sin permiso". Las pantallas del panel y de boletos se descargan solo cuando se visitan (`lazy`).

## Estado global

| Estado | Context | Acciones (`useReducer`) | Persistencia |
|---|---|---|---|
| Sesión | `SesionContext` | iniciar, cerrar, actualizar, sincronizar | `butaka:sesion` |
| Carrito | `CarritoContext` | agregar, cambiarCantidad, quitar, vaciar, sincronizar | `butaka:carrito` |
| Preferencias | `PreferenciasContext` | cambiarCategoria, cambiarOrden, restablecer | `butaka:preferencias` |

Los consumidores usan `useSesion()`, `useCarrito()` y `usePreferencias()`, sin prop drilling. Los totales del carrito, `haySesion`, `esAdmin` y las métricas de los reportes son valores derivados: se calculan, no se guardan. El panel usa además un `useReducer` local (`useListaRemota`) para cargar y modificar listas de la API.

## API falsa

Se eligió la **API falsa local** (la opción preferida). `src/api/` es la única capa que toca los datos; los componentes nunca usan `fetch` ni `localStorage` directamente.

- **Lectura:** `fetch` a `public/api/<colección>.json` con un retraso simulado de 450 ms y `AbortSignal`.
- **Escritura:** la colección modificada se guarda completa en `localStorage` (`butaka:api:<colección>`) y desde ahí se lee. Latencia de 700 ms.
- **Errores:** `ErrorApi` con mensaje claro y código (404, 409…). Sin conexión y sin datos guardados, el mensaje lo explica.
- **Cancelación:** `usePeticion` y `useListaRemota` crean un `AbortController` y cancelan la petición al cambiar los filtros o al salir de la pantalla.
- Estados de **carga, error y vacío** en todas las pantallas con datos.

| Colección | Datos de prueba | Operaciones |
|---|---|---|
| `eventos.json` | 12 eventos en 4 categorías, con 3 zonas cada uno (precio, capacidad, vendidos) y estado | Listar, buscar, obtener, crear, editar, eliminar, guardar y eliminar zonas, registrar venta |
| `usuarios.json` | 20 cuentas ficticias con los 3 roles | Autenticar, registrar, listar, crear, editar, activar o desactivar |
| `ordenes.json` | 538 órdenes de junio a noviembre de 2026, en línea y de taquilla, más 9 reembolsadas | Listar, obtener, crear (recalcula montos y descuenta inventario), boletos, verificar QR |

`scripts/generar-datos.mjs` genera las órdenes para que la suma de boletos de cada zona sea igual a sus `vendidos`: inventario y reportes siempre cuadran. En el dashboard, el administrador puede **restablecer los datos de demostración**.

## PWA y estrategias de caché

| Recurso | Estrategia |
|---|---|
| App shell (HTML, JS, CSS, íconos) | Precache |
| Rutas de la SPA sin conexión | `navigateFallback` a `index.html` |
| API (`/api/*.json`) | NetworkFirst (3 s) |
| Imágenes | CacheFirst |
| Google Fonts | StaleWhileRevalidate y CacheFirst |

Manifest completo con íconos de 192, 512 y maskable; aviso de actualización ("Actualizar"); aviso de sin conexión; botón "Instalar Butaka". Detalle y pasos para verificarlo en DevTools: [docs/pwa.md](docs/pwa.md).

## Despliegue en GitHub Pages

1. `vite.config.js` usa `base: '/butaka-react/'` en `build` y `preview` (o `VITE_BASE`).
2. `createBrowserRouter` recibe `basename: import.meta.env.BASE_URL`.
3. `scripts/postbuild.mjs` copia `dist/index.html` a `dist/404.html` (así funcionan las rutas profundas al recargar) y crea `.nojekyll`.
4. `.github/workflows/deploy.yml` compila y publica `dist/` en cada push a `main`.
5. Configuración única en GitHub: **Settings → Pages → Source: GitHub Actions**.

## Capturas

En `docs/capturas/`, cada pantalla en 375 px (móvil), 768 px (tablet) y 1440 px (escritorio).

| Pantalla | Móvil | Tablet | Escritorio |
|---|---|---|---|
| Listado de eventos | [375](docs/capturas/eddie/listado-375.png) | [768](docs/capturas/eddie/listado-768.png) | [1440](docs/capturas/eddie/listado-1440.png) |
| Detalle | [375](docs/capturas/eddie/detalle-375.png) | [768](docs/capturas/eddie/detalle-768.png) | [1440](docs/capturas/eddie/detalle-1440.png) |
| Carrito | [375](docs/capturas/gabriel/carrito-375.png) | [768](docs/capturas/gabriel/carrito-768.png) | [1440](docs/capturas/gabriel/carrito-1440.png) |
| Checkout (resumen) | [375](docs/capturas/gabriel/resumen-375.png) | [768](docs/capturas/gabriel/resumen-768.png) | [1440](docs/capturas/gabriel/resumen-1440.png) |
| Pago | [375](docs/capturas/gabriel/pago-375.png) | [768](docs/capturas/gabriel/pago-768.png) | [1440](docs/capturas/gabriel/pago-1440.png) |
| Pago aprobado y correo simulado | [375](docs/capturas/gabriel/resultado-aprobado-375.png) | [768](docs/capturas/gabriel/resultado-aprobado-768.png) | [1440](docs/capturas/gabriel/resultado-aprobado-1440.png) |
| Boleto con QR | [375](docs/capturas/gabriel/boleto-375.png) | [768](docs/capturas/gabriel/boleto-768.png) | [1440](docs/capturas/gabriel/boleto-1440.png) |
| Verificación del QR | [375](docs/capturas/gabriel/verificar-valido-375.png) | [768](docs/capturas/gabriel/verificar-valido-768.png) | [1440](docs/capturas/gabriel/verificar-valido-1440.png) |
| Dashboard | [375](docs/capturas/eddie/dashboard-375.png) | [768](docs/capturas/eddie/dashboard-768.png) | [1440](docs/capturas/eddie/dashboard-1440.png) |
| CRUD de eventos | [375](docs/capturas/eddie/eventos-375.png) | [768](docs/capturas/eddie/eventos-768.png) | [1440](docs/capturas/eddie/eventos-1440.png) |
| Inventario y precios | [375](docs/capturas/eddie/inventario-375.png) | [768](docs/capturas/eddie/inventario-768.png) | [1440](docs/capturas/eddie/inventario-1440.png) |
| Usuarios | [375](docs/capturas/eddie/usuarios-375.png) | [768](docs/capturas/eddie/usuarios-768.png) | [1440](docs/capturas/eddie/usuarios-1440.png) |
| Reportes | [375](docs/capturas/eddie/reportes-375.png) | [768](docs/capturas/eddie/reportes-768.png) | [1440](docs/capturas/eddie/reportes-1440.png) |
| Reporte de un evento | [375](docs/capturas/eddie/reportes-evento-375.png) | [768](docs/capturas/eddie/reportes-evento-768.png) | [1440](docs/capturas/eddie/reportes-evento-1440.png) |
| Modo sin conexión | [375](docs/capturas/gabriel/offline-375.png) | [768](docs/capturas/gabriel/offline-768.png) | [1440](docs/capturas/gabriel/offline-1440.png) |
| Manifest en DevTools | [captura](docs/capturas/gabriel/devtools-manifest.png) | | |
| Service worker en DevTools | [captura](docs/capturas/gabriel/devtools-service-worker.png) | | |

Hay más capturas (inicio, búsqueda, login, registro, perfil, crear evento y usuario, pago rechazado, Mis boletos) en las mismas carpetas.

## Accesibilidad

HTML semántico, formularios con `<label>` y errores asociados con `aria-describedby`, navegación por teclado, foco visible, enlace "Saltar al contenido", foco en el contenido al cambiar de ruta, `aria-current` en la navegación, `aria-live` en avisos y estados, textos alternativos en imágenes y QR, y tablas alternativas en los gráficos.

## Limitaciones

- **Sin backend:** la autenticación, los pagos, el correo y todas las escrituras son simulados. Los cambios viven en el `localStorage` de cada navegador; otro dispositivo ve los datos de demostración.
- **Contraseña de prueba visible** en `public/api/usuarios.json`, solo con fines de demostración.
- **Verificación del QR académica:** la firma detecta códigos alterados, pero sin servidor no hay una clave secreta real ni control de boletos ya usados.
- **Sin conexión** solo se ve lo que ya se visitó; para pagar se necesita conexión.
- Las órdenes de taquilla son lotes simulados para que los reportes cuadren con el inventario; no generan boletos electrónicos.
