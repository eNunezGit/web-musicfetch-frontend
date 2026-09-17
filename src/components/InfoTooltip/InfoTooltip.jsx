import Popup from '../Popup/Popup';
import { MESSAGES } from '../../utils/constants';
import './InfoTooltip.css';

/**
 * Confirma al usuario el resultado del registro.
 * Registrarse ya deja la sesión iniciada, así que el botón no lleva a
 * identificarse: lleva al feed, que es lo siguiente que quiere ver.
 */
function InfoTooltip({ isOpen, isSuccess, onClose, onContinue }) {
  return (
    <Popup name="tooltip" isOpen={isOpen} onClose={onClose}>
      <svg
        className={`info-tooltip__icon info-tooltip__icon_state_${
          isSuccess ? 'success' : 'failure'
        }`}
        role="presentation"
        aria-hidden="true"
      >
        <use href={`/icons.svg#${isSuccess ? 'icon-check' : 'icon-alert'}`} />
      </svg>

      <h2 className="popup__title">
        {isSuccess ? MESSAGES.registerSuccess : MESSAGES.registerFailure}
      </h2>

      {isSuccess && (
        <button type="button" className="info-tooltip__action" onClick={onContinue}>
          Go to my feed
        </button>
      )}
    </Popup>
  );
}

export default InfoTooltip;
