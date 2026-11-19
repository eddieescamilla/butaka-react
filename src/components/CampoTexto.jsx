// COMPONENTE COMPARTIDO (congelado). Campo de formulario con etiqueta asociada,
// texto de ayuda y mensaje de error accesible.
// Props:
//   id:         obligatorio, une la <label> con el campo
//   etiqueta:   texto de la etiqueta visible
//   error:      mensaje de error (si existe, el campo se marca como inválido)
//   ayuda:      texto de ayuda debajo del campo
//   opciones:   [{ valor, texto }] → se dibuja un <select> en lugar de <input>
//   multilinea: boolean → se dibuja un <textarea>
//   ...resto:   value, onChange, type, name, placeholder, required,
//               autoComplete, min, max… pasan directo al campo
import './CampoTexto.css';

export default function CampoTexto({ id, etiqueta, error, ayuda, opciones, multilinea = false, className = '', ...resto }) {
  const idAyuda = ayuda ? `${id}-ayuda` : undefined;
  const idError = error ? `${id}-error` : undefined;
  const describidoPor = [idAyuda, idError].filter(Boolean).join(' ') || undefined;

  const propsCampo = {
    id,
    className: `campo__control${error ? ' campo__control--error' : ''}`,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describidoPor,
    ...resto,
  };

  let control;
  if (opciones) {
    control = (
      <select {...propsCampo}>
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.texto}
          </option>
        ))}
      </select>
    );
  } else if (multilinea) {
    control = <textarea rows={4} {...propsCampo} />;
  } else {
    control = <input type="text" {...propsCampo} />;
  }

  return (
    <div className={`campo ${className}`}>
      <label htmlFor={id} className="campo__etiqueta">
        {etiqueta}
        {resto.required && (
          <span className="campo__requerido" aria-hidden="true">
            {' '}*
          </span>
        )}
      </label>
      {control}
      {ayuda && (
        <p id={idAyuda} className="campo__ayuda">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idError} className="campo__error">
          {error}
        </p>
      )}
    </div>
  );
}
