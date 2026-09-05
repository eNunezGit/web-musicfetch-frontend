import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import { ROUTES } from '../../utils/constants';
import './Navigation.css';

/** Menú principal. En pantallas estrechas se despliega desde el botón hamburguesa. */
function Navigation({ isLoggedIn, onLoginClick, onLogout }) {
  const currentUser = useContext(CurrentUserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function handleLoginClick() {
    closeMenu();
    onLoginClick();
  }

  function handleLogoutClick() {
    closeMenu();
    onLogout();
  }

  function buildLinkClassName({ isActive }) {
    return `navigation__link${isActive ? ' navigation__link_active' : ''}`;
  }

  return (
    <nav className="navigation">
      <button
        type="button"
        className="navigation__toggle"
        aria-expanded={isMenuOpen}
        aria-controls="navigation-menu"
        aria-label={isMenuOpen ? 'Close the menu' : 'Open the menu'}
        onClick={() => setIsMenuOpen((current) => !current)}
      >
        <svg className="navigation__toggle-icon" role="presentation" aria-hidden="true">
          <use href={`/icons.svg#${isMenuOpen ? 'icon-close' : 'icon-menu'}`} />
        </svg>
      </button>

      <ul
        id="navigation-menu"
        className={`navigation__list${isMenuOpen ? ' navigation__list_opened' : ''}`}
      >
        <li className="navigation__item">
          <NavLink className={buildLinkClassName} to={ROUTES.home} onClick={closeMenu} end>
            Home
          </NavLink>
        </li>

        {isLoggedIn && (
          <li className="navigation__item">
            <NavLink className={buildLinkClassName} to={ROUTES.feed} onClick={closeMenu}>
              My feed
            </NavLink>
          </li>
        )}

        <li className="navigation__item">
          {isLoggedIn ? (
            <button
              type="button"
              className="navigation__button"
              onClick={handleLogoutClick}
            >
              {currentUser?.name}
              <svg
                className="navigation__button-icon"
                role="presentation"
                aria-hidden="true"
              >
                <use href="/icons.svg#icon-logout" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              className="navigation__button"
              onClick={handleLoginClick}
            >
              Sign in
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
