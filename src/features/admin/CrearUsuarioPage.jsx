// DUEÑO: Eddie. Módulos 3, 7 y 8: inventario, panel de administración y reportes.
// MARCADOR: reemplaza todo el contenido de este archivo con tu pantalla.
// Props que recibe toda pantalla: { params, irA, sesion, carrito }
import MarcadorPantalla from '../../components/MarcadorPantalla.jsx';
import Boton from '../../components/Boton.jsx';

export default function CrearUsuarioPage({ irA }) {
  return (
    <MarcadorPantalla titulo="Crear usuario" responsable="Eddie" modulo="Panel de administración">
      <Boton variante="secundario" onClick={() => irA('admin-usuarios')}>
        Cancelar
      </Boton>
    </MarcadorPantalla>
  );
}
