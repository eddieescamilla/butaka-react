// DUEÑO: Gabriel. Módulo 1: gestión de usuarios y autenticación.
// MARCADOR: reemplaza todo el contenido de este archivo con tu pantalla.
// Props que recibe toda pantalla: { params, irA, sesion, carrito }
import MarcadorPantalla from '../../components/MarcadorPantalla.jsx';

export default function PerfilPage({ sesion }) {
  return (
    <MarcadorPantalla titulo="Mi perfil" responsable="Gabriel" modulo="Gestión de usuarios">
      <p>
        Sesión de: {sesion.usuario.nombre} {sesion.usuario.apellido} ({sesion.usuario.correo})
      </p>
    </MarcadorPantalla>
  );
}
