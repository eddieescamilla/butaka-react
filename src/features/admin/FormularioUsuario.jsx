// DUEÑO: Eddie. Formulario controlado para crear o editar un usuario.
// Props:
//   inicial:       usuario a editar, o undefined al crear
//   otrosUsuarios: los demás usuarios (para no repetir correos)
//   onGuardar:     función async que recibe los datos limpios
//   onCancelar:    función
import { useRef, useState } from 'react';
import { ROLES } from '../../data/categorias.js';
import Boton from '../../components/Boton.jsx';
import CampoTexto from '../../components/CampoTexto.jsx';
import { validarUsuario } from './validaciones.js';

const OPCIONES_ROL = [{ valor: '', texto: 'Selecciona un rol' }, ...Object.entries(ROLES).map(([valor, texto]) => ({ valor, texto }))];

export default function FormularioUsuario({ inicial, otrosUsuarios, onGuardar, onCancelar }) {
  const esNuevo = !inicial;
  const [valores, setValores] = useState({
    nombre: inicial?.nombre ?? '',
    apellido: inicial?.apellido ?? '',
    correo: inicial?.correo ?? '',
    rol: inicial?.rol ?? 'cliente',
    contrasena: '',
  });
  const [errores, setErrores] = useState({});
  const [intentoEnviar, setIntentoEnviar] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const formulario = useRef(null);

  function cambiar(evento) {
    const siguientes = { ...valores, [evento.target.name]: evento.target.value };
    setValores(siguientes);
    if (intentoEnviar) setErrores(validarUsuario(siguientes, { esNuevo, otrosUsuarios }));
  }

  async function alEnviar(evento) {
    evento.preventDefault();
    if (guardando) return;
    setIntentoEnviar(true);
    const encontrados = validarUsuario(valores, { esNuevo, otrosUsuarios });
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) {
      requestAnimationFrame(() => formulario.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }

    setGuardando(true);
    try {
      await onGuardar({
        nombre: valores.nombre.trim(),
        apellido: valores.apellido.trim(),
        correo: valores.correo.trim().toLowerCase(),
        rol: valores.rol,
        ...(valores.contrasena && { contrasena: valores.contrasena }),
      });
    } catch {
      setGuardando(false);
    }
  }

  return (
    <form ref={formulario} className="formulario-admin" onSubmit={alEnviar} noValidate>
      {intentoEnviar && Object.keys(errores).length > 0 && (
        <p className="formulario-admin__resumen" role="alert">
          Revisa los campos marcados antes de guardar.
        </p>
      )}
      <div className="formulario-admin__fila">
        <CampoTexto id="usuario-nombre" name="nombre" etiqueta="Nombre" placeholder="Ej. María" autoComplete="off" required value={valores.nombre} onChange={cambiar} error={errores.nombre} />
        <CampoTexto id="usuario-apellido" name="apellido" etiqueta="Apellidos" placeholder="Ej. López" autoComplete="off" required value={valores.apellido} onChange={cambiar} error={errores.apellido} />
      </div>
      <CampoTexto
        id="usuario-correo"
        name="correo"
        etiqueta="Correo electrónico"
        type="email"
        placeholder="maria@correo.com"
        autoComplete="off"
        required
        value={valores.correo}
        onChange={cambiar}
        error={errores.correo}
      />
      <CampoTexto id="usuario-rol" name="rol" etiqueta="Rol" opciones={OPCIONES_ROL} required value={valores.rol} onChange={cambiar} error={errores.rol} />
      <CampoTexto
        id="usuario-contrasena"
        name="contrasena"
        etiqueta={esNuevo ? 'Contraseña temporal' : 'Nueva contraseña temporal'}
        type="password"
        autoComplete="new-password"
        required={esNuevo}
        value={valores.contrasena}
        onChange={cambiar}
        error={errores.contrasena}
        ayuda={esNuevo ? 'Al menos 8 caracteres, con letras y números.' : 'Déjala vacía para no cambiarla.'}
      />
      <div className="formulario-admin__acciones">
        <Boton variante="secundario" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </Boton>
        <Boton type="submit" cargando={guardando}>
          {esNuevo ? 'Crear usuario' : 'Guardar cambios'}
        </Boton>
      </div>
    </form>
  );
}
