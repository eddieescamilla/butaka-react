// DUEÑO: Gabriel. Módulo 1: autenticación. Inicio de sesión.
// Props: { params, irA, sesion }
// Si App.jsx mandó aquí al usuario porque la vista pedía sesión,
// params.volverA y params.volverParams dicen a dónde regresar.
import { useRef, useState } from 'react';
import Aviso from '../../components/Aviso.jsx';
import Boton from '../../components/Boton.jsx';
import CampoTexto from '../../components/CampoTexto.jsx';
import EnlaceVista from '../../components/EnlaceVista.jsx';
import { CONTRASENA_DEMO } from '../../data/usuarios.js';
import TarjetaAuth from './TarjetaAuth.jsx';
import CampoContrasena from './CampoContrasena.jsx';
import { autenticar } from './autenticacion.js';
import { validarLogin } from './validaciones.js';
import './Cuenta.css';

export default function LoginPage({ params, irA, sesion }) {
  const [valores, setValores] = useState({ correo: params.correo ?? '', contrasena: '' });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);
  const formulario = useRef(null);

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
      sesion.iniciarSesion(usuario);
      const vaAlPanel = usuario.rol === 'admin' || usuario.rol === 'organizador';
      irA(params.volverA ?? (vaAlPanel ? 'admin-dashboard' : 'inicio'), params.volverParams);
    } catch (error) {
      setErrorGeneral(error.message);
      setEnviando(false);
    }
  }

  return (
    <TarjetaAuth
      titulo="Inicia sesión"
      subtitulo={params.volverA ? 'Inicia sesión para continuar con tu compra.' : 'Accede a tus boletos y compras.'}
      pie={
        <p>
          ¿No tienes cuenta?{' '}
          <EnlaceVista vista="registro" irA={irA} params={{ volverA: params.volverA, volverParams: params.volverParams }}>
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
        <EnlaceVista vista="recuperar" irA={irA} className="formulario-cuenta__enlace">
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
