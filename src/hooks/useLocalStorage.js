// ARCHIVO COMPARTIDO (congelado). Ver CONTRIBUIR.md antes de cambiarlo.
// Igual que useState, pero el valor se guarda en localStorage y se recupera
// al recargar la página.
//
// Uso: const [valor, setValor] = useLocalStorage('butaka:clave', valorInicial);
// setValor acepta un valor o una función (anterior) => nuevo, igual que useState.
// Todas las claves empiezan con "butaka:" (ver el mapa en CONTRIBUIR.md).
//
// El valor se escribe en localStorage en el mismo momento en que se cambia
// (no en un efecto), para que no se pierda si la pantalla navega a otra
// vista justo después de guardar.

import { useCallback, useRef, useState } from 'react';

function leer(clave, valorInicial) {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado === null ? valorInicial : JSON.parse(guardado);
  } catch {
    // Si el valor guardado está dañado, se usa el inicial
    return valorInicial;
  }
}

function escribir(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // Almacenamiento lleno o bloqueado: la app sigue funcionando sin guardar
  }
}

export function useLocalStorage(clave, valorInicial) {
  // Inicialización perezosa: localStorage se lee una sola vez
  const [valor, setValorEstado] = useState(() => leer(clave, valorInicial));
  // Copia del valor más reciente, para calcular el siguiente sin esperar un render
  const actual = useRef(valor);

  const setValor = useCallback(
    (nuevo) => {
      const siguiente = typeof nuevo === 'function' ? nuevo(actual.current) : nuevo;
      actual.current = siguiente;
      escribir(clave, siguiente);
      setValorEstado(siguiente);
    },
    [clave],
  );

  return [valor, setValor];
}
