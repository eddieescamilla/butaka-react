# Butaka: Tu lugar te espera

Implementación en React del MVP de **Butaka**, una plataforma de venta y gestión de boletos para conciertos, teatro y deportes en El Salvador. Segunda entrega del proyecto: traslada el prototipo de Figma a una aplicación funcional con datos simulados y persistencia en el navegador.

> **Pendiente:** completar las secciones marcadas con ✏️ antes de la entrega.

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

### Eventos y panel de administración (Eddie)

✏️ Completar con los componentes de `features/eventos/` y `features/admin/`.

### Cuenta, compra y boletos (Gabriel)

Ver [docs/cuenta-y-compra.md](docs/cuenta-y-compra.md).

## Mapa de estado y persistencia

| Estado | Dónde vive | Quién lo usa | Persistencia |
|---|---|---|---|
| Vista actual y parámetros | `App.jsx` (`useState`) | Todas las pantallas, vía `irA` | Historial del navegador (botón Atrás y recarga) |
| Sesión | `useSesion()` en `App.jsx` | Encabezado, panel, pantallas protegidas | `localStorage` → `butaka:sesion` |
| Carrito | `useCarrito()` en `App.jsx` | Encabezado, flujo de compra | `localStorage` → `butaka:carrito` |
| Órdenes y boletos | ✏️ | Mis boletos, boleto | `localStorage` → `butaka:ordenes` |
| Preferencias | `usePreferencias()` | Listado de eventos | `localStorage` → `butaka:preferencias` |
| Datos de cada pantalla | `usePeticion()` en cada pantalla | La pantalla que los pide | No se guardan |

Valores derivados que se calculan y no se guardan como estado: `totalItems`, `subtotal`, `cargoServicio` y `total` del carrito; `haySesion` y `esAdmin` de la sesión; disponibilidad por zona y "precio desde" de cada evento.

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

✏️ Agregar las capturas de `docs/capturas/` en los tres breakpoints (375, 768 y 1440 px).

## Limitaciones y decisiones de diseño

- **Sin backend:** la autenticación, los pagos y el envío de correos son simulados. La contraseña de prueba está en los datos simulados solo con fines de demostración.
- **Navegación sin React Router:** la vista actual se guarda en el estado de `App.jsx` y se sincroniza con el historial del navegador, para que funcionen el botón Atrás y la recarga.
- **Estado global sin Context:** la sesión y el carrito viven en `App.jsx` y se pasan por props. Context se incorpora en la tercera entrega.
- **Color de advertencia:** se oscureció de `#F59E0B` a `#B45309` para cumplir el contraste mínimo cuando se usa como texto.
- ✏️ Agregar las decisiones propias de cada módulo.
