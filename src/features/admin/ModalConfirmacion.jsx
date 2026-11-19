// DUEÑO: Eddie. Modal para confirmar una acción crítica (eliminar).
// Props:
//   abierto, titulo, mensaje
//   textoConfirmar: texto del botón rojo ("Sí, eliminar evento")
//   procesando:     boolean → el botón muestra "Procesando…" y no se puede pulsar dos veces
//   onConfirmar, onCancelar
import Modal from '../../components/Modal.jsx';
import Boton from '../../components/Boton.jsx';

export default function ModalConfirmacion({ abierto, titulo, mensaje, textoConfirmar, procesando, onConfirmar, onCancelar }) {
  return (
    <Modal abierto={abierto} titulo={titulo} onCerrar={procesando ? () => {} : onCancelar}>
      <p>{mensaje}</p>
      <div className="modal__acciones">
        <Boton variante="secundario" onClick={onCancelar} disabled={procesando}>
          Cancelar
        </Boton>
        <Boton variante="peligro" onClick={onConfirmar} cargando={procesando}>
          {textoConfirmar}
        </Boton>
      </div>
    </Modal>
  );
}
