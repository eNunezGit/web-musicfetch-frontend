import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import './NotFoundPage.css';

function NotFoundPage() {
  return (
    <main className="main">
      <section className="not-found">
        <h1 className="not-found__title">404</h1>

        <p className="not-found__text">
          This page does not exist. The link may be misspelled, or the page may
          have been moved.
        </p>

        <Link className="not-found__link" to={ROUTES.home}>
          Back to the home page
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;
