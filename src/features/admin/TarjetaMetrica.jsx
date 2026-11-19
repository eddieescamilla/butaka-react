// DUEÑO: Eddie. Tarjeta con un indicador del dashboard o de los reportes.
// Props:
//   etiqueta:  nombre del indicador ("Boletos vendidos")
//   valor:     texto ya formateado ("1,284")
//   detalle:   texto pequeño debajo ("+12 % vs. octubre")
//   tendencia: 'positiva' | 'neutra' (color del detalle)
import './TarjetaMetrica.css';

export default function TarjetaMetrica({ etiqueta, valor, detalle, tendencia = 'positiva' }) {
  return (
    <article className="tarjeta-metrica">
      <h3 className="tarjeta-metrica__etiqueta">{etiqueta}</h3>
      <p className="tarjeta-metrica__valor">{valor}</p>
      {detalle && <p className={`tarjeta-metrica__detalle tarjeta-metrica__detalle--${tendencia}`}>{detalle}</p>}
    </article>
  );
}
