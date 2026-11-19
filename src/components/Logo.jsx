// COMPONENTE COMPARTIDO (congelado). Logo de Butaka: ícono de boleto + nombre.
// Props:
//   tamano: 'normal' | 'grande'
import './Logo.css';

export default function Logo({ tamano = 'normal' }) {
  return (
    <span className={`logo logo--${tamano}`}>
      <svg
        className="logo__icono"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M13 5v2" />
        <path d="M13 17v2" />
        <path d="M13 11v2" />
      </svg>
      Butaka
    </span>
  );
}
