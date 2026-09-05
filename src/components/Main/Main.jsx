import About from '../About/About';
import SearchForm from '../SearchForm/SearchForm';
import SearchResults from '../SearchResults/SearchResults';
import './Main.css';

/** Página principal: buscador, resultados y presentación del proyecto. */
function Main({
  hasSearched,
  isSearching,
  searchError,
  cards,
  visibleCount,
  savedIds,
  busyCardId,
  isLoggedIn,
  onSearch,
  onShowMore,
  onSave,
}) {
  return (
    <main className="main">
      <section className="hero">
        <h1 className="hero__title">
          Find your artists and albums, and keep them in your feed
        </h1>

        <p className="hero__text">
          Type the name of an artist or an album. MusicFetch gathers its
          information and creates a card you can keep in your personal feed.
        </p>

        <SearchForm isSearching={isSearching} onSearch={onSearch} />
      </section>

      <SearchResults
        hasSearched={hasSearched}
        isSearching={isSearching}
        error={searchError}
        cards={cards}
        visibleCount={visibleCount}
        savedIds={savedIds}
        busyCardId={busyCardId}
        isLoggedIn={isLoggedIn}
        onShowMore={onShowMore}
        onSave={onSave}
      />

      <About />
    </main>
  );
}

export default Main;
