// DUEÑO: Gabriel. Módulo 1: gestión de usuarios y autenticación.
// MARCADOR: reemplaza todo el contenido de este archivo con tu pantalla.
// Props que recibe toda pantalla: { params, irA, sesion, carrito }
import MarcadorPantalla from '../../components/MarcadorPantalla.jsx';
import Boton from '../../components/Boton.jsx';
import { USUARIOS } from '../../data/usuarios.js';

export default function LoginPage({ params, irA, sesion }) {
  // Si App.jsx mandó aquí al usuario porque la vista pedía sesión,
  // params.volverA y params.volverParams dicen a dónde regresar.
  function entrarComo(usuario) {
    sesion.iniciarSesion(usuario);
    const panel = usuario.rol === 'admin' || usuario.rol === 'organizador';
    irA(params.volverA ?? (panel ? 'admin-dashboard' : 'inicio'), params.volverParams);
  }

  const demos = ['usr-001', 'usr-002', 'usr-003'].map((id) => USUARIOS.find((u) => u.id === id));

  return (
    <MarcadorPantalla titulo="Iniciar sesión" responsable="Gabriel" modulo="Gestión de usuarios">
      <p>Accesos de prueba (inician sesión sin formulario):</p>
      <ul>
        {demos.map((usuario) => (
          <li key={usuario.id}>
            <Boton variante="texto" onClick={() => entrarComo(usuario)}>
              Entrar como {usuario.nombre} ({usuario.rol})
            </Boton>
          </li>
        ))}
      </ul>
      <Boton variante="texto" onClick={() => irA('registro')}>
        Crear cuenta
      </Boton>
      <Boton variante="texto" onClick={() => irA('recuperar')}>
        ¿Olvidaste tu contraseña?
      </Boton>
    </MarcadorPantalla>
  );
}
