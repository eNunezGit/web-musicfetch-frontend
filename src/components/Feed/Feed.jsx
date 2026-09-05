import { useContext } from 'react';
import CardList from '../CardList/CardList';
import NothingFound from '../NothingFound/NothingFound';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import { MESSAGES } from '../../utils/constants';
import './Feed.css';

/** Feed privado: solo contiene las tarjetas guardadas por el usuario de la sesión. */
function Feed({ cards, busyCardId, error, onDelete }) {
  const currentUser = useContext(CurrentUserContext);
  const cardWord = cards.length === 1 ? 'saved card' : 'saved cards';

  return (
    <main className="main">
      <section className="feed">
        <p className="feed__label">Your feed</p>

        <h1 className="feed__title">
          {currentUser?.name}, you have {cards.length} {cardWord}
        </h1>

        {error && (
          <p className="feed__error" role="alert">
            {error}
          </p>
        )}

        {cards.length === 0 ? (
          <NothingFound
            icon="icon-bookmark"
            title={MESSAGES.emptyFeed}
            description={MESSAGES.emptyFeedHint}
          />
        ) : (
          <CardList
            cards={cards}
            variant="saved"
            busyCardId={busyCardId}
            onDelete={onDelete}
          />
        )}
      </section>
    </main>
  );
}

export default Feed;
