// DUEÑO: Eddie. Formulario controlado para crear o editar un evento.
// Props:
//   inicial:    valores iniciales (al editar) o undefined (al crear)
//   esNuevo:    boolean. Al crear se piden también las zonas y precios
//   onGuardar:  función async que recibe los datos limpios
//   onCancelar: función
import { useRef, useState } from 'react';
import { CATEGORIAS } from '../../data/categorias.js';
import Boton from '../../components/Boton.jsx';
import CampoTexto from '../../components/CampoTexto.jsx';
import { validarEvento } from './validaciones.js';

const OPCIONES_CATEGORIA = [
  { valor: '', texto: 'Selecciona una categoría' },
  ...CATEGORIAS.map((categoria) => ({ valor: categoria.id, texto: categoria.nombre })),
];

let siguienteZona = 0;
function zonaVacia(nombre = '') {
  siguienteZona += 1;
  return { id: `nueva-${siguienteZona}`, nombre, precio: '', capacidad: '' };
}

// "2026-12-12T20:00:00-06:00" → "2026-12-12T20:00" (formato de <input type="datetime-local">)
function aEntrada(iso) {
  if (!iso) return '';
  const fecha = new Date(iso);
  const dos = (n) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}T${dos(fecha.getHours())}:${dos(fecha.getMinutes())}`;
}

// Convierte el nombre de la zona en un id ("Mesa frontal" → "mesa-frontal")
function aId(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function FormularioEvento({ inicial, esNuevo, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(() => ({
    titulo: inicial?.titulo ?? '',
    categoria: inicial?.categoria ?? '',
    fecha: aEntrada(inicial?.fecha),
    lugar: inicial?.lugar ?? '',
    descripcion: inicial?.descripcion ?? '',
    zonas: esNuevo ? [zonaVacia('VIP'), zonaVacia('Preferencial'), zonaVacia('General')] : [],
  }));
  const [errores, setErrores] = useState({});
  const [intentoEnviar, setIntentoEnviar] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const formulario = useRef(null);

  // Después del primer intento, los errores se actualizan mientras se escribe
  function actualizar(siguientes) {
    setValores(siguientes);
    if (intentoEnviar) setErrores(validarEvento(siguientes, { esNuevo }));
  }

  function cambiarCampo(evento) {
    actualizar({ ...valores, [evento.target.name]: evento.target.value });
  }

  function cambiarZona(id, campo, valor) {
    actualizar({ ...valores, zonas: valores.zonas.map((zona) => (zona.id === id ? { ...zona, [campo]: valor } : zona)) });
  }

  async function alEnviar(evento) {
    evento.preventDefault();
    if (guardando) return; // evita el doble envío
    setIntentoEnviar(true);
    const encontrados = validarEvento(valores, { esNuevo });
    setErrores(encontrados);

    if (Object.keys(encontrados).length > 0) {
      // Lleva el foco al primer campo con error
      requestAnimationFrame(() => formulario.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }

    setGuardando(true);
    setErrorGeneral('');
    try {
      await onGuardar({
        titulo: valores.titulo.trim(),
        categoria: valores.categoria,
        fecha: `${valores.fecha}:00-06:00`,
        lugar: valores.lugar.trim(),
        descripcion: valores.descripcion.trim(),
        ...(esNuevo && {
          zonas: valores.zonas.map((zona) => ({
            id: aId(zona.nombre) || zona.id,
            nombre: zona.nombre.trim(),
            precio: Number(zona.precio),
            capacidad: Number(zona.capacidad),
            vendidos: 0,
          })),
        }),
      });
    } catch (error) {
      setErrorGeneral(error.message || 'No pudimos guardar el evento. Inténtalo de nuevo.');
      setGuardando(false);
    }
  }

  const cantidadErrores = Object.keys(errores).length;

  return (
    <form ref={formulario} className="formulario-admin" onSubmit={alEnviar} noValidate>
      {intentoEnviar && cantidadErrores > 0 && (
        <p className="formulario-admin__resumen" role="alert">
          Revisa {cantidadErrores === 1 ? 'el campo marcado' : `los ${cantidadErrores} campos marcados`} antes de guardar.
        </p>
      )}
      {errorGeneral && (
        <p className="formulario-admin__resumen" role="alert">
          {errorGeneral}
        </p>
      )}

      <CampoTexto
        id="evento-titulo"
        name="titulo"
        etiqueta="Nombre del evento"
        placeholder="Ej. Noche indie en vivo"
        required
        value={valores.titulo}
        onChange={cambiarCampo}
        error={errores.titulo}
      />
      <div className="formulario-admin__fila">
        <CampoTexto
          id="evento-categoria"
          name="categoria"
          etiqueta="Categoría"
          required
          opciones={OPCIONES_CATEGORIA}
          value={valores.categoria}
          onChange={cambiarCampo}
          error={errores.categoria}
        />
        <CampoTexto
          id="evento-fecha"
          name="fecha"
          etiqueta="Fecha y hora"
          type="datetime-local"
          required
          value={valores.fecha}
          onChange={cambiarCampo}
          error={errores.fecha}
        />
      </div>
      <CampoTexto
        id="evento-lugar"
        name="lugar"
        etiqueta="Lugar"
        placeholder="Ej. Teatro Presidente"
        required
        value={valores.lugar}
        onChange={cambiarCampo}
        error={errores.lugar}
      />
      <CampoTexto
        id="evento-descripcion"
        name="descripcion"
        etiqueta="Descripción"
        placeholder="Cuéntale al público de qué trata el evento"
        multilinea
        required
        value={valores.descripcion}
        onChange={cambiarCampo}
        error={errores.descripcion}
        ayuda={`${valores.descripcion.trim().length} caracteres (mínimo 20)`}
      />

      {esNuevo && (
        <fieldset className="formulario-admin__grupo">
          <legend>Zonas y precios</legend>
          {valores.zonas.map((zona, indice) => (
            <div key={zona.id} className="formulario-admin__zona">
              <CampoTexto
                id={`zona-${indice}-nombre`}
                etiqueta={`Zona ${indice + 1}`}
                required
                value={zona.nombre}
                onChange={(e) => cambiarZona(zona.id, 'nombre', e.target.value)}
                error={errores[`zona-${indice}-nombre`]}
              />
              <CampoTexto
                id={`zona-${indice}-precio`}
                etiqueta="Precio ($)"
                type="number"
                min="1"
                step="0.01"
                inputMode="decimal"
                required
                value={zona.precio}
                onChange={(e) => cambiarZona(zona.id, 'precio', e.target.value)}
                error={errores[`zona-${indice}-precio`]}
              />
              <CampoTexto
                id={`zona-${indice}-capacidad`}
                etiqueta="Capacidad"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                required
                value={zona.capacidad}
                onChange={(e) => cambiarZona(zona.id, 'capacidad', e.target.value)}
                error={errores[`zona-${indice}-capacidad`]}
              />
              <Boton
                variante="texto"
                tamano="pequeno"
                className="admin-acciones__peligro"
                disabled={valores.zonas.length === 1}
                onClick={() => actualizar({ ...valores, zonas: valores.zonas.filter((item) => item.id !== zona.id) })}
                aria-label={`Quitar zona ${indice + 1}`}
              >
                Quitar
              </Boton>
            </div>
          ))}
          <Boton
            variante="secundario"
            tamano="pequeno"
            onClick={() => actualizar({ ...valores, zonas: [...valores.zonas, zonaVacia()] })}
          >
            + Agregar zona
          </Boton>
        </fieldset>
      )}

      <div className="formulario-admin__acciones">
        <Boton variante="secundario" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </Boton>
        <Boton type="submit" cargando={guardando}>
          Guardar evento
        </Boton>
      </div>
    </form>
  );
}
