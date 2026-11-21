// DUEÑO: Gabriel. Campo de contraseña con botón para mostrarla u ocultarla.
// Usa CampoTexto (compartido) y acepta las mismas props.
import { useState } from 'react';
import CampoTexto from '../../components/CampoTexto.jsx';
import './CampoContrasena.css';

export default function CampoContrasena({ id, ...resto }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="campo-contrasena">
      <CampoTexto id={id} type={visible ? 'text' : 'password'} {...resto} />
      <button
        type="button"
        className="campo-contrasena__alternar"
        aria-controls={id}
        aria-pressed={visible}
        onClick={() => setVisible((actual) => !actual)}
      >
        {visible ? 'Ocultar' : 'Mostrar'}
        <span className="sr-only"> contraseña</span>
      </button>
    </div>
  );
}
