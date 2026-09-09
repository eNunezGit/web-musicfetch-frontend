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
  AUTH_ERRORS,
  CARDS_PER_PAGE,
  MESSAGES,
  POPUPS,
  ROUTES,
  STORAGE_KEYS,
} from '../../utils/constants';
import './App.css';

/**
 * Texto en inglés para un fallo de sesión. mainApi rechaza con el código de
 * estado del servidor; sin código, la petición no llegó a responder.
 */
function describeAuthError(err) {
  if (!err.status) {
    return AUTH_ERRORS.offline;
  }

  return AUTH_ERRORS[err.status] || AUTH_ERRORS.default;
}

/** Un token caducado o falso ya no sirve; un servidor caído no lo invalida. */
function isRejectedToken(err) {
  return err.status === 401 || err.status === 403;
}

/**
 * Componente raíz. Concentra el estado de la aplicación y todas las peticiones,
 * tanto a la Verome API como al backend propio.
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
      .getCurrentUser(token)
      .then((user) => {
        setCurrentUser(user);
        setIsLoggedIn(true);

        // Que el feed falle no invalida la sesión: se avisa y se sigue.
        return mainApi.getSavedCards(token).then(setSavedCards, (err) => {
          console.error(err);
          setCardsError(MESSAGES.cardsLoadFailed);
        });
      })
      .catch((err) => {
        console.error(err);

        // El token solo se descarta si el servidor lo ha rechazado. Si el
        // servidor no responde, cerrar la sesión castigaría al usuario por
        // una caída ajena: el token puede seguir siendo válido.
        if (isRejectedToken(err)) {
          localStorage.removeItem(STORAGE_KEYS.token);
        }
      })
      .finally(() => setIsAuthChecked(true));
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

    // El servidor identifica la tarjeta por el _id del documento guardado,
    // no por el id que trae de la API de música.
    mainApi
      .deleteCard(card.savedId, token)
      .then((deletedId) => {
        setSavedCards((current) =>
          current.filter((saved) => saved.savedId !== deletedId),
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
        setAuthError(describeAuthError(err));
        setIsSubmitting(false);
      });
  }

  function handleLogin(values) {
    setIsSubmitting(true);
    setAuthError('');

    // /signin solo devuelve el token: el usuario y sus tarjetas se piden
    // después, ya con la cabecera de autorización puesta.
    mainApi
      .login(values)
      .then(({ token }) =>
        Promise.all([
          token,
          mainApi.getCurrentUser(token),
          mainApi.getSavedCards(token),
        ]),
      )
      .then(([token, user, cards]) => {
        // El token se guarda cuando la sesión ya está completa; si algo
        // hubiera fallado antes, no queda una sesión a medias en el navegador.
        localStorage.setItem(STORAGE_KEYS.token, token);

        setCurrentUser(user);
        setSavedCards(cards);
        setIsLoggedIn(true);
        setIsAuthChecked(true);
        setActivePopup(POPUPS.none);
        setIsSubmitting(false);
      })
      .catch((err) => {
        console.error(err);
        setAuthError(describeAuthError(err));
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
