// DUEÑO: Eddie. Gráfico de barras estático hecho con CSS (sin librerías).
// Incluye una tabla oculta con los mismos datos para lectores de pantalla.
// Props:
//   titulo:  texto del <figcaption>
//   datos:   [{ etiqueta: 'Jun', valor: 15200 }]
//   formato: función para mostrar el valor (por ejemplo formatearPrecio)
import './GraficoBarras.css';

export default function GraficoBarras({ titulo, datos, formato = String }) {
  const maximo = Math.max(...datos.map((dato) => dato.valor), 1);

  return (
    <figure className="grafico-barras">
      <figcaption className="grafico-barras__titulo">{titulo}</figcaption>
      <div className="grafico-barras__area" aria-hidden="true">
        {datos.map((dato) => (
          <div key={dato.etiqueta} className="grafico-barras__columna">
            <span className="grafico-barras__valor">{formato(dato.valor)}</span>
            <span className="grafico-barras__barra" style={{ height: `${(dato.valor / maximo) * 100}%` }} />
            <span className="grafico-barras__etiqueta">{dato.etiqueta}</span>
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>{titulo}</caption>
        <tbody>
          {datos.map((dato) => (
            <tr key={dato.etiqueta}>
              <th scope="row">{dato.etiqueta}</th>
              <td>{formato(dato.valor)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
