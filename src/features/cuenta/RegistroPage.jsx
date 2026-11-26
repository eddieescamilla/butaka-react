// DUEÑO: Gabriel. Módulo 1: autenticación. Crear cuenta.
// Ruta: /registro
// Al registrarse, la sesión se inicia sola y se regresa a la compra si venía de ahí
// (location.state.desde, igual que en el login).
import { useRef, useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import Aviso from '../../components/Aviso.jsx';
import Boton from '../../components/Boton.jsx';
import CampoTexto from '../../components/CampoTexto.jsx';
import EnlaceVista from '../../components/EnlaceVista.jsx';
import TarjetaAuth from './TarjetaAuth.jsx';
import CampoContrasena from './CampoContrasena.jsx';
import { registrarCliente } from '../../api/usuarios.js';
import { validarRegistro } from './validaciones.js';
import { useSesion } from './useSesion.js';
import { rutaDeRegreso } from './LoginPage.jsx';
import './Cuenta.css';

const INICIALES = { nombre: '', apellido: '', correo: '', contrasena: '', confirmacion: '', terminos: false };

export default function RegistroPage() {
  const sesion = useSesion();
  const { state: estado } = useLocation();
  const [valores, setValores] = useState(INICIALES);
  const [errores, setErrores] = useState({});
  const [intentoEnviar, setIntentoEnviar] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);
  const formulario = useRef(null);

  if (sesion.haySesion) return <Navigate to={rutaDeRegreso(estado, sesion.usuario)} replace />;

  function cambiar(evento) {
    const { name, type, checked, value } = evento.target;
    const siguientes = { ...valores, [name]: type === 'checkbox' ? checked : value };
    setValores(siguientes);
    if (intentoEnviar) setErrores(validarRegistro(siguientes));
  }

  async function alEnviar(evento) {
    evento.preventDefault();
    if (enviando) return;
    setIntentoEnviar(true);
    const encontrados = validarRegistro(valores);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) {
      requestAnimationFrame(() => formulario.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }

    setEnviando(true);
    setErrorGeneral('');
    try {
      const usuario = await registrarCliente({
        nombre: valores.nombre.trim(),
        apellido: valores.apellido.trim(),
        correo: valores.correo.trim().toLowerCase(),
        contrasena: valores.contrasena,
      });
      sesion.iniciarSesion(usuario); // el siguiente render redirige con <Navigate>
    } catch (error) {
      // 409: el correo ya existe → se marca en el campo correspondiente
      if (error.estado === 409) setErrores((actuales) => ({ ...actuales, correo: `${error.message} Inicia sesión.` }));
      else setErrorGeneral(error.message);
      setEnviando(false);
    }
  }

  return (
    <TarjetaAuth
      titulo="Crea tu cuenta"
      subtitulo="Compra boletos y guárdalos en un solo lugar."
      pie={
        <p>
          ¿Ya tienes cuenta?{' '}
          <EnlaceVista a="/login" estado={{ desde: estado?.desde }}>
            Inicia sesión
          </EnlaceVista>
        </p>
      }
    >
      {errorGeneral && <Aviso tipo="error" mensaje={errorGeneral} duracion={0} onCerrar={() => setErrorGeneral('')} />}
      {intentoEnviar && Object.keys(errores).length > 0 && (
        <p className="sr-only" role="alert">
          Hay {Object.keys(errores).length} campos por corregir.
        </p>
      )}

      <form ref={formulario} className="formulario-cuenta" onSubmit={alEnviar} noValidate>
        <div className="formulario-cuenta__fila">
          <CampoTexto id="registro-nombre" name="nombre" etiqueta="Nombre" autoComplete="given-name" required value={valores.nombre} onChange={cambiar} error={errores.nombre} />
          <CampoTexto id="registro-apellido" name="apellido" etiqueta="Apellidos" autoComplete="family-name" required value={valores.apellido} onChange={cambiar} error={errores.apellido} />
        </div>
        <CampoTexto
          id="registro-correo"
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
          id="registro-contrasena"
          name="contrasena"
          etiqueta="Contraseña"
          autoComplete="new-password"
          required
          value={valores.contrasena}
          onChange={cambiar}
          error={errores.contrasena}
          ayuda="Al menos 8 caracteres, con letras y números."
        />
        <CampoContrasena
          id="registro-confirmacion"
          name="confirmacion"
          etiqueta="Repite la contraseña"
          autoComplete="new-password"
          required
          value={valores.confirmacion}
          onChange={cambiar}
          error={errores.confirmacion}
        />
        <div>
          <label className="formulario-cuenta__casilla" htmlFor="registro-terminos">
            <input
              id="registro-terminos"
              name="terminos"
              type="checkbox"
              checked={valores.terminos}
              onChange={cambiar}
              aria-invalid={errores.terminos ? true : undefined}
              aria-describedby={errores.terminos ? 'registro-terminos-error' : undefined}
            />
            Acepto los términos y condiciones y la política de privacidad de Butaka.
          </label>
          {errores.terminos && (
            <p id="registro-terminos-error" className="campo__error">
              {errores.terminos}
            </p>
          )}
        </div>
        <Boton type="submit" bloque cargando={enviando}>
          Crear cuenta
        </Boton>
      </form>
    </TarjetaAuth>
  );
}
