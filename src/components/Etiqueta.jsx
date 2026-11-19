// COMPONENTE COMPARTIDO (congelado). Píldora de color para categorías y estados.
// Props:
//   variante: id de categoría ('conciertos', 'teatro', 'deportes', 'otros')
//             o de estado ('en-venta', 'pocos-boletos', 'agotado', 'cancelado',
//             'finalizado', 'activo', 'inactivo')
//   children: texto visible
import './Etiqueta.css';

export default function Etiqueta({ variante = 'otros', children }) {
  return <span className={`etiqueta etiqueta--${variante}`}>{children}</span>;
}
