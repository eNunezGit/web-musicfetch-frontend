import './NothingFound.css';

/**
 * Bloque de estado vacío. Se reutiliza para "No se ha encontrado nada",
 * para el feed vacío y para los errores de la API.
 */
function NothingFound({ icon = 'icon-search', title, description }) {
  return (
    <div className="nothing-found">
      <svg className="nothing-found__icon" role="presentation" aria-hidden="true">
        <use href={`/icons.svg#${icon}`} />
      </svg>
      <h3 className="nothing-found__title">{title}</h3>
      {description && <p className="nothing-found__text">{description}</p>}
    </div>
  );
}

export default NothingFound;
