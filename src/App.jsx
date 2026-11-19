// ARCHIVO COMPARTIDO (congelado). Ver CONTRIBUIR.md antes de cambiarlo.
//
// App es el único lugar donde viven los tres estados globales:
//   - navegación: qué vista se muestra y con qué parámetros
//   - sesion:     useSesion() (Gabriel)
//   - carrito:    useCarrito() (Gabriel)
// y los pasa como props a los layouts y a cada pantalla.
//
// Toda pantalla recibe exactamente estas props:
//   { params, irA, sesion, carrito }

import { useCallback, useEffect, useRef, useState } from 'react';
import { VISTAS } from './rutas.js';
import { useSesion } from './features/cuenta/useSesion.js';
import { useCarrito } from './features/compra/useCarrito.js';
import LayoutCliente from './layout/LayoutCliente.jsx';
import LayoutAdmin from './layout/LayoutAdmin.jsx';

// Lee la vista inicial desde el historial del navegador (para que recargar
// la página no te regrese siempre al inicio)
function navegacionInicial() {
  const guardada = window.history.state;
  if (guardada?.vista && VISTAS[guardada.vista]) return guardada;
  const desdeHash = window.location.hash.slice(1);
  if (desdeHash && VISTAS[desdeHash]) return { vista: desdeHash, params: {} };
  return { vista: 'inicio', params: {} };
}

export default function App() {
  const sesion = useSesion();
  const carrito = useCarrito();
  const [navegacion, setNavegacion] = useState(navegacionInicial);

  // irA('detalle-evento', { eventoId: 'evt-001' })
  const irA = useCallback((vista, params = {}) => {
    const destino = VISTAS[vista] ? { vista, params } : { vista: 'no-encontrada', params: {} };
    window.history.pushState(destino, '', `#${destino.vista}`);
    setNavegacion(destino);
  }, []);

  // Botones Atrás y Adelante del navegador
  useEffect(() => {
    function alCambiarHistorial(evento) {
      // Los saltos dentro de la página (#contenido) no traen vista: se ignoran
      if (evento.state?.vista) setNavegacion(evento.state);
    }
    window.addEventListener('popstate', alCambiarHistorial);
    return () => window.removeEventListener('popstate', alCambiarHistorial);
  }, []);

  // Guarda la vista inicial en el historial una sola vez
  useEffect(() => {
    window.history.replaceState(navegacion, '', `#${navegacion.vista}`);
    // Solo al montar
  }, []);

  // Decide qué vista se dibuja realmente (protección por sesión y por rol).
  // Se calcula en cada render; no se guarda como estado aparte.
  let { vista, params } = navegacion;
  const configuracion = VISTAS[vista] ?? VISTAS['no-encontrada'];
  if (configuracion.requiereSesion && !sesion.haySesion) {
    // Al iniciar sesión, LoginPage regresa a la vista que se pidió
    params = { volverA: vista, volverParams: params };
    vista = 'login';
  } else if (configuracion.roles && !configuracion.roles.includes(sesion.usuario?.rol)) {
    vista = 'sin-permiso';
  }
  const { componente: Pagina, area, titulo } = VISTAS[vista] ?? VISTAS['no-encontrada'];

  // Al cambiar de pantalla: título de la pestaña, scroll arriba y foco en el contenido
  const primeraVez = useRef(true);
  useEffect(() => {
    document.title = `${titulo} · Butaka`;
    if (primeraVez.current) {
      primeraVez.current = false;
      return;
    }
    window.scrollTo(0, 0);
    document.getElementById('contenido')?.focus({ preventScroll: true });
  }, [navegacion, vista, titulo]);

  const Layout = area === 'admin' ? LayoutAdmin : LayoutCliente;

  return (
    <Layout vista={vista} irA={irA} sesion={sesion} carrito={carrito}>
      {/* key: si cambian la vista o sus parámetros, la pantalla empieza desde cero */}
      <Pagina
        key={`${vista}:${JSON.stringify(params)}`}
        params={params}
        irA={irA}
        sesion={sesion}
        carrito={carrito}
      />
    </Layout>
  );
}
