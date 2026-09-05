import Card from '../Card/Card';
import './CardList.css';

/** Cuadrícula de tarjetas. La comparten los resultados de búsqueda y el feed. */
function CardList({
  cards,
  variant = 'search',
  savedIds = [],
  busyCardId = '',
  isLoggedIn = false,
  onSave,
  onDelete,
}) {
  return (
    <ul className="card-list">
      {cards.map((card) => (
        <li className="card-list__item" key={card.id}>
          <Card
            card={card}
            variant={variant}
            isSaved={savedIds.includes(card.id)}
            isBusy={busyCardId === card.id}
            isLoggedIn={isLoggedIn}
            onSave={onSave}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}

export default CardList;
