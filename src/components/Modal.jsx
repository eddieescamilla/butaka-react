// COMPONENTE COMPARTIDO (congelado). Ventana modal accesible con <dialog>:
// atrapa el foco, se cierra con Escape y devuelve el foco al cerrarse.
// Props:
//   abierto:   boolean
//   titulo:    texto del encabezado
//   onCerrar:  función que se llama al cerrar (Escape, clic afuera o botón)
//   children:  contenido del modal (por ejemplo, texto y botones)
// Ejemplo (modal de eliminar evento):
//   <Modal abierto={abierto} titulo="¿Deseas eliminar este evento?" onCerrar={cerrar}>
//     <p>…</p>
//     <div className="modal__acciones">…botones…</div>
//   </Modal>
import { useEffect, useId, useRef } from 'react';
import './Modal.css';

export default function Modal({ abierto, titulo, onCerrar, children }) {
  const referencia = useRef(null);
  const idTitulo = useId();

  useEffect(() => {
    const dialogo = referencia.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) dialogo.showModal();
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  // Clic en el fondo oscuro (fuera de la caja) cierra el modal
  function alHacerClic(evento) {
    if (evento.target === referencia.current) onCerrar();
  }

  return (
    <dialog
      ref={referencia}
      className="modal"
      aria-labelledby={idTitulo}
      onCancel={(evento) => {
        evento.preventDefault();
        onCerrar();
      }}
      onClick={alHacerClic}
    >
      <div className="modal__caja">
        <h2 id={idTitulo} className="modal__titulo">
          {titulo}
        </h2>
        <div className="modal__contenido">{children}</div>
      </div>
    </dialog>
  );
}
