// DUEÑO: Eddie. Encabezado del sitio: logo, buscador, navegación, carrito y sesión.
// Lee la sesión y el carrito de sus Context (useSesion y useCarrito de Gabriel),
// sin recibir props. La búsqueda navega a /eventos?q=texto.
import { useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router';
import Logo from '../components/Logo.jsx';
import Boton from '../components/Boton.jsx';
import EnlaceVista from '../components/EnlaceVista.jsx';
import { useSesion } from '../features/cuenta/useSesion.js';
import { useCarrito } from '../features/compra/useCarrito.js';
import './Encabezado.css';

export default function Encabezado() {
  const sesion = useSesion();
  const carrito = useCarrito();
  const navegar = useNavigate();
  const [parametros] = useSearchParams();
  const [busqueda, setBusqueda] = useState(parametros.get('q') ?? '');

  function alBuscar(evento) {
    evento.preventDefault();
    const texto = busqueda.trim();
    navegar(texto ? `/eventos?q=${encodeURIComponent(texto)}` : '/eventos');
  }

  function alCerrarSesion() {
    sesion.cerrarSesion();
    navegar('/');
  }

  const textoCarrito = carrito.totalItems === 1 ? 'Carrito: 1 boleto' : `Carrito: ${carrito.totalItems} boletos`;

  return (
    <header className="encabezado">
      <div className="contenedor encabezado__contenido">
        <EnlaceVista a="/" className="encabezado__logo" aria-label="Butaka, ir al inicio">
          <Logo />
        </EnlaceVista>

        <form className="encabezado__buscador" role="search" onSubmit={alBuscar}>
          <label htmlFor="buscar-eventos" className="sr-only">
            Buscar eventos
          </label>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            id="buscar-eventos"
            type="search"
            placeholder="Busca eventos, artistas o lugares"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
          />
        </form>

        <nav className="encabezado__nav" aria-label="Navegación principal">
          <ul>
            <li>
              <NavLink to="/eventos" className="enlace-vista">
                Eventos
              </NavLink>
            </li>
            <li>
              <NavLink to="/boletos" className="enlace-vista">
                Mis boletos
              </NavLink>
            </li>
            {sesion.esAdmin && (
              <li>
                <NavLink to="/admin" className="enlace-vista">
                  Panel
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        <div className="encabezado__acciones">
          <NavLink to="/carrito" className="enlace-vista encabezado__carrito" aria-label={textoCarrito}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            {carrito.totalItems > 0 && (
              <span className="encabezado__contador" aria-hidden="true">
                {carrito.totalItems}
              </span>
            )}
          </NavLink>

          {sesion.haySesion ? (
            <>
              <NavLink to="/perfil" className="enlace-vista encabezado__saludo">
                Hola, {sesion.usuario.nombre}
              </NavLink>
              <Boton variante="secundario" tamano="pequeno" onClick={alCerrarSesion}>
                Cerrar sesión
              </Boton>
            </>
          ) : (
            <Boton tamano="pequeno" onClick={() => navegar('/login')}>
              Iniciar sesión
            </Boton>
          )}
        </div>
      </div>
    </header>
  );
}
