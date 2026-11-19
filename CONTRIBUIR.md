# Cómo trabajamos en este repositorio

Este archivo es el acuerdo del equipo. La idea es que **cada uno trabaje en lo suyo, haga commit y push cuando quiera, y nunca choque con el otro**. Para eso, cada archivo tiene un solo dueño.

## 1. Quién es dueño de qué

| Carpeta o archivo | Dueño | Módulos del MVP |
|---|---|---|
| `src/features/eventos/` | Eddie | 2. Gestión de eventos |
| `src/features/admin/` | Eddie | 3. Inventario y precios · 7. Panel de administración · 8. Reportes |
| `src/layout/` | Eddie | Encabezado, pie de página y barra lateral del panel |
| `src/data/reportes.js` | Eddie | Datos estáticos de reportes |
| `README.md`, `docs/arquitectura.md`, `docs/capturas/eddie/` | Eddie | Documentación |
| `src/features/cuenta/` | Gabriel | 1. Gestión de usuarios y autenticación |
| `src/features/compra/` | Gabriel | 4. Proceso de compra · 5. Pagos · 6. Boletos electrónicos |
| `src/data/ordenes.js` | Gabriel | Órdenes de ejemplo |
| `docs/cuenta-y-compra.md`, `docs/capturas/gabriel/` | Gabriel | Documentación |

**Regla de oro:** solo creas, editas o borras archivos dentro de tus carpetas. Si un archivo no es tuyo, no lo tocas.

## 2. Archivos compartidos (congelados)

Estos archivos ya funcionan y **nadie los modifica**. Los dos los pueden usar (importar), pero no cambiar:

- `src/App.jsx` y `src/rutas.js`: navegación y registro de pantallas
- `src/styles/tokens.css` y `src/styles/base.css`: manual de marca y estilos generales
- `src/components/`: componentes base del Design System
- `src/data/eventos.js`, `src/data/usuarios.js`, `src/data/categorias.js`
- `src/servicios/`, `src/utils/` y `src/hooks/`
- `package.json`, `vite.config.js`, `index.html`

¿Necesitas algo que no existe?

1. **Primero, créalo en tu carpeta.** Por ejemplo, un botón especial va en `src/features/compra/BotonPagar.jsx`, no en `src/components/`. Una pantalla interna (como un paso extra) puede ser un estado dentro de tu propia pantalla, sin agregar una vista nueva.
2. **Si de verdad hay que cambiar algo compartido** (por ejemplo, instalar una librería o corregir un error en un componente base), avisa por WhatsApp **antes**, haz ese cambio en un commit aparte que solo toque ese archivo, súbelo de inmediato y avisa cuando esté arriba.

## 3. El contrato: lo que conecta nuestro trabajo

### Toda pantalla recibe las mismas props

```jsx
export default function MiPantalla({ params, irA, sesion, carrito }) { ... }
```

| Prop | Qué es |
|---|---|
| `params` | Datos que mandó la pantalla anterior (por ejemplo `{ eventoId: 'evt-001' }`) |
| `irA(vista, params)` | Cambia de pantalla. Ejemplo: `irA('seleccion', { eventoId })` |
| `sesion` | Lo que devuelve `useSesion()` |
| `carrito` | Lo que devuelve `useCarrito()` |

Para enlaces dentro del texto o de un menú, usa `<EnlaceVista vista="..." irA={irA}>`. Para acciones, usa `<Boton onClick={() => irA(...)}>`.

### Vistas y parámetros que esperan

| Vista | Dueño | Parámetros |
|---|---|---|
| `inicio` | Eddie | (ninguno) |
| `resultados` | Eddie | `{ busqueda }` |
| `detalle-evento` | Eddie | `{ eventoId }` |
| `login` | Gabriel | `{ volverA, volverParams }` (los pone App.jsx si la vista pedía sesión) |
| `registro`, `recuperar`, `perfil` | Gabriel | (ninguno) |
| `seleccion` | Gabriel | `{ eventoId }` ← **aquí se conectan Eddie y Gabriel** |
| `carrito`, `resumen`, `pago` | Gabriel | (ninguno; los datos están en `carrito`) |
| `resultado-pago` | Gabriel | `{ resultado: 'aprobado' \| 'rechazado', ordenId }` |
| `mis-boletos` | Gabriel | (ninguno) |
| `boleto` | Gabriel | `{ codigo }` |
| `admin-dashboard`, `admin-eventos`, `admin-crear-evento`, `admin-inventario`, `admin-usuarios`, `admin-crear-usuario`, `admin-reportes` | Eddie | (ninguno; el panel puede usar `params` internos si los necesita) |

App.jsx ya protege las vistas: si una pide sesión y no la hay, muestra `login`; si el rol no tiene permiso, muestra `sin-permiso`.

### `useSesion()` (dueño: Gabriel)

Gabriel puede cambiar **cómo** funciona por dentro, pero no los nombres de lo que devuelve:

`usuario` · `haySesion` · `esAdmin` · `iniciarSesion(usuario)` · `cerrarSesion()` · `actualizarUsuario(cambios)`

### `useCarrito()` (dueño: Gabriel)

`items` · `totalItems` · `subtotal` · `cargoServicio` · `total` · `agregar(item)` · `cambiarCantidad(clave, n)` · `quitar(clave)` · `vaciar()`

Forma de cada item: `{ clave, eventoId, eventoTitulo, fecha, lugar, zonaId, zonaNombre, precio, cantidad }`

### Datos de eventos

Siempre se piden con las funciones de `src/servicios/eventos.js` y el hook `usePeticion`, para que haya estados de carga, error y vacío:

