// DUEÑO: Gabriel. Módulo 1: autenticación. Inicio de sesión.
// Ruta: /login
// Si RutaProtegida mandó aquí al usuario, location.state.desde dice a qué
// ruta regresar después de iniciar sesión (por ejemplo /checkout/pago).
import { useRef, useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import Aviso from '../../components/Aviso.jsx';
import Boton from '../../components/Boton.jsx';
import CampoTexto from '../../components/CampoTexto.jsx';
import EnlaceVista from '../../components/EnlaceVista.jsx';
import { autenticar, CONTRASENA_DEMO } from '../../api/usuarios.js';
import TarjetaAuth from './TarjetaAuth.jsx';
import CampoContrasena from './CampoContrasena.jsx';
import { useSesion } from './useSesion.js';
import { validarLogin } from './validaciones.js';
import './Cuenta.css';

// Ruta a la que se vuelve después de iniciar sesión
export function rutaDeRegreso(estado, usuario) {
  const desde = estado?.desde;
  if (desde?.pathname) return `${desde.pathname}${desde.search ?? ''}`;
  return usuario?.rol === 'admin' || usuario?.rol === 'organizador' ? '/admin' : '/';
}

export default function LoginPage() {
  const sesion = useSesion();
  const { state: estado } = useLocation();
  const [valores, setValores] = useState({ correo: estado?.correo ?? '', contrasena: '' });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);
  const formulario = useRef(null);

  // Con sesión iniciada, se regresa a la ruta pedida (o al panel / inicio)
  if (sesion.haySesion) return <Navigate to={rutaDeRegreso(estado, sesion.usuario)} replace />;

  function cambiar(evento) {
    const siguientes = { ...valores, [evento.target.name]: evento.target.value };
    setValores(siguientes);
    if (Object.keys(errores).length > 0) setErrores(validarLogin(siguientes));
  }

  async function alEnviar(evento) {
    evento.preventDefault();
    if (enviando) return;
    const encontrados = validarLogin(valores);
    setErrores(encontrados);
    setErrorGeneral('');
    if (Object.keys(encontrados).length > 0) {
      requestAnimationFrame(() => formulario.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }

    setEnviando(true);
    try {
      const usuario = await autenticar(valores.correo, valores.contrasena);
      sesion.iniciarSesion(usuario); // el siguiente render redirige con <Navigate>
    } catch (error) {
      setErrorGeneral(error.message);
      setEnviando(false);
    }
  }

  return (
    <TarjetaAuth
      titulo="Inicia sesión"
      subtitulo={estado?.desde ? 'Inicia sesión para continuar donde te quedaste.' : 'Accede a tus boletos y compras.'}
      pie={
        <p>
          ¿No tienes cuenta?{' '}
          <EnlaceVista a="/registro" estado={{ desde: estado?.desde }}>
            Crea una cuenta
          </EnlaceVista>
        </p>
      }
    >
      {errorGeneral && <Aviso tipo="error" mensaje={errorGeneral} duracion={0} onCerrar={() => setErrorGeneral('')} />}

      <form ref={formulario} className="formulario-cuenta" onSubmit={alEnviar} noValidate>
        <CampoTexto
          id="login-correo"
          name="correo"
          etiqueta="Correo electrónico"
          type="email"
          autoComplete="email"
          required
          value={valores.correo}
          onChange={cambiar}
          error={errores.correo}
        />
        <CampoContrasena
          id="login-contrasena"
          name="contrasena"
          etiqueta="Contraseña"
          autoComplete="current-password"
          required
          value={valores.contrasena}
          onChange={cambiar}
          error={errores.contrasena}
        />
        <EnlaceVista a="/recuperar" className="formulario-cuenta__enlace">
          ¿Olvidaste tu contraseña?
        </EnlaceVista>
        <Boton type="submit" bloque cargando={enviando}>
          Iniciar sesión
        </Boton>
      </form>

      <div className="formulario-cuenta__demo">
        <p>
          Cuentas de prueba (contraseña <code>{CONTRASENA_DEMO}</code>):
        </p>
        <ul>
          <li>
            Cliente: <code>ana.lopez@correo.com</code>
          </li>
          <li>
            Administrador: <code>carlos.m@correo.com</code>
          </li>
          <li>
            Organizador: <code>sofia.h@correo.com</code>
          </li>
        </ul>
      </div>
    </TarjetaAuth>
  );
}
