// DUEÑO: Eddie. Módulo 3: inventario y precios. Formulario para agregar o
// editar una zona dentro de un modal.
// Props:
//   zona:       zona a editar, o null para agregar una nueva
//   todas:      todas las zonas del evento (para no repetir nombres)
//   onGuardar:  función async que recibe la zona lista
//   onCancelar: función
import { useState } from 'react';
import Boton from '../../components/Boton.jsx';
import CampoTexto from '../../components/CampoTexto.jsx';
import { validarZona } from './validaciones.js';

export default function FormularioZona({ zona, todas, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(() => ({
    id: zona?.id ?? `zona-${Date.now()}`,
    nombre: zona?.nombre ?? '',
    precio: zona ? String(zona.precio) : '',
    capacidad: zona ? String(zona.capacidad) : '',
    vendidos: zona?.vendidos ?? 0,
  }));
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  function cambiar(evento) {
    const siguientes = { ...valores, [evento.target.name]: evento.target.value };
    setValores(siguientes);
    if (Object.keys(errores).length > 0) setErrores(validarZona(siguientes, todas));
  }

  async function alEnviar(evento) {
    evento.preventDefault();
    if (guardando) return;
    const encontrados = validarZona(valores, todas);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setGuardando(true);
    try {
      await onGuardar({
        id: valores.id,
        nombre: valores.nombre.trim(),
        precio: Number(valores.precio),
        capacidad: Number(valores.capacidad),
        vendidos: valores.vendidos,
      });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form className="formulario-admin" onSubmit={alEnviar} noValidate>
      <CampoTexto id="zona-nombre" name="nombre" etiqueta="Nombre de la zona" required value={valores.nombre} onChange={cambiar} error={errores.nombre} />
      <div className="formulario-admin__fila">
        <CampoTexto
          id="zona-precio"
          name="precio"
          etiqueta="Precio ($)"
          type="number"
          min="1"
          step="0.01"
          inputMode="decimal"
          required
          value={valores.precio}
          onChange={cambiar}
          error={errores.precio}
        />
        <CampoTexto
          id="zona-capacidad"
          name="capacidad"
          etiqueta="Capacidad"
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          required
          value={valores.capacidad}
          onChange={cambiar}
          error={errores.capacidad}
          ayuda={valores.vendidos > 0 ? `Ya se vendieron ${valores.vendidos} boletos.` : undefined}
        />
      </div>
      <div className="modal__acciones">
        <Boton variante="secundario" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </Boton>
        <Boton type="submit" cargando={guardando}>
          Guardar zona
        </Boton>
      </div>
    </form>
  );
}
