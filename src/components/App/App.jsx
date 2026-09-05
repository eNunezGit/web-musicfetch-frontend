import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Main from '../Main/Main';
import Feed from '../Feed/Feed';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import LoginPopup from '../LoginPopup/LoginPopup';
import RegisterPopup from '../RegisterPopup/RegisterPopup';
import InfoTooltip from '../InfoTooltip/InfoTooltip';

import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import * as mainApi from '../../utils/mainApi';
import { getCardDetails, searchMusic } from '../../utils/veromeApi';
import {
  CARDS_PER_PAGE,
  MESSAGES,
  POPUPS,
  ROUTES,
  STORAGE_KEYS,
} from '../../utils/constants';
import './App.css';

/**
 * Componente raíz. Concentra el estado de la aplicación y todas las peticiones,
 * tanto a la Verome API como al backend de tarjetas.
 */
function App() {
  const navigate = useNavigate();

  // Sesión
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Sin token guardado no hay nada que comprobar: la sesión ya está resuelta.
  const [isAuthChecked, setIsAuthChecked] = useState(
    () => !localStorage.getItem(STORAGE_KEYS.token),
  );

  // Búsqueda
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_PAGE);

  // Tarjetas guardadas
  const [savedCards, setSavedCards] = useState([]);
  const [busyCardId, setBusyCardId] = useState('');
  const [cardsError, setCardsError] = useState('');

  // Ventanas modales
  const [activePopup, setActivePopup] = useState(POPUPS.none);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);

  const savedIds = savedCards.map((card) => card.id);

  // Restaura la sesión guardada al cargar la aplicación.
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.token);

    if (!token) {
      return;
    }

    mainApi
      .checkToken(token)
      .then((user) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
        return mainApi.getSavedCards(token);
      })
      .then((cards) => {
        setSavedCards(cards);
        setIsAuthChecked(true);
      })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem(STORAGE_KEYS.token);
        setIsAuthChecked(true);
      });
  }, []);

  const closePopup = useCallback(() => {
    setActivePopup(POPUPS.none);
    setAuthError('');
  }, []);

  function openPopup(name) {
    setAuthError('');
    setActivePopup(name);
  }

  // Verome API

  function handleSearch(query) {
    setHasSearched(true);
    setIsSearching(true);
    setSearchError('');
    setSearchResults([]);
    setVisibleCount(CARDS_PER_PAGE);

    searchMusic(query)
      .then((cards) => {
        setSearchResults(cards);
        setIsSearching(false);
      })
      .catch((err) => {
        console.error(err);
        setSearchError(MESSAGES.searchFailed);
        setIsSearching(false);
      });
  }

  function handleShowMore() {
    setVisibleCount((current) => current + CARDS_PER_PAGE);
  }

  // Tarjetas

  /** Pide el detalle completo a la API y guarda la tarjeta resultante. */
  function handleSaveCard(card) {
    if (!isLoggedIn) {
      openPopup(POPUPS.login);
      return;
    }

    const token = localStorage.getItem(STORAGE_KEYS.token);

    setBusyCardId(card.id);
    setCardsError('');

    getCardDetails(card)
      .then((detailedCard) => mainApi.saveCard(detailedCard, token))
      .then((savedCard) => {
        setSavedCards((current) => [savedCard, ...current]);
        setBusyCardId('');
      })
      .catch((err) => {
        console.error(err);
        setCardsError(MESSAGES.saveFailed);
        setBusyCardId('');
      });
  }

  function handleDeleteCard(card) {
    const token = localStorage.getItem(STORAGE_KEYS.token);

    setBusyCardId(card.id);
    setCardsError('');

    mainApi
      .deleteCard(card.id, token)
      .then((deletedId) => {
        setSavedCards((current) =>
          current.filter((saved) => saved.id !== deletedId),
        );
        setBusyCardId('');
      })
      .catch((err) => {
        console.error(err);
        setCardsError(MESSAGES.deleteFailed);
        setBusyCardId('');
      });
  }

  // Sesión

  function handleRegister(values) {
    setIsSubmitting(true);
    setAuthError('');

    mainApi
      .register(values)
      .then(() => {
        setIsRegisterSuccess(true);
        setActivePopup(POPUPS.tooltip);
        setIsSubmitting(false);
      })
      .catch((err) => {
        console.error(err);
        setAuthError(err.message);
        setIsSubmitting(false);
      });
  }

  function handleLogin(values) {
    setIsSubmitting(true);
    setAuthError('');

    mainApi
      .login(values)
      .then(({ token, user }) => {
        localStorage.setItem(STORAGE_KEYS.token, token);
        setCurrentUser(user);
        setIsLoggedIn(true);
        setActivePopup(POPUPS.none);
        return mainApi.getSavedCards(token);
      })
      .then((cards) => {
        setSavedCards(cards);
        setIsSubmitting(false);
      })
      .catch((err) => {
        console.error(err);
        setAuthError(err.message);
        setIsSubmitting(false);
      });
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEYS.token);
    setCurrentUser(null);
    setIsLoggedIn(false);
    setSavedCards([]);
    setCardsError('');
    navigate(ROUTES.home);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          isLoggedIn={isLoggedIn}
          onLoginClick={() => openPopup(POPUPS.login)}
          onLogout={handleLogout}
        />

        <Routes>
          <Route
            path={ROUTES.home}
            element={
              <Main
                hasSearched={hasSearched}
                isSearching={isSearching}
                searchError={searchError || cardsError}
                cards={searchResults}
                visibleCount={visibleCount}
                savedIds={savedIds}
                busyCardId={busyCardId}
                isLoggedIn={isLoggedIn}
                onSearch={handleSearch}
                onShowMore={handleShowMore}
                onSave={handleSaveCard}
              />
            }
          />

          <Route
            path={ROUTES.feed}
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} isAuthChecked={isAuthChecked}>
                <Feed
                  cards={savedCards}
                  busyCardId={busyCardId}
                  error={cardsError}
                  onDelete={handleDeleteCard}
                />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <Footer />

        <LoginPopup
          isOpen={activePopup === POPUPS.login}
          isSubmitting={isSubmitting}
          submitError={authError}
          onClose={closePopup}
          onLogin={handleLogin}
          onSwitch={() => openPopup(POPUPS.register)}
        />

        <RegisterPopup
          isOpen={activePopup === POPUPS.register}
          isSubmitting={isSubmitting}
          submitError={authError}
          onClose={closePopup}
          onRegister={handleRegister}
          onSwitch={() => openPopup(POPUPS.login)}
        />

        <InfoTooltip
          isOpen={activePopup === POPUPS.tooltip}
          isSuccess={isRegisterSuccess}
          onClose={closePopup}
          onSwitch={() => openPopup(POPUPS.login)}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
