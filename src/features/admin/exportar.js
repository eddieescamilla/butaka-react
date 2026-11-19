// DUEÑO: Eddie. Descarga una tabla como archivo CSV (se abre en Excel).
// Todo ocurre en el navegador: no se envía nada a ningún servidor.
//   columnas: [{ titulo, valor(fila) }]

function celda(valor) {
  const texto = String(valor ?? '');
  return /[",\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

export function descargarCSV(nombreArchivo, columnas, filas) {
  const lineas = [
    columnas.map((columna) => celda(columna.titulo)).join(','),
    ...filas.map((fila) => columnas.map((columna) => celda(columna.valor(fila))).join(',')),
  ];
  // El BOM (﻿) hace que Excel muestre bien las tildes
  const archivo = new Blob([`﻿${lineas.join('\n')}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(archivo);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;
  enlace.click();
  URL.revokeObjectURL(url);
}
