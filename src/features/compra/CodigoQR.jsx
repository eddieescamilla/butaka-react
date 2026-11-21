// DUEÑO: Gabriel. Módulo 6: boletos electrónicos. Código QR SIMULADO.
// Dibuja un patrón con apariencia de QR que siempre es el mismo para el
// mismo código de boleto (se calcula a partir del texto). No es un QR
// escaneable real: para eso haría falta una librería, y esta entrega
// no usa backend ni validación real de boletos.
// Props:
//   codigo: texto del boleto (por ejemplo "BTK-1001-01")
//   tamano: ancho en píxeles (por defecto 180)
import { useMemo } from 'react';
import './CodigoQR.css';

const MODULOS = 25;

// Número pseudoaleatorio repetible a partir del texto (algoritmo mulberry32)
function generador(texto) {
  let semilla = 0;
  for (const caracter of texto) semilla = (Math.imul(semilla, 31) + caracter.charCodeAt(0)) | 0;
  return () => {
    semilla = (semilla + 0x6d2b79f5) | 0;
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Las tres esquinas con cuadros de posición, como en un QR real
function esZonaDePosicion(fila, columna) {
  const enEsquina = (f, c) => f >= 0 && f < 8 && c >= 0 && c < 8;
  return enEsquina(fila, columna) || enEsquina(fila, columna - (MODULOS - 8)) || enEsquina(fila - (MODULOS - 8), columna);
}

export default function CodigoQR({ codigo, tamano = 180 }) {
  const celdas = useMemo(() => {
    const aleatorio = generador(codigo);
    const lista = [];
    for (let fila = 0; fila < MODULOS; fila += 1) {
      for (let columna = 0; columna < MODULOS; columna += 1) {
        if (!esZonaDePosicion(fila, columna) && aleatorio() > 0.5) lista.push([fila, columna]);
      }
    }
    return lista;
  }, [codigo]);

  const posiciones = [
    [0, 0],
    [0, MODULOS - 7],
    [MODULOS - 7, 0],
  ];

  return (
    <svg
      className="codigo-qr"
      viewBox={`-2 -2 ${MODULOS + 4} ${MODULOS + 4}`}
      width={tamano}
      height={tamano}
      role="img"
      aria-label={`Código QR del boleto ${codigo}`}
      shapeRendering="crispEdges"
    >
      <rect x="-2" y="-2" width={MODULOS + 4} height={MODULOS + 4} fill="#FFFFFF" />
      {celdas.map(([fila, columna]) => (
        <rect key={`${fila}-${columna}`} x={columna} y={fila} width="1" height="1" fill="#1E1433" />
      ))}
      {posiciones.map(([fila, columna]) => (
        <g key={`${fila}-${columna}`}>
          <rect x={columna} y={fila} width="7" height="7" fill="#1E1433" />
          <rect x={columna + 1} y={fila + 1} width="5" height="5" fill="#FFFFFF" />
          <rect x={columna + 2} y={fila + 2} width="3" height="3" fill="#1E1433" />
        </g>
      ))}
    </svg>
  );
}
