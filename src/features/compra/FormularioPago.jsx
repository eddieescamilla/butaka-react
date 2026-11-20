// DUEÑO: Gabriel. Módulo 5: sistema de pagos. Formulario de tarjeta.
// Props:
//   total:      monto a pagar (texto del botón)
//   procesando: boolean (el botón muestra "Procesando…" y no se puede pulsar dos veces)
//   onPagar:    función que recibe { titular, numero, vencimiento, cvv } ya validados
import { useRef, useState } from 'react';
import Boton from '../../components/Boton.jsx';
import CampoTexto from '../../components/CampoTexto.jsx';
import { formatearPrecio } from '../../utils/formato.js';
import { formatearNumeroTarjeta, formatearVencimiento, soloDigitos, TARJETAS_PRUEBA, validarPago } from './pagos.js';
import './FormularioPago.css';

export default function FormularioPago({ total, procesando, onPagar }) {
  const [valores, setValores] = useState({ titular: '', numero: '', vencimiento: '', cvv: '' });
  const [errores, setErrores] = useState({});
  const [intentoEnviar, setIntentoEnviar] = useState(false);
  const formulario = useRef(null);

  // Cada campo se limpia y se formatea mientras se escribe
  const FORMATOS = {
    titular: (v) => v.toUpperCase(),
    numero: formatearNumeroTarjeta,
    vencimiento: formatearVencimiento,
    cvv: (v) => soloDigitos(v).slice(0, 4),
  };

  function cambiar(evento) {
    const { name, value } = evento.target;
    const siguientes = { ...valores, [name]: FORMATOS[name](value) };
    setValores(siguientes);
    if (intentoEnviar) setErrores(validarPago(siguientes));
  }

  function alEnviar(evento) {
    evento.preventDefault();
    if (procesando) return;
    setIntentoEnviar(true);
    const encontrados = validarPago(valores);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) {
      requestAnimationFrame(() => formulario.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    onPagar(valores);
  }

  return (
    <form ref={formulario} className="formulario-pago" onSubmit={alEnviar} noValidate>
      {intentoEnviar && Object.keys(errores).length > 0 && (
        <p className="formulario-pago__resumen" role="alert">
          Revisa los datos de la tarjeta marcados en rojo.
        </p>
      )}
      <CampoTexto
        id="pago-titular"
        name="titular"
        etiqueta="Nombre en la tarjeta"
        autoComplete="cc-name"
        required
        value={valores.titular}
        onChange={cambiar}
        error={errores.titular}
      />
      <CampoTexto
        id="pago-numero"
        name="numero"
        etiqueta="Número de tarjeta"
        inputMode="numeric"
        autoComplete="cc-number"
        placeholder="0000 0000 0000 0000"
        required
        value={valores.numero}
        onChange={cambiar}
        error={errores.numero}
      />
      <div className="formulario-pago__fila">
        <CampoTexto
          id="pago-vencimiento"
          name="vencimiento"
          etiqueta="Vencimiento"
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="MM/AA"
          required
          value={valores.vencimiento}
          onChange={cambiar}
          error={errores.vencimiento}
        />
        <CampoTexto
          id="pago-cvv"
          name="cvv"
          etiqueta="CVV"
          type="password"
          inputMode="numeric"
          autoComplete="cc-csc"
          required
          value={valores.cvv}
          onChange={cambiar}
          error={errores.cvv}
        />
      </div>

      <div className="formulario-pago__prueba">
        <p>Pago simulado. Tarjetas de prueba (cualquier fecha futura y CVV):</p>
        <ul>
          <li>
            Aprobada: <code>{TARJETAS_PRUEBA.aprobada}</code>
          </li>
          <li>
            Rechazada: <code>{TARJETAS_PRUEBA.rechazada}</code>
          </li>
        </ul>
      </div>

      <Boton type="submit" bloque cargando={procesando}>
        Pagar {formatearPrecio(total)}
      </Boton>
      <p className="formulario-pago__seguridad">🔒 No guardamos el número de tu tarjeta.</p>
    </form>
  );
}
