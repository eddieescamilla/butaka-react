// DUEÑO: Eddie. Preferencias del usuario que se recuerdan entre visitas
// (la entrega pide persistir carrito, sesión y preferencias).
//
// Uso: const { preferencias, cambiarPreferencia } = usePreferencias();
//      cambiarPreferencia('categoria', 'teatro');

import { useCallback } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';

const PREFERENCIAS_INICIALES = {
  categoria: '', // último filtro de categoría usado en el listado
  orden: 'fecha', // 'fecha' | 'precio'
};

export function usePreferencias() {
  const [preferencias, setPreferencias] = useLocalStorage('butaka:preferencias', PREFERENCIAS_INICIALES);

  const cambiarPreferencia = useCallback(
    (nombre, valor) => setPreferencias((actuales) => ({ ...actuales, [nombre]: valor })),
    [setPreferencias],
  );

  return { preferencias, cambiarPreferencia };
}
