import Popup from '../Popup/Popup';
import './PopupWithForm.css';

/**
 * Modal con formulario. Lo reutilizan el registro y el inicio de sesión:
 * ellos solo aportan los campos y el texto del enlace inferior.
 */
function PopupWithForm({
  name,
  title,
  submitText,
  submittingText = 'Sending…',
  isOpen,
  isValid,
  isSubmitting,
  submitError,
  onClose,
  onSubmit,
  onSwitch,
  switchText,
  switchActionText,
  children,
}) {
  return (
    <Popup name={name} isOpen={isOpen} onClose={onClose}>
      <h2 className="popup__title">{title}</h2>

      <form className="popup__form" name={name} onSubmit={onSubmit} noValidate>
        <fieldset className="popup__fieldset" disabled={isSubmitting}>
          {children}
        </fieldset>

        {submitError && (
          <p className="popup__submit-error" role="alert">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          className="popup__submit"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? submittingText : submitText}
        </button>
      </form>

      <p className="popup__switch">
        {switchText}{' '}
        <button type="button" className="popup__switch-button" onClick={onSwitch}>
          {switchActionText}
        </button>
      </p>
    </Popup>
  );
}

export default PopupWithForm;
