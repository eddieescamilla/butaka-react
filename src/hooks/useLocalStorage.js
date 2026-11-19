// ARCHIVO COMPARTIDO (congelado). Ver CONTRIBUIR.md antes de cambiarlo.
// Igual que useState, pero el valor se guarda en localStorage y se recupera
// al recargar la página.
//
// Uso: const [valor, setValor] = useLocalStorage('butaka:clave', valorInicial);
// Todas las claves empiezan con "butaka:" (ver el mapa en CONTRIBUIR.md).

import { useEffect, useState } from 'react';

function leer(clave, valorInicial) {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado === null ? valorInicial : JSON.parse(guardado);
  } catch {
    // Si el valor guardado está dañado, se usa el inicial
    return valorInicial;
  }
}

export function useLocalStorage(clave, valorInicial) {
  // Inicialización perezosa: localStorage se lee una sola vez
  const [valor, setValor] = useState(() => leer(clave, valorInicial));

  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      // Almacenamiento lleno o bloqueado: la app sigue funcionando sin guardar
    }
  }, [clave, valor]);

  return [valor, setValor];
}
