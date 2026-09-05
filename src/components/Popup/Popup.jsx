import { useEscapeKey } from '../../hooks/useEscapeKey';
import './Popup.css';

/**
 * Ventana modal base. Se cierra con el botón de la cruz, haciendo clic en la
 * superposición o pulsando Esc.
 */
function Popup({ name, isOpen, onClose, children }) {
  useEscapeKey(isOpen, onClose);

  /** Solo cierra si el clic ocurrió en la superposición, no dentro del cuadro. */
  function handleOverlayClick(evt) {
    if (evt.target === evt.currentTarget) {
      onClose();
    }
  }

  return (
    <section
      className={`popup popup_type_${name}${isOpen ? ' popup_opened' : ''}`}
      aria-hidden={!isOpen}
      onMouseDown={handleOverlayClick}
    >
      <div className="popup__container" role="dialog" aria-modal="true">
        <button
          type="button"
          className="popup__close"
          aria-label="Close the window"
          onClick={onClose}
        >
          <svg className="popup__close-icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#icon-close" />
          </svg>
        </button>
        {children}
      </div>
    </section>
  );
}

export default Popup;
