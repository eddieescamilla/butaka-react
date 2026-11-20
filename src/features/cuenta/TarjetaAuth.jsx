// DUEÑO: Gabriel. Contenedor centrado de las pantallas de cuenta
// (login, registro, recuperar contraseña).
// Props: titulo, subtitulo, children, pie (enlaces debajo de la tarjeta)
import Logo from '../../components/Logo.jsx';
import './TarjetaAuth.css';

export default function TarjetaAuth({ titulo, subtitulo, children, pie }) {
  return (
    <div className="contenedor tarjeta-auth">
      <section className="tarjeta-auth__caja" aria-labelledby="auth-titulo">
        <Logo />
        <h1 id="auth-titulo" className="tarjeta-auth__titulo">
          {titulo}
        </h1>
        {subtitulo && <p className="tarjeta-auth__subtitulo">{subtitulo}</p>}
        {children}
      </section>
      {pie && <div className="tarjeta-auth__pie">{pie}</div>}
    </div>
  );
}
