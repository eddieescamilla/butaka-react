// COMPONENTE TEMPORAL. Ocupa el lugar de una pantalla que todavía no se ha
// construido. Cuando el dueño termina su pantalla, deja de usarlo.
// Cuando ya nadie lo use, se puede borrar (avisar antes).
// Props:
//   titulo:      nombre de la pantalla
//   responsable: 'Eddie' | 'Gabriel'
//   modulo:      módulo del MVP al que pertenece
//   children:    accesos de prueba para recorrer el flujo mientras tanto
import './MarcadorPantalla.css';

export default function MarcadorPantalla({ titulo, responsable, modulo, children }) {
  return (
    <section className="marcador contenedor">
      <p className="marcador__aviso">
        Pantalla en construcción · {modulo} · Responsable: <strong>{responsable}</strong>
      </p>
      <h1 className="pagina__titulo">{titulo}</h1>
      {children && <div className="marcador__accesos">{children}</div>}
    </section>
  );
}
