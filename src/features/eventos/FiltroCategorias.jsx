// DUEÑO: Eddie. Píldoras para filtrar el listado por categoría.
// Props:
//   valor:     id de la categoría activa ('' = todas)
//   onCambiar: función que recibe el id elegido
import { CATEGORIAS } from '../../data/categorias.js';
import './FiltroCategorias.css';

const OPCIONES = [{ id: '', nombre: 'Todos' }, ...CATEGORIAS];

export default function FiltroCategorias({ valor, onCambiar }) {
  return (
    <div className="filtro-categorias" role="group" aria-label="Filtrar por categoría">
      {OPCIONES.map((opcion) => (
        <button
          key={opcion.id || 'todos'}
          type="button"
          className={`filtro-categorias__opcion filtro-categorias__opcion--${opcion.id || 'todos'}`}
          aria-pressed={valor === opcion.id}
          onClick={() => onCambiar(opcion.id)}
        >
          {opcion.nombre}
        </button>
      ))}
    </div>
  );
}
