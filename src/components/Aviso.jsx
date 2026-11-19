// COMPONENTE COMPARTIDO (congelado). Mensaje de confirmación tipo "toast"
// (en el Figma: "✓ Evento eliminado", "✓ Usuario creado con éxito").
// Props:
//   tipo:      'exito' | 'error' | 'info'
//   mensaje:   texto del aviso (si está vacío, no se muestra nada)
//   onCerrar:  se llama al pulsar la ✕ o al terminar la duración
//   duracion:  milisegundos antes de cerrarse solo (por defecto 4000; 0 = no se cierra)
import { useEffect } from 'react';
import './Aviso.css';

const ICONOS = { exito: '✓', error: '!', info: 'i' };

export default function Aviso({ tipo = 'exito', mensaje, onCerrar, duracion = 4000 }) {
  useEffect(() => {
    if (!mensaje || !duracion) return;
    const temporizador = setTimeout(onCerrar, duracion);
    // Limpieza: si el aviso cambia o desaparece antes, se cancela el temporizador
    return () => clearTimeout(temporizador);
  }, [mensaje, duracion, onCerrar]);

  if (!mensaje) return null;

  return (
    <div className={`aviso aviso--${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      <span className="aviso__icono" aria-hidden="true">
        {ICONOS[tipo]}
      </span>
      <p className="aviso__mensaje">{mensaje}</p>
      <button type="button" className="aviso__cerrar" onClick={onCerrar} aria-label="Cerrar aviso">
        ✕
      </button>
    </div>
  );
}
