// DUEÑO: Gabriel. Reglas de validación de los formularios de cuenta.
// Cada función devuelve un objeto { campo: 'mensaje' }; vacío = válido.

export const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validarLogin({ correo, contrasena }) {
  const errores = {};
  if (!correo.trim()) errores.correo = 'Escribe tu correo electrónico.';
  else if (!PATRON_CORREO.test(correo.trim())) errores.correo = 'Escribe un correo válido, por ejemplo ana@correo.com.';
  if (!contrasena) errores.contrasena = 'Escribe tu contraseña.';
  return errores;
}

export function validarContrasenaNueva(contrasena) {
  if (contrasena.length < 8 || !/\d/.test(contrasena) || !/[a-zA-Z]/.test(contrasena)) {
    return 'Usa al menos 8 caracteres, con letras y números.';
  }
  return '';
}

export function validarRegistro(valores, correoExiste) {
  const errores = {};
  if (valores.nombre.trim().length < 2) errores.nombre = 'Escribe tu nombre.';
  if (valores.apellido.trim().length < 2) errores.apellido = 'Escribe tus apellidos.';
  if (!PATRON_CORREO.test(valores.correo.trim())) errores.correo = 'Escribe un correo válido, por ejemplo ana@correo.com.';
  else if (correoExiste(valores.correo)) errores.correo = 'Ya existe una cuenta con este correo. Inicia sesión.';
  const errorContrasena = validarContrasenaNueva(valores.contrasena);
  if (errorContrasena) errores.contrasena = errorContrasena;
  if (!valores.confirmacion) errores.confirmacion = 'Repite tu contraseña.';
  else if (valores.confirmacion !== valores.contrasena) errores.confirmacion = 'Las contraseñas no coinciden.';
  if (!valores.terminos) errores.terminos = 'Debes aceptar los términos y condiciones.';
  return errores;
}

export function validarPerfil(valores) {
  const errores = {};
  if (valores.nombre.trim().length < 2) errores.nombre = 'Escribe tu nombre.';
  if (valores.apellido.trim().length < 2) errores.apellido = 'Escribe tus apellidos.';
  return errores;
}
