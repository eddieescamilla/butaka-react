// DUEÑO: Gabriel. Módulo 1: autenticación. Recuperar contraseña (simulado).
// Props: { irA }
import { useState } from 'react';
import Boton from '../../components/Boton.jsx';
import CampoTexto from '../../components/CampoTexto.jsx';
import EnlaceVista from '../../components/EnlaceVista.jsx';
import EstadoVacio from '../../components/EstadoVacio.jsx';
import TarjetaAuth from './TarjetaAuth.jsx';
import { solicitarRecuperacion } from './autenticacion.js';
import { PATRON_CORREO } from './validaciones.js';
import './Cuenta.css';

export default function RecuperarPage({ irA }) {
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function alEnviar(evento) {
    evento.preventDefault();
    if (enviando) return;
    if (!PATRON_CORREO.test(correo.trim())) {
      setError('Escribe un correo válido, por ejemplo ana@correo.com.');
      document.getElementById('recuperar-correo')?.focus();
      return;
    }
    setError('');
    setEnviando(true);
    await solicitarRecuperacion(correo);
    setEnviando(false);
    setEnviado(true);
  }

  const pie = (
    <EnlaceVista vista="login" irA={irA}>
      ← Volver a iniciar sesión
    </EnlaceVista>
  );

  if (enviado) {
    return (
      <TarjetaAuth titulo="Revisa tu correo" pie={pie}>
        <div role="status">
          <EstadoVacio
            titulo="Te enviamos las instrucciones"
            mensaje={`Si ${correo.trim()} está registrado, recibirás un enlace para crear una nueva contraseña. Revisa también la carpeta de spam.`}
          >
            <Boton onClick={() => irA('login', { correo: correo.trim() })}>Volver a iniciar sesión</Boton>
          </EstadoVacio>
        </div>
      </TarjetaAuth>
    );
  }

  return (
    <TarjetaAuth
      titulo="Recupera tu contraseña"
      subtitulo="Escribe el correo de tu cuenta y te enviaremos un enlace para crear una nueva."
      pie={pie}
    >
      <form className="formulario-cuenta" onSubmit={alEnviar} noValidate>
        <CampoTexto
          id="recuperar-correo"
          etiqueta="Correo electrónico"
          type="email"
          autoComplete="email"
          required
          value={correo}
          onChange={(evento) => setCorreo(evento.target.value)}
          error={error}
        />
        <Boton type="submit" bloque cargando={enviando}>
          Enviar enlace
        </Boton>
      </form>
    </TarjetaAuth>
  );
}
