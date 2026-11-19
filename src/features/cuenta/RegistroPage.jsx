// DUEÑO: Gabriel. Módulo 1: gestión de usuarios y autenticación.
// MARCADOR: reemplaza todo el contenido de este archivo con tu pantalla.
// Props que recibe toda pantalla: { params, irA, sesion, carrito }
import MarcadorPantalla from '../../components/MarcadorPantalla.jsx';
import Boton from '../../components/Boton.jsx';

export default function RegistroPage({ irA }) {
  return (
    <MarcadorPantalla titulo="Crear cuenta" responsable="Gabriel" modulo="Gestión de usuarios">
      <Boton variante="texto" onClick={() => irA('login')}>
        Ya tengo cuenta
      </Boton>
    </MarcadorPantalla>
  );
}
