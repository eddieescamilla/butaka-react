// DUEÑO: Eddie. Navegación del panel de administración.
// Props: { vista, irA, sesion }
import Logo from '../components/Logo.jsx';
import EnlaceVista from '../components/EnlaceVista.jsx';
import Boton from '../components/Boton.jsx';
import { ROLES } from '../data/categorias.js';
import './BarraLateralAdmin.css';

const OPCIONES = [
  { vista: 'admin-dashboard', texto: 'Dashboard', relacionadas: [] },
  { vista: 'admin-eventos', texto: 'Eventos', relacionadas: ['admin-crear-evento'] },
  { vista: 'admin-inventario', texto: 'Inventario y precios', relacionadas: [] },
  { vista: 'admin-usuarios', texto: 'Usuarios', relacionadas: ['admin-crear-usuario'], soloAdmin: true },
  { vista: 'admin-reportes', texto: 'Reportes', relacionadas: [] },
];

export default function BarraLateralAdmin({ vista, irA, sesion }) {
  const esAdministrador = sesion.usuario?.rol === 'admin';
  const opciones = OPCIONES.filter((opcion) => !opcion.soloAdmin || esAdministrador);

  function alCerrarSesion() {
    sesion.cerrarSesion();
    irA('inicio');
  }

  return (
    <aside className="barra-admin">
      <EnlaceVista vista="admin-dashboard" irA={irA} className="barra-admin__logo" aria-label="Butaka, ir al dashboard">
        <Logo />
      </EnlaceVista>

      <nav className="barra-admin__nav" aria-label="Panel de administración">
        <ul>
          {opciones.map((opcion) => (
            <li key={opcion.vista}>
              <EnlaceVista
                vista={opcion.vista}
                irA={irA}
                activo={vista === opcion.vista || opcion.relacionadas.includes(vista)}
                className="barra-admin__enlace"
              >
                {opcion.texto}
              </EnlaceVista>
            </li>
          ))}
        </ul>
      </nav>

      {sesion.usuario && (
        <div className="barra-admin__pie">
          <p className="barra-admin__usuario">
            {sesion.usuario.nombre} {sesion.usuario.apellido}
            <span>{ROLES[sesion.usuario.rol]}</span>
          </p>
          <EnlaceVista vista="inicio" irA={irA} className="barra-admin__sitio">
            Ver sitio del cliente
          </EnlaceVista>
          <Boton variante="secundario" tamano="pequeno" onClick={alCerrarSesion}>
            Cerrar sesión
          </Boton>
        </div>
      )}
    </aside>
  );
}
