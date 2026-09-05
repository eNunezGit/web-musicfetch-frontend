import Popup from '../Popup/Popup';
import { MESSAGES } from '../../utils/constants';
import './InfoTooltip.css';

/** Confirma al usuario el resultado del registro. */
function InfoTooltip({ isOpen, isSuccess, onClose, onSwitch }) {
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
        <button type="button" className="info-tooltip__action" onClick={onSwitch}>
          Sign in
        </button>
      )}
    </Popup>
  );
}

export default InfoTooltip;
