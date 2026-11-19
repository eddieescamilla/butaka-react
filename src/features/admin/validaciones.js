// DUEÑO: Eddie. Reglas de validación de los formularios del panel.
// Cada función recibe los valores y devuelve un objeto { campo: 'mensaje' }.
// Si el objeto está vacío, el formulario es válido.

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validarEvento(valores, { esNuevo }) {
  const errores = {};
  const titulo = valores.titulo.trim();

  if (titulo.length < 3) errores.titulo = 'Escribe un nombre de al menos 3 caracteres.';
  if (!valores.categoria) errores.categoria = 'Elige una categoría.';
  if (!valores.fecha) {
    errores.fecha = 'Indica la fecha y la hora del evento.';
  } else if (esNuevo && new Date(valores.fecha) <= new Date()) {
    errores.fecha = 'La fecha debe ser posterior a hoy.';
  }
  if (valores.lugar.trim().length < 3) errores.lugar = 'Escribe el lugar donde se realizará el evento.';
  if (valores.descripcion.trim().length < 20) {
    errores.descripcion = 'Describe el evento con al menos 20 caracteres.';
  }

  if (esNuevo) {
    valores.zonas.forEach((zona, indice) => {
      Object.assign(errores, validarZona(zona, valores.zonas, `zona-${indice}-`));
    });
  }

  return errores;
}

// prefijo permite usar la misma regla en el formulario de evento (varias zonas)
export function validarZona(zona, todas = [], prefijo = '') {
  const errores = {};
  const nombre = zona.nombre.trim();
  const precio = Number(zona.precio);
  const capacidad = Number(zona.capacidad);
  const vendidos = zona.vendidos ?? 0;

  if (!nombre) {
    errores[`${prefijo}nombre`] = 'Escribe el nombre de la zona.';
  } else if (todas.some((otra) => otra !== zona && otra.id !== zona.id && otra.nombre.trim().toLowerCase() === nombre.toLowerCase())) {
    errores[`${prefijo}nombre`] = 'Ya existe una zona con ese nombre.';
  }
  if (zona.precio === '' || !(precio > 0)) errores[`${prefijo}precio`] = 'El precio debe ser mayor que $0.';
  if (zona.capacidad === '' || !Number.isInteger(capacidad) || capacidad < 1) {
    errores[`${prefijo}capacidad`] = 'La capacidad debe ser un número entero mayor que 0.';
  } else if (capacidad < vendidos) {
    errores[`${prefijo}capacidad`] = `La capacidad no puede ser menor que los ${vendidos} boletos ya vendidos.`;
  }

  return errores;
}

export function validarUsuario(valores, { esNuevo, otrosUsuarios }) {
  const errores = {};
  const correo = valores.correo.trim().toLowerCase();

  if (valores.nombre.trim().length < 2) errores.nombre = 'Escribe el nombre.';
  if (valores.apellido.trim().length < 2) errores.apellido = 'Escribe los apellidos.';
  if (!CORREO.test(correo)) {
    errores.correo = 'Escribe un correo válido, por ejemplo maria@correo.com.';
  } else if (otrosUsuarios.some((usuario) => usuario.correo.toLowerCase() === correo)) {
    errores.correo = 'Ya existe un usuario con ese correo.';
  }
  if (!valores.rol) errores.rol = 'Elige un rol.';

  // Al editar, la contraseña es opcional (vacía = no se cambia)
  if (esNuevo || valores.contrasena) {
    if (valores.contrasena.length < 8 || !/\d/.test(valores.contrasena) || !/[a-zA-Z]/.test(valores.contrasena)) {
      errores.contrasena = 'Usa al menos 8 caracteres, con letras y números.';
    }
  }

  return errores;
}
