// DUEÑO: Gabriel. Módulo 6: boletos electrónicos. Código QR real, generado
// en el cliente con la librería qrcode (sin servidor) y dibujado como SVG.
// Se puede escanear con la cámara de cualquier teléfono.
// Props:
//   valor:    texto que codifica el QR (el enlace de verificación del boleto)
//   etiqueta: texto alternativo para lectores de pantalla
//   tamano:   ancho en píxeles (por defecto 180)
import { useMemo } from 'react';
import QRCode from 'qrcode';
import './CodigoQR.css';

const MARGEN = 2; // zona blanca alrededor, en módulos

export default function CodigoQR({ valor, etiqueta, tamano = 180 }) {
  // Matriz de módulos del QR (nivel de corrección M: tolera ~15 % de daño)
  const { ancho, trazo } = useMemo(() => {
    const { modules } = QRCode.create(valor, { errorCorrectionLevel: 'M' });
    let camino = '';
    for (let fila = 0; fila < modules.size; fila += 1) {
      for (let columna = 0; columna < modules.size; columna += 1) {
        if (modules.get(fila, columna)) camino += `M${columna} ${fila}h1v1h-1z`;
      }
    }
    return { ancho: modules.size, trazo: camino };
  }, [valor]);

  return (
    <svg
      className="codigo-qr"
      viewBox={`${-MARGEN} ${-MARGEN} ${ancho + MARGEN * 2} ${ancho + MARGEN * 2}`}
      width={tamano}
      height={tamano}
      role="img"
      aria-label={etiqueta}
      shapeRendering="crispEdges"
    >
      <rect x={-MARGEN} y={-MARGEN} width={ancho + MARGEN * 2} height={ancho + MARGEN * 2} fill="#FFFFFF" />
      <path d={trazo} fill="#1E1433" />
    </svg>
  );
}

// Enlace que codifica el QR: abre la pantalla de verificación de Butaka
// con el código y su firma. Ejemplo:
//   https://eddieescamilla.github.io/butaka-react/verificar/BTK-1001-01?f=0K3J9QX
export function enlaceVerificacion(boleto) {
  return `${window.location.origin}${import.meta.env.BASE_URL}verificar/${boleto.codigo}?f=${boleto.firma}`;
}
