import { Link } from 'react-router-dom';
import { EXTERNAL_LINKS, ROUTES } from '../../utils/constants';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer__copyright">
        &copy; {currentYear} MusicFetch, TripleTen final project
      </p>

      <ul className="footer__links">
        <li className="footer__item">
          <Link className="footer__link" to={ROUTES.home}>
            Home
          </Link>
        </li>
        <li className="footer__item">
          <a
            className="footer__link"
            href={EXTERNAL_LINKS.tripleten}
            target="_blank"
            rel="noopener noreferrer"
          >
            TripleTen
          </a>
        </li>
        <li className="footer__item">
          <a
            className="footer__link"
            href={EXTERNAL_LINKS.api}
            target="_blank"
            rel="noopener noreferrer"
          >
            Verome API
          </a>
        </li>
        <li className="footer__item">
          <a
            className="footer__link"
            href={EXTERNAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="footer__icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#icon-github" />
            </svg>
            GitHub
          </a>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
