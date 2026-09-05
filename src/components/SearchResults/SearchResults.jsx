import CardList from '../CardList/CardList';
import NothingFound from '../NothingFound/NothingFound';
import Preloader from '../Preloader/Preloader';
import { MESSAGES } from '../../utils/constants';
import './SearchResults.css';

/**
 * Bloque de resultados. Aparece después de enviar el formulario y muestra,
 * según el caso, el preloader, un error, el mensaje de "nada encontrado"
 * o las tarjetas encontradas de tres en tres.
 */
function SearchResults({
  hasSearched,
  isSearching,
  error,
  cards,
  visibleCount,
  savedIds,
  busyCardId,
  isLoggedIn,
  onShowMore,
  onSave,
}) {
  // Antes de la primera búsqueda no hay nada que anunciar.
  if (!hasSearched && !isSearching) {
    return null;
  }

  const visibleCards = cards.slice(0, visibleCount);
  const hasMore = visibleCount < cards.length;

  return (
    <section className="search-results" aria-live="polite" aria-busy={isSearching}>
      <h2 className="search-results__title">Search results</h2>

      {isSearching && <Preloader />}

      {!isSearching && error && (
        <NothingFound icon="icon-alert" title="Something went wrong" description={error} />
      )}

      {!isSearching && !error && cards.length === 0 && (
        <NothingFound
          title={MESSAGES.nothingFound}
          description={MESSAGES.nothingFoundHint}
        />
      )}

      {!isSearching && !error && cards.length > 0 && (
        <>
          <CardList
            cards={visibleCards}
            variant="search"
            savedIds={savedIds}
            busyCardId={busyCardId}
            isLoggedIn={isLoggedIn}
            onSave={onSave}
          />

          {hasMore && (
            <button type="button" className="search-results__more" onClick={onShowMore}>
              Show more
            </button>
          )}
        </>
      )}
    </section>
  );
}

export default SearchResults;
