// DUEÑO: Gabriel. Botones − y + para elegir cuántos boletos.
// Props:
//   id:        id del campo numérico
//   etiqueta:  texto de la etiqueta (puede ir oculta con etiquetaOculta)
//   valor, minimo, maximo
//   onCambiar: función que recibe el nuevo número
import './SelectorCantidad.css';

export default function SelectorCantidad({ id, etiqueta, etiquetaOculta = false, valor, minimo = 1, maximo, onCambiar }) {
  function fijar(numero) {
    if (Number.isNaN(numero)) return;
    onCambiar(Math.min(Math.max(numero, minimo), maximo));
  }

  return (
    <div className="selector-cantidad">
      <label htmlFor={id} className={etiquetaOculta ? 'sr-only' : 'selector-cantidad__etiqueta'}>
        {etiqueta}
      </label>
      <div className="selector-cantidad__controles">
        <button
          type="button"
          className="selector-cantidad__boton"
          onClick={() => fijar(valor - 1)}
          disabled={valor <= minimo}
          aria-label={`Quitar un boleto (${etiqueta})`}
        >
          −
        </button>
        <input
          id={id}
          className="selector-cantidad__valor"
          type="number"
          inputMode="numeric"
          min={minimo}
          max={maximo}
          value={valor}
          onChange={(evento) => fijar(parseInt(evento.target.value, 10))}
        />
        <button
          type="button"
          className="selector-cantidad__boton"
          onClick={() => fijar(valor + 1)}
          disabled={valor >= maximo}
          aria-label={`Agregar un boleto (${etiqueta})`}
        >
          +
        </button>
      </div>
    </div>
  );
}
