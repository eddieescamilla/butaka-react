// DUEÑO: Gabriel. Módulos 4, 5 y 6: proceso de compra, pagos y boletos electrónicos.
// MARCADOR: reemplaza todo el contenido de este archivo con tu pantalla.
// Props que recibe toda pantalla: { params, irA, sesion, carrito }
import MarcadorPantalla from '../../components/MarcadorPantalla.jsx';
import Boton from '../../components/Boton.jsx';
import { EVENTOS } from '../../data/eventos.js';

export default function SeleccionPage({ params, irA, carrito }) {
  // params.eventoId llega desde el detalle del evento (pantalla de Eddie).
  const evento = EVENTOS.find((item) => item.id === params.eventoId);
  const zona = evento?.zonas.find((item) => item.vendidos < item.capacidad);

  function agregarDePrueba() {
    carrito.agregar({
      eventoId: evento.id,
      eventoTitulo: evento.titulo,
      fecha: evento.fecha,
      lugar: evento.lugar,
      zonaId: zona.id,
      zonaNombre: zona.nombre,
      precio: zona.precio,
      cantidad: 2,
    });
    irA('carrito');
  }

  return (
    <MarcadorPantalla titulo="Selecciona tus boletos" responsable="Gabriel" modulo="Proceso de compra · Paso 1 de 4">
      <p>Evento: {evento ? evento.titulo : `no encontrado (${params.eventoId})`}</p>
      {zona && <Boton onClick={agregarDePrueba}>Agregar 2 boletos {zona.nombre} al carrito</Boton>}
    </MarcadorPantalla>
  );
}
