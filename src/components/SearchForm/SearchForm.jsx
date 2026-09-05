import { useState } from 'react';
import { MESSAGES } from '../../utils/constants';
import './SearchForm.css';

/** Formulario de búsqueda de artistas y álbumes. */
function SearchForm({ isSearching, onSearch }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  function handleChange(evt) {
    setQuery(evt.target.value);

    if (error) {
      setError('');
    }
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    if (!query.trim()) {
      setError(MESSAGES.emptyQuery);
      return;
    }

    setError('');
    onSearch(query);
  }

  return (
    <form className="search-form" name="search" onSubmit={handleSubmit} noValidate>
      <label className="search-form__field" htmlFor="search-query">
        <span className="search-form__label">Artist or album</span>
        <input
          id="search-query"
          className="search-form__input"
          name="query"
          type="search"
          placeholder="Enter an artist or an album"
          value={query}
          onChange={handleChange}
          disabled={isSearching}
          autoComplete="off"
          required
        />
      </label>

      <button type="submit" className="search-form__submit" disabled={isSearching}>
        <svg className="search-form__icon" role="presentation" aria-hidden="true">
          <use href="/icons.svg#icon-search" />
        </svg>
        {isSearching ? 'Searching…' : 'Search'}
      </button>

      {error && (
        <p className="search-form__error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

export default SearchForm;
