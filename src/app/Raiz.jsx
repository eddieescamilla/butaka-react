// ARCHIVO COMPARTIDO (congelado). Ruta raíz de la aplicación.
//   - Envuelve todo con los Context Providers que registran los módulos
//     (sesión, carrito, preferencias…), sin prop drilling.
//   - Dibuja los componentes globales de los módulos (avisos de la PWA).
//   - Al navegar: actualiza el título de la pestaña (handle.titulo de la ruta),
//     mueve el foco al contenido y muestra una barra de progreso mientras
//     se descarga una pantalla con carga diferida.
import { useEffect, useRef } from 'react';
import { Outlet, ScrollRestoration, useLocation, useMatches, useNavigation } from 'react-router';
import { MODULOS } from './modulos.js';
import './Raiz.css';

function EfectosDeNavegacion() {
  const matches = useMatches();
  const { pathname } = useLocation();
  const titulo = [...matches].reverse().find((match) => match.handle?.titulo)?.handle.titulo;

  useEffect(() => {
    document.title = titulo ? `${titulo} · Butaka` : 'Butaka: Tu lugar te espera';
  }, [titulo, pathname]);

  // En cada cambio de ruta (no en la primera carga) el foco va al contenido,
  // para que el lector de pantalla anuncie la pantalla nueva
  const primeraVez = useRef(true);
  useEffect(() => {
    if (primeraVez.current) {
      primeraVez.current = false;
      return;
    }
    document.getElementById('contenido')?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}

function BarraProgreso() {
  const navegacion = useNavigation();
  if (navegacion.state === 'idle') return null;
  return <div className="barra-progreso" role="progressbar" aria-label="Cargando la página" />;
}

const PROVEEDORES = MODULOS.filter((modulo) => modulo.Proveedor).map((modulo) => modulo.Proveedor);
const GLOBALES = MODULOS.filter((modulo) => modulo.Global).map((modulo) => ({ nombre: modulo.nombre, Global: modulo.Global }));

export default function Raiz() {
  const contenido = (
    <>
      <BarraProgreso />
      <EfectosDeNavegacion />
      <Outlet />
      {GLOBALES.map(({ nombre, Global }) => (
        <Global key={nombre} />
      ))}
      <ScrollRestoration />
    </>
  );

  // [A, B, C] → <A><B><C>{contenido}</C></B></A>
  return PROVEEDORES.reduceRight((hijos, Proveedor) => <Proveedor>{hijos}</Proveedor>, contenido);
}
