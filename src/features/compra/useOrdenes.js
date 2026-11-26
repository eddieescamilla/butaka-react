// DUEÑO: Gabriel. Órdenes y boletos del usuario, leídos de la API falsa
// (src/api/ordenes.js) con usePeticion: estados de carga, error y vacío.
//
// Uso: const { estado, ordenes, boletos, error, reintentar } = useOrdenes(usuario.id);
import { useMemo } from 'react';
import { usePeticion } from '../../hooks/usePeticion.js';
import { listarOrdenes } from '../../api/ordenes.js';

export function useOrdenes(usuarioId) {
  const { estado, datos, error, reintentar } = usePeticion((signal) => listarOrdenes({ usuarioId }, { signal }), [usuarioId]);
  const ordenes = useMemo(() => datos ?? [], [datos]);
  // Valor derivado: todos los boletos de todas las órdenes
  const boletos = useMemo(() => ordenes.flatMap((orden) => orden.boletos), [ordenes]);
  return { estado, ordenes, boletos, error, reintentar };
}
