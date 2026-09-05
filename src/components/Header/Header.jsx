import { Link } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import { ROUTES } from '../../utils/constants';
import './Header.css';

function Header({ isLoggedIn, onLoginClick, onLogout }) {
  return (
    <header className="header">
      <Link className="header__logo" to={ROUTES.home}>
        <svg className="header__logo-icon" role="presentation" aria-hidden="true">
          <use href="/icons.svg#icon-logo" />
        </svg>
        MusicFetch
      </Link>

      <Navigation
        isLoggedIn={isLoggedIn}
        onLoginClick={onLoginClick}
        onLogout={onLogout}
      />
    </header>
  );
}

export default Header;
