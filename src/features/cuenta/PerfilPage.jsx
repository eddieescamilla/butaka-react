// DUEÑO: Gabriel. Módulo 1: gestión de usuarios. Perfil del usuario.
// Props: { irA, sesion }
import { useState } from 'react';
import Aviso from '../../components/Aviso.jsx';
import Boton from '../../components/Boton.jsx';
import CampoTexto from '../../components/CampoTexto.jsx';
import { ROLES } from '../../data/categorias.js';
import { simularPeticion } from '../../utils/simularPeticion.js';
import { validarPerfil } from './validaciones.js';
import './Cuenta.css';
import './PerfilPage.css';

export default function PerfilPage({ irA, sesion }) {
  const { usuario } = sesion;
  const [valores, setValores] = useState({ nombre: usuario.nombre, apellido: usuario.apellido });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState('');

  const huboCambios = valores.nombre !== usuario.nombre || valores.apellido !== usuario.apellido;

  function cambiar(evento) {
    const siguientes = { ...valores, [evento.target.name]: evento.target.value };
    setValores(siguientes);
    if (Object.keys(errores).length > 0) setErrores(validarPerfil(siguientes));
  }

  async function alGuardar(evento) {
    evento.preventDefault();
    if (guardando) return;
    const encontrados = validarPerfil(valores);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setGuardando(true);
    await simularPeticion(() => null, { retraso: 700 });
    sesion.actualizarUsuario({ nombre: valores.nombre.trim(), apellido: valores.apellido.trim() });
    setGuardando(false);
    setAviso('Cambios guardados');
  }

  function cerrarSesion() {
    sesion.cerrarSesion();
    irA('inicio');
  }

  return (
    <div className="contenedor perfil">
      <header className="perfil__encabezado">
        <span className="perfil__avatar" aria-hidden="true">
          {usuario.nombre.charAt(0)}
          {usuario.apellido.charAt(0)}
        </span>
        <div>
          <h1 className="pagina__titulo">Mi perfil</h1>
          <p className="pagina__subtitulo">
            {usuario.correo} · {ROLES[usuario.rol]}
          </p>
        </div>
      </header>

      <div className="perfil__columnas">
        <section className="perfil__tarjeta" aria-labelledby="perfil-datos">
          <h2 id="perfil-datos" className="perfil__subtitulo">
            Datos personales
          </h2>
          {aviso && <Aviso tipo="exito" mensaje={aviso} onCerrar={() => setAviso('')} />}
          <form className="formulario-cuenta" onSubmit={alGuardar} noValidate>
            <div className="formulario-cuenta__fila">
              <CampoTexto id="perfil-nombre" name="nombre" etiqueta="Nombre" autoComplete="given-name" required value={valores.nombre} onChange={cambiar} error={errores.nombre} />
              <CampoTexto id="perfil-apellido" name="apellido" etiqueta="Apellidos" autoComplete="family-name" required value={valores.apellido} onChange={cambiar} error={errores.apellido} />
            </div>
            <CampoTexto
              id="perfil-correo"
              etiqueta="Correo electrónico"
              value={usuario.correo}
              readOnly
              ayuda="El correo no se puede cambiar porque identifica tu cuenta."
            />
            <Boton type="submit" cargando={guardando} disabled={!huboCambios}>
              Guardar cambios
            </Boton>
          </form>
        </section>

        <section className="perfil__tarjeta" aria-labelledby="perfil-accesos">
          <h2 id="perfil-accesos" className="perfil__subtitulo">
            Accesos rápidos
          </h2>
          <Boton variante="secundario" bloque onClick={() => irA('mis-boletos')}>
            Ver mis boletos
          </Boton>
          {sesion.esAdmin && (
            <Boton variante="secundario" bloque onClick={() => irA('admin-dashboard')}>
              Ir al panel de administración
            </Boton>
          )}
          <Boton variante="texto" onClick={cerrarSesion}>
            Cerrar sesión
          </Boton>
        </section>
      </div>
    </div>
  );
}
