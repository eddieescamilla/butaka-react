// DUEÑO: Eddie. Navegación del panel de administración.
// NavLink marca con aria-current="page" la sección activa, también en sus
// subrutas (/admin/eventos/nuevo deja marcado "Eventos").
import { NavLink, useNavigate } from 'react-router';
import Logo from '../components/Logo.jsx';
import Boton from '../components/Boton.jsx';
import EnlaceVista from '../components/EnlaceVista.jsx';
import { ROLES } from '../data/categorias.js';
import { useSesion } from '../features/cuenta/useSesion.js';
import './BarraLateralAdmin.css';

const OPCIONES = [
  { ruta: '/admin', texto: 'Dashboard', fin: true },
  { ruta: '/admin/eventos', texto: 'Eventos' },
  { ruta: '/admin/inventario', texto: 'Inventario y precios' },
  { ruta: '/admin/usuarios', texto: 'Usuarios', soloAdmin: true },
  { ruta: '/admin/reportes', texto: 'Reportes', soloAdmin: true },
];

export default function BarraLateralAdmin() {
  const sesion = useSesion();
  const navegar = useNavigate();
  const esAdministrador = sesion.usuario?.rol === 'admin';
  const opciones = OPCIONES.filter((opcion) => !opcion.soloAdmin || esAdministrador);

  function alCerrarSesion() {
    sesion.cerrarSesion();
    navegar('/');
  }

  return (
    <aside className="barra-admin">
      <EnlaceVista a="/admin" className="barra-admin__logo" aria-label="Butaka, ir al dashboard">
        <Logo />
      </EnlaceVista>

      <nav className="barra-admin__nav" aria-label="Panel de administración">
        <ul>
          {opciones.map((opcion) => (
            <li key={opcion.ruta}>
              <NavLink to={opcion.ruta} end={opcion.fin} className="enlace-vista barra-admin__enlace">
                {opcion.texto}
              </NavLink>
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
          <EnlaceVista a="/" className="barra-admin__sitio">
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
