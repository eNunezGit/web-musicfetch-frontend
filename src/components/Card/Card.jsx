import { useState } from 'react';
import {
  CARD_TYPES,
  CARD_TYPE_LABELS,
  MESSAGES,
  THUMBNAIL_SIZE,
} from '../../utils/constants';
import coverPlaceholder from '../../images/cover-placeholder.svg';
import './Card.css';

/** Texto alternativo acorde al tipo de entidad que ilustra la imagen. */
function buildImageAlt(card, isPlaceholder) {
  if (isPlaceholder) {
    return `No image available for ${card.title}`;
  }

  return card.type === CARD_TYPES.album
    ? `Cover of the album ${card.title}`
    : `Photograph of the artist ${card.title}`;
}

/**
 * Tarjeta de un artista o de un álbum.
 * La misma tarjeta sirve en los resultados de búsqueda y en el feed guardado;
 * solo cambia la acción del botón.
 */
function Card({
  card,
  variant = 'search',
  isSaved = false,
  isBusy = false,
  isLoggedIn = false,
  onSave,
  onDelete,
}) {
  const isSavedVariant = variant === 'saved';
  // La API no siempre trae miniatura, y algunas de las que trae ya no existen
  // en el origen. En ambos casos la tarjeta cae en la portada de reserva.
  const [hasImageError, setHasImageError] = useState(false);
  const isPlaceholder = !card.image || hasImageError;

  function handleAction() {
    if (isSavedVariant) {
      onDelete(card);
      return;
    }

    onSave(card);
  }

  function buildActionLabel() {
    if (isSavedVariant) {
      return 'Remove from feed';
    }

    if (!isLoggedIn) {
      return MESSAGES.loginRequired;
    }

    return isSaved ? 'Already in your feed' : 'Save to my feed';
  }

  const actionLabel = buildActionLabel();

  return (
    <article className={`card card_type_${variant}`}>
      <img
        className="card__image"
        src={isPlaceholder ? coverPlaceholder : card.image}
        alt={buildImageAlt(card, isPlaceholder)}
        width={THUMBNAIL_SIZE}
        height={THUMBNAIL_SIZE}
        loading="lazy"
        onError={isPlaceholder ? undefined : () => setHasImageError(true)}
      />

      <button
        type="button"
        className={`card__action${isSaved && !isSavedVariant ? ' card__action_saved' : ''}`}
        title={actionLabel}
        aria-label={actionLabel}
        disabled={isBusy || (isSaved && !isSavedVariant)}
        onClick={handleAction}
      >
        <svg className="card__action-icon" role="presentation" aria-hidden="true">
          <use
            href={`/icons.svg#${
              isSavedVariant
                ? 'icon-trash'
                : `icon-bookmark${isSaved ? '-filled' : ''}`
            }`}
          />
        </svg>
      </button>

      <p className="card__type">{CARD_TYPE_LABELS[card.type]}</p>
      <h3 className="card__title">{card.title}</h3>

      {card.subtitle && <p className="card__subtitle">{card.subtitle}</p>}
      {card.description && <p className="card__description">{card.description}</p>}

      {card.stats?.length > 0 && (
        <dl className="card__stats">
          {card.stats.map((stat) => (
            <div className="card__stat" key={stat.label}>
              <dt className="card__stat-label">{stat.label}</dt>
              <dd className="card__stat-value">{stat.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {card.highlights?.length > 0 && (
        <ul className="card__highlights">
          {card.highlights.map((highlight) => (
            <li className="card__highlight" key={highlight}>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default Card;
