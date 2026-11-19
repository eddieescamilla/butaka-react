// DUEÑO: Eddie. Encabezado del sitio: logo, buscador, navegación, carrito y sesión.
// Props: { vista, irA, sesion, carrito }
// Usa del contrato de Gabriel: carrito.totalItems, sesion.usuario,
// sesion.esAdmin y sesion.cerrarSesion().
import { useState } from 'react';
import Logo from '../components/Logo.jsx';
import Boton from '../components/Boton.jsx';
import EnlaceVista from '../components/EnlaceVista.jsx';
import './Encabezado.css';

export default function Encabezado({ vista, irA, sesion, carrito }) {
  const [busqueda, setBusqueda] = useState('');

  function alBuscar(evento) {
    evento.preventDefault();
    irA('resultados', { busqueda: busqueda.trim() });
  }

  function alCerrarSesion() {
    sesion.cerrarSesion();
    irA('inicio');
  }

  const textoCarrito =
    carrito.totalItems === 1 ? 'Carrito: 1 boleto' : `Carrito: ${carrito.totalItems} boletos`;

  return (
    <header className="encabezado">
      <div className="contenedor encabezado__contenido">
        <EnlaceVista vista="inicio" irA={irA} className="encabezado__logo" aria-label="Butaka, ir al inicio">
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
              <EnlaceVista vista="inicio" irA={irA} activo={vista === 'inicio' || vista === 'resultados'}>
                Eventos
              </EnlaceVista>
            </li>
            <li>
              <EnlaceVista vista="mis-boletos" irA={irA} activo={vista === 'mis-boletos' || vista === 'boleto'}>
                Mis boletos
              </EnlaceVista>
            </li>
            {sesion.esAdmin && (
              <li>
                <EnlaceVista vista="admin-dashboard" irA={irA}>
                  Panel
                </EnlaceVista>
              </li>
            )}
          </ul>
        </nav>

        <div className="encabezado__acciones">
          <EnlaceVista
            vista="carrito"
            irA={irA}
            activo={vista === 'carrito'}
            className="encabezado__carrito"
            aria-label={textoCarrito}
          >
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
          </EnlaceVista>

          {sesion.haySesion ? (
            <>
              <EnlaceVista vista="perfil" irA={irA} activo={vista === 'perfil'} className="encabezado__saludo">
                Hola, {sesion.usuario.nombre}
              </EnlaceVista>
              <Boton variante="secundario" tamano="pequeno" onClick={alCerrarSesion}>
                Cerrar sesión
              </Boton>
            </>
          ) : (
            <Boton tamano="pequeno" onClick={() => irA('login')}>
              Iniciar sesión
            </Boton>
          )}
        </div>
      </div>
    </header>
  );
}
