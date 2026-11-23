# Cómo trabajamos en este repositorio

Este archivo es el acuerdo del equipo para la tercera entrega. La idea sigue siendo la misma: **cada uno trabaja en lo suyo, en sus propias ramas, hace sus commits, abre su pull request y hace su merge, sin chocar con el otro**. Para eso, cada archivo tiene un solo dueño.

## 1. Quién es dueño de qué

| Carpeta o archivo | Dueño | Módulos del MVP |
|---|---|---|
| `src/features/eventos/` | Eddie | 2. Gestión de eventos |
| `src/features/admin/` | Eddie | 3. Inventario y precios · 7. Panel de administración · 8. Reportes |
| `src/layout/`, `src/app/`, `src/pages/` | Eddie | Layout, React Router, rutas protegidas, 404 |
| `src/api/`, `public/api/`, `scripts/` | Eddie | API falsa y datos de prueba |
| `.github/workflows/`, `public/.nojekyll` | Eddie | Publicación en GitHub Pages |
| `README.md`, `CONTRIBUIR.md`, `docs/arquitectura.md`, `docs/capturas/eddie/` | Eddie | Documentación |
| `src/features/cuenta/` | Gabriel | 1. Gestión de usuarios y autenticación |
| `src/features/compra/` | Gabriel | 4. Proceso de compra · 5. Pagos · 6. Boletos electrónicos |
| `src/features/pwa/`, `public/iconos/` | Gabriel | PWA: manifest, service worker, avisos |
| `vite.config.js` | Gabriel (desde la rama `base`) | Configuración de la PWA |
| `docs/cuenta-y-compra.md`, `docs/pwa.md`, `docs/capturas/gabriel/` | Gabriel | Documentación |

**Regla de oro:** solo creas, editas o borras archivos dentro de tus carpetas. Si un archivo no es tuyo, no lo tocas.

### Archivos compartidos (congelados)

Nadie los modifica después de la rama `base`: `package.json`, `package-lock.json`, `index.html`, `src/main.jsx`, `src/components/`, `src/hooks/`, `src/utils/`, `src/styles/` y `src/data/categorias.js`.

`package.json` ya trae todas las librerías de la entrega (`react-router`, `qrcode`, `vite-plugin-pwa` y `workbox-window`), para que nadie tenga que instalar nada después.

## 2. Orden de trabajo

1. **Eddie fusiona primero la rama `base`** (router, API falsa, contextos compartidos y GitHub Pages).
2. A partir de ahí, **cada uno trabaja en paralelo** y fusiona sus ramas cuando quiera. `main` siempre compila.
3. Cada rama sale de `main` actualizado (`git switch main && git pull`) y se fusiona con un pull request.

| Eddie | Gabriel |
|---|---|
| `eddie/base-router-api` (primero) | `gabriel/sesion-carrito-context` |
| `eddie/eventos-router-preferencias` | `gabriel/cuenta-router` |
| `eddie/panel-crud-api` | `gabriel/compra-checkout` |
| `eddie/reportes-ordenes` | `gabriel/boletos-qr` |
| `eddie/documentacion-final` | `gabriel/pwa` |
| | `gabriel/documentacion-pwa` |

## 3. El contrato: lo que conecta nuestro trabajo

### Cada módulo registra sus rutas en `modulo.jsx`

El router (`src/app/router.jsx`) descubre solo los archivos `src/features/*/modulo.jsx`. Nadie edita el router para agregar una pantalla:

```jsx
// src/features/compra/modulo.jsx
export default {
  nombre: 'compra',
  Proveedor: CarritoProveedor,              // Context que envuelve toda la app
  rutas: {
    publicas: [{ path: 'carrito', Component: CarritoPage, handle: { titulo: 'Carrito' } }],
    privadas: [{ path: 'boletos', Component: MisBoletosPage, handle: { titulo: 'Mis boletos' } }],
  },
};
```

| Grupo | Layout | Protección |
|---|---|---|
| `publicas` | Cliente | Ninguna |
| `privadas` | Cliente | Sesión (si no hay, redirige a `/login` con `state.desde`) |
| `panel` | Admin, bajo `/admin` | Administrador u organizador |
| `soloAdmin` | Admin, bajo `/admin` | Solo administrador |

`handle.titulo` es el título de la pestaña. Para cargar una pantalla solo cuando se visita, usa `lazy: perezosa(() => import('./MiPage.jsx'))` de `src/app/modulos.js`.

### Mapa de rutas

