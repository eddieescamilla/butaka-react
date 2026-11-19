// DUEÑO: Gabriel. Módulo 1: gestión de usuarios y autenticación.
// MARCADOR: reemplaza todo el contenido de este archivo con tu pantalla.
// Props que recibe toda pantalla: { params, irA, sesion, carrito }
import MarcadorPantalla from '../../components/MarcadorPantalla.jsx';
import Boton from '../../components/Boton.jsx';

export default function RecuperarPage({ irA }) {
  return (
    <MarcadorPantalla titulo="Recuperar contraseña" responsable="Gabriel" modulo="Gestión de usuarios">
      <Boton variante="texto" onClick={() => irA('login')}>
        Volver a iniciar sesión
      </Boton>
    </MarcadorPantalla>
  );
}
