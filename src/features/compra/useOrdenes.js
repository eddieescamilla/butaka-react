// DUEÑO: Gabriel. Órdenes y boletos comprados.
// Las órdenes nuevas se guardan en localStorage ('butaka:ordenes'); las de
// ejemplo (src/data/ordenes.js) se suman para que "Mis boletos" no esté vacío.
//
// Cada boleto guarda una copia de los datos del evento (título, fecha, lugar,
// zona) para seguir mostrándose aunque el evento cambie o se elimine.

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { ORDENES_EJEMPLO } from '../../data/ordenes.js';
import { EVENTOS } from '../../data/eventos.js';

// Completa los boletos de ejemplo, que solo traen eventoId y zonaId
function completarBoleto(boleto, orden) {
  if (boleto.eventoTitulo) return { ...boleto, ordenId: orden.id };
  const evento = EVENTOS.find((item) => item.id === boleto.eventoId);
  const zona = evento?.zonas.find((item) => item.id === boleto.zonaId);
  return {
    ...boleto,
    ordenId: orden.id,
    eventoTitulo: evento?.titulo ?? 'Evento',
    fecha: evento?.fecha,
    lugar: evento?.lugar,
    zonaNombre: zona?.nombre ?? boleto.zonaId,
    precio: zona?.precio,
  };
}

// "BTK-4821-03": prefijo, número de orden y número de boleto
function codigoBoleto(numeroOrden, indice) {
  return `BTK-${numeroOrden}-${String(indice + 1).padStart(2, '0')}`;
}

export function useOrdenes(usuarioId) {
  const [guardadas, setGuardadas] = useLocalStorage('butaka:ordenes', []);

  // Valor derivado: órdenes del usuario, de la más reciente a la más antigua
  const ordenes = useMemo(
    () =>
      [...guardadas, ...ORDENES_EJEMPLO]
        .filter((orden) => orden.usuarioId === usuarioId)
        .map((orden) => ({ ...orden, boletos: orden.boletos.map((boleto) => completarBoleto(boleto, orden)) }))
        .sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra)),
    [guardadas, usuarioId],
  );

  const boletos = useMemo(() => ordenes.flatMap((orden) => orden.boletos), [ordenes]);

  // Crea la orden a partir del carrito. tarjeta = { titular, ultimos4 }
  // (nunca se guarda el número completo de la tarjeta).
  const crearOrden = useCallback(
    (carrito, tarjeta) => {
      const numero = String(Date.now()).slice(-4);
      let indice = 0;
      const boletosNuevos = carrito.items.flatMap((item) =>
        Array.from({ length: item.cantidad }, () => {
          const boleto = {
            codigo: codigoBoleto(numero, indice),
            eventoId: item.eventoId,
            zonaId: item.zonaId,
            eventoTitulo: item.eventoTitulo,
            fecha: item.fecha,
            lugar: item.lugar,
            zonaNombre: item.zonaNombre,
            precio: item.precio,
          };
          indice += 1;
          return boleto;
        }),
      );
      const orden = {
        id: `ord-${numero}`,
        usuarioId,
        fechaCompra: new Date().toISOString(),
        estado: 'pagada',
        items: carrito.items.map(({ eventoId, zonaId, cantidad, precio }) => ({ eventoId, zonaId, cantidad, precioUnitario: precio })),
        subtotal: carrito.subtotal,
        cargoServicio: carrito.cargoServicio,
        total: carrito.total,
        tarjeta,
        boletos: boletosNuevos,
      };
      setGuardadas((actuales) => [orden, ...actuales]);
      return orden;
    },
    [usuarioId, setGuardadas],
  );

  return { ordenes, boletos, crearOrden };
}
