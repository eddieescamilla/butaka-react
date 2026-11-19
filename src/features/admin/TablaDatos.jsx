// DUEÑO: Eddie. Tabla del panel de administración. En móvil, cada fila se
// muestra como una tarjeta (sin scroll horizontal).
// Props:
//   titulo:   descripción de la tabla para lectores de pantalla (<caption>)
//   columnas: [{ clave, titulo, render?(fila), alinear?: 'derecha' }]
//   filas:    arreglo de objetos
//   claveFila: nombre de la propiedad única de cada fila (por defecto 'id')
import './TablaDatos.css';

export default function TablaDatos({ titulo, columnas, filas, claveFila = 'id' }) {
  return (
    <div className="tabla-datos">
      <table className="tabla-datos__tabla">
        <caption className="sr-only">{titulo}</caption>
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th
                key={columna.clave}
                scope="col"
                className={columna.alinear === 'derecha' ? 'tabla-datos__celda--derecha' : undefined}
              >
                {columna.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila[claveFila]}>
              {columnas.map((columna) => (
                <td
                  key={columna.clave}
                  data-etiqueta={columna.titulo}
                  className={columna.alinear === 'derecha' ? 'tabla-datos__celda--derecha' : undefined}
                >
                  {columna.render ? columna.render(fila) : fila[columna.clave]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