| Ruta | Pantalla | Dueño | Acceso |
|---|---|---|---|
| `/` | Inicio | Eddie | Público |
| `/eventos?q=` | Listado y búsqueda | Eddie | Público |
| `/eventos/:id` | Detalle del evento | Eddie | Público |
| `/eventos/:id/boletos` | Elegir zona y cantidad ← **aquí se conectan Eddie y Gabriel** | Gabriel | Público |
| `/carrito` | Carrito | Gabriel | Público |
| `/checkout` | Resumen de compra | Gabriel | Público (pide iniciar sesión para pagar) |
| `/checkout/pago`, `/checkout/resultado` | Pago simulado y resultado | Gabriel | Sesión |
| `/boletos`, `/boletos/:codigo` | Mis boletos y boleto con QR | Gabriel | Sesión |
| `/verificar/:codigo?f=` | Verificación del QR | Gabriel | Público |
| `/login`, `/registro`, `/recuperar` | Cuenta | Gabriel | Público |
| `/perfil` | Perfil | Gabriel | Sesión |
| `/admin` | Dashboard | Eddie | Administrador u organizador |
| `/admin/eventos`, `/admin/eventos/nuevo`, `/admin/eventos/:id/editar` | CRUD de eventos | Eddie | Administrador u organizador |
| `/admin/inventario?evento=` | Inventario y precios | Eddie | Administrador u organizador |
| `/admin/usuarios`, `/admin/usuarios/nuevo`, `/admin/usuarios/:id/editar` | Usuarios | Eddie | Administrador |
| `/admin/reportes` | Reportes | Eddie | Administrador |
| `*` | 404 | Compartida | Público |

### Estado global con Context y `useReducer`

Las pantallas leen el estado global con hooks, sin recibir props:

| Hook | Dueño | Devuelve (no cambiar los nombres) |
|---|---|---|
| `useSesion()` de `features/cuenta/useSesion.js` | Gabriel | `usuario`, `haySesion`, `esAdmin`, `iniciarSesion(u)`, `cerrarSesion()`, `actualizarUsuario(cambios)` |
| `useCarrito()` de `features/compra/useCarrito.js` | Gabriel | `items`, `totalItems`, `subtotal`, `cargoServicio`, `total`, `agregar(item)`, `cambiarCantidad(clave, n)`, `quitar(clave)`, `vaciar()` |
| `usePreferencias()` de `features/eventos/PreferenciasContext.jsx` | Eddie | `preferencias`, `cambiarPreferencia(nombre, valor)`, `restablecerPreferencias()` |

Forma de un item del carrito: `{ clave, eventoId, eventoTitulo, fecha, lugar, zonaId, zonaNombre, precio, cantidad }`.

### API falsa (`src/api/`)

Los componentes nunca usan `fetch` ni `localStorage` para los datos: llaman a las funciones de `src/api/` con `usePeticion`, que maneja carga, error, vacío y cancelación con `AbortController`.

```jsx
const { estado, datos, error, reintentar } = usePeticion(
  (signal) => listarEventos({ busqueda, categoria }, { signal }),
  [busqueda, categoria],
);
```

| Archivo | Funciones |
|---|---|
| `api/eventos.js` | `listarEventos`, `obtenerEvento`, `crearEvento`, `actualizarEvento`, `eliminarEvento`, `guardarZona`, `eliminarZona` |
| `api/usuarios.js` | `autenticar`, `existeCorreo`, `registrarCliente`, `listarUsuarios`, `crearUsuario`, `actualizarUsuario`, `cambiarEstadoUsuario`, `CONTRASENA_DEMO` |
| `api/ordenes.js` | `listarOrdenes`, `obtenerOrden`, `obtenerBoleto`, `crearOrden`, `verificarBoleto`, `firmarBoleto` |
| `api/cliente.js` | `leerColeccion`, `escribirColeccion`, `restablecerDatos`, `ErrorApi` |

### Claves de `localStorage`

| Clave | Dueño | Contenido |
|---|---|---|
| `butaka:api:eventos`, `butaka:api:usuarios`, `butaka:api:ordenes` | Eddie (API) | Colecciones modificadas por la app |
| `butaka:preferencias` | Eddie | Categoría y orden del listado |
| `butaka:sesion` | Gabriel | Usuario con sesión (sin contraseña) |
| `butaka:carrito` | Gabriel | Items del carrito |

## 4. Commits y pull requests

- Mensajes en español, en presente y describiendo el cambio: `Agrega el CRUD de eventos sobre la API falsa`.
- Un pull request por rama, con una descripción de qué cambia y cómo probarlo.
- Antes de fusionar: `npm run build` sin errores y la app sin errores en la consola.
- Cada quien fusiona sus propios pull requests.
