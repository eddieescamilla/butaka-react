// DUEÑO: Gabriel. Módulo 6: boletos electrónicos. Mis boletos.
// Props: { irA, sesion }
import { useMemo, useState } from 'react';
import { usePeticion } from '../../hooks/usePeticion.js';
import { simularPeticion } from '../../utils/simularPeticion.js';
import { formatearFechaCorta, formatearPrecio } from '../../utils/formato.js';
import Boton from '../../components/Boton.jsx';
import EstadoCarga from '../../components/EstadoCarga.jsx';
import EstadoVacio from '../../components/EstadoVacio.jsx';
import TarjetaBoleto from './TarjetaBoleto.jsx';
import { useOrdenes } from './useOrdenes.js';
import './Compra.css';
import './MisBoletosPage.css';

export default function MisBoletosPage({ irA, sesion }) {
  const { ordenes } = useOrdenes(sesion.usuario.id);
  const [filtro, setFiltro] = useState('vigentes');
  // Carga simulada, para mostrar el estado de carga
  const { estado } = usePeticion((signal) => simularPeticion(() => true, { signal, retraso: 500 }), []);

  // Valor derivado: órdenes con al menos un boleto que cumple el filtro
  const visibles = useMemo(() => {
    const ahora = new Date();
    return ordenes
      .map((orden) => ({
        ...orden,
        boletos: orden.boletos.filter((boleto) => {
          const pasado = boleto.fecha && new Date(boleto.fecha) < ahora;
          return filtro === 'vigentes' ? !pasado : pasado;
        }),
      }))
      .filter((orden) => orden.boletos.length > 0);
  }, [ordenes, filtro]);

  return (
    <div className="contenedor compra">
      <h1 className="pagina__titulo">Mis boletos</h1>

      <div className="mis-boletos__filtro" role="group" aria-label="Mostrar boletos">
        <button type="button" aria-pressed={filtro === 'vigentes'} onClick={() => setFiltro('vigentes')}>
          Vigentes
        </button>
        <button type="button" aria-pressed={filtro === 'pasados'} onClick={() => setFiltro('pasados')}>
          Eventos realizados
        </button>
      </div>

      {estado === 'cargando' && <EstadoCarga mensaje="Cargando tus boletos…" />}

      {estado !== 'cargando' && visibles.length === 0 && (
        <EstadoVacio
          titulo={filtro === 'vigentes' ? 'No tienes boletos vigentes' : 'No tienes boletos de eventos pasados'}
          mensaje={filtro === 'vigentes' ? 'Cuando compres boletos, aparecerán aquí con su código QR.' : undefined}
        >
          {filtro === 'vigentes' && <Boton onClick={() => irA('inicio')}>Explorar eventos</Boton>}
        </EstadoVacio>
      )}

      {estado !== 'cargando' &&
        visibles.map((orden) => (
          <section key={orden.id} className="mis-boletos__orden" aria-labelledby={`orden-${orden.id}`}>
            <h2 id={`orden-${orden.id}`} className="mis-boletos__orden-titulo">
              Orden {orden.id}
              <span>
                {formatearFechaCorta(orden.fechaCompra)} · {formatearPrecio(orden.total)}
              </span>
            </h2>
            <ul className="mis-boletos__lista">
              {orden.boletos.map((boleto) => (
                <li key={boleto.codigo}>
                  <TarjetaBoleto boleto={boleto} irA={irA} />
                </li>
              ))}
            </ul>
          </section>
        ))}
    </div>
  );
}