```jsx
const { estado, datos, error, reintentar } = usePeticion(
  (signal) => obtenerEventoPorId(params.eventoId, { signal }),
  [params.eventoId],
);
if (estado === 'cargando') return <EstadoCarga />;
if (estado === 'error') return <EstadoError mensaje={error} onReintentar={reintentar} />;
```

Los cálculos (disponibles por zona, precio desde, vendidos) están en `src/utils/eventos.js`.

## 4. Claves de localStorage

Cada clave tiene un solo dueño. Todas empiezan con `butaka:`.

| Clave | Dueño | Contenido |
|---|---|---|
| `butaka:sesion` | Gabriel | Usuario con sesión iniciada (sin contraseña) |
| `butaka:carrito` | Gabriel | Items del carrito |
| `butaka:ordenes` | Gabriel | Órdenes y boletos comprados |
| `butaka:preferencias` | Eddie | Último filtro de categoría y orden del listado |
| `butaka:admin-*` | Eddie | Cambios hechos desde el panel (eventos y usuarios creados o eliminados) |

Para guardar algo nuevo, usa `useLocalStorage('butaka:tu-clave', valorInicial)`. El valor se escribe en el momento, así que puedes llamar a `irA(...)` justo después de guardar sin perder nada.

Datos que cambia el panel de administración y que el resto de la app puede leer:
- **Eventos:** `src/servicios/eventos.js` ya usa `butaka:admin-eventos`. Si pides los eventos con `obtenerEventos` u `obtenerEventoPorId`, ves los cambios del panel automáticamente.
- **Usuarios:** si el login usa `listaUsuarios()` de `src/servicios/usuarios.js` en lugar de `USUARIOS`, también reconoce los usuarios creados o desactivados desde el panel.

## 5. Estilos

- Cada componente tiene su CSS al lado: `TarjetaEvento.jsx` + `TarjetaEvento.css`.
- Las clases siguen **BEM en español** y empiezan con el nombre del componente: `.tarjeta-evento__titulo`, `.formulario-pago__campo`. Como el CSS es global, esto evita que una clase de uno pise la del otro.
- Usa siempre las variables de `tokens.css` (`var(--primario)`, `var(--espacio-2)`...). No escribas colores sueltos.
- **Breakpoints** (mobile first):
  - móvil: estilos base, se revisa a **375 px**;
  - tablet: `@media (min-width: 768px)`;
  - escritorio: `@media (min-width: 1024px)`, se revisa a **1440 px**.
- Nada puede provocar scroll horizontal. Las tablas anchas van dentro de un contenedor con `overflow-x: auto`.

## 6. Git: una rama por módulo y pull request

Nadie trabaja directo en `main`. Cada módulo va en su propia rama y entra a `main` con un pull request (PR). Como cada uno toca solo sus carpetas, los PR se pueden unir sin esperar al otro.

| Rama | Dueño | Contenido |
|---|---|---|
| `feature/eventos` | Eddie | `src/features/eventos/` |
| `feature/panel-admin` | Eddie | `src/features/admin/`, `src/layout/`, `src/data/reportes.js`, `README.md` |
| `feature/cuenta` | Gabriel | `src/features/cuenta/` |
| `feature/compra` | Gabriel | `src/features/compra/`, `src/data/ordenes.js`, `docs/cuenta-y-compra.md` |
| `fix/...` | Quien lo necesite | Correcciones a archivos compartidos (avisar antes) |

```bash
# 1. Partir siempre de main actualizado
git switch main
git pull

# 2. Crear la rama del módulo (solo la primera vez; después: git switch feature/compra)
git switch -c feature/compra

# 3. Trabajar... y agregar SOLO tus carpetas
git add src/features/compra
git commit -m "Agrega el formulario de pago con validación"

# 4. Subir la rama
git push -u origin feature/compra
```

5. En GitHub aparece el botón **Compare & pull request**: crea el PR hacia `main` y pulsa **Merge pull request**. Cada uno une sus propios PR.
6. Después de unir un PR, vuelve a `main` y actualízala con `git switch main` y `git pull`.

- **Nunca uses `git add .`**: así evitas subir por accidente un archivo que no es tuyo.
- Mensajes de commit en español, en presente: "Agrega…", "Corrige…", "Ajusta…".
- Si `main` cambió mientras trabajabas en tu rama, tráelo con `git pull origin main` antes de crear el PR. Como no tocamos los mismos archivos, se une solo.

## 7. Antes de dar una pantalla por terminada

- [ ] Se ve bien a 375, 768 y 1440 px, sin scroll horizontal.
- [ ] Se puede usar solo con teclado (Tab, Enter, Escape) y el foco se ve.
- [ ] Cada campo tiene su `<label>` (usa `CampoTexto`) y los errores dicen qué corregir.
- [ ] Las imágenes tienen `alt`.
- [ ] Tiene estado de carga, error con "Reintentar" y vacío, si pide datos.
- [ ] Los botones que guardan o compran usan `cargando` para evitar el doble envío.
- [ ] Ya no usa `MarcadorPantalla`.
- [ ] Las capturas en los tres anchos están en `docs/capturas/<tu-nombre>/`.

## 8. Usuarios de prueba

Contraseña de todos: `Butaka2026`

| Correo | Rol |
|---|---|
| `ana.lopez@correo.com` | Cliente (ya tiene órdenes de ejemplo) |
| `carlos.m@correo.com` | Administrador |
| `sofia.h@correo.com` | Organizador |
| `diego.r@correo.com` | Cliente inactivo (no debería poder entrar) |
