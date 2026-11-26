// DUEÑO: Gabriel. Revisa que los boletos del carrito sigan disponibles antes
// de pagar (otro comprador o el panel pudo cambiar el inventario).
// La API vuelve a revisarlo al crear la orden, pero así el usuario se entera antes.
import { disponiblesZona, sePuedeComprar } from '../../utils/eventos.js';

// items: carrito.items · eventos: lista de la API (listarEventos)
// Devuelve una lista de mensajes; vacía = todo disponible
export function problemasDeStock(items, eventos) {
  return items.flatMap((item) => {
    const evento = eventos.find((e) => e.id === item.eventoId);
    const zona = evento?.zonas.find((z) => z.id === item.zonaId);
    if (!evento || !zona) return [`“${item.eventoTitulo}” ya no está disponible. Quítalo del carrito.`];
    if (!sePuedeComprar(evento)) return [`“${evento.titulo}” ya no está a la venta. Quítalo del carrito.`];
    const disponibles = disponiblesZona(zona);
    if (item.cantidad > disponibles) {
      return [
        disponibles === 0
          ? `La zona ${zona.nombre} de “${evento.titulo}” se agotó. Quítala del carrito.`
          : `En la zona ${zona.nombre} de “${evento.titulo}” solo quedan ${disponibles} boletos. Ajusta la cantidad.`,
      ];
    }
    return [];
  });
}
