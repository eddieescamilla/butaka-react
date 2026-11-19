// COMPONENTE COMPARTIDO (congelado).
// Props:
//   variante: 'primario' | 'secundario' | 'peligro' | 'texto'
//   tamano:   'normal' | 'pequeno'
//   cargando: boolean. Deshabilita el botón y muestra "Procesando…"
//             (así se evita el doble envío o la doble compra)
//   bloque:   boolean. Ocupa todo el ancho disponible
//   type:     'button' (por defecto) | 'submit'
//   ...resto: onClick, disabled, aria-*, etc. pasan directo al <button>
import './Boton.css';

export default function Boton({
  variante = 'primario',
  tamano = 'normal',
  cargando = false,
  bloque = false,
  type = 'button',
  disabled,
  className = '',
  children,
  ...resto
}) {
  const clases = [
    'boton',
    `boton--${variante}`,
    tamano === 'pequeno' && 'boton--pequeno',
    bloque && 'boton--bloque',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={clases}
      disabled={disabled || cargando}
      aria-busy={cargando || undefined}
      {...resto}
    >
      {cargando && <span className="boton__indicador" aria-hidden="true" />}
      {cargando ? 'Procesando…' : children}
    </button>
  );
}
