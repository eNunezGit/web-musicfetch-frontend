import { Navigate } from 'react-router-dom';
import Preloader from '../Preloader/Preloader';
import { ROUTES } from '../../utils/constants';

/**
 * Deja pasar solo a los usuarios con sesión iniciada.
 * Mientras se comprueba el token muestra el preloader, para no redirigir
 * a quien sí tiene sesión guardada al recargar la página.
 */
function ProtectedRoute({ isLoggedIn, isAuthChecked, children }) {
  if (!isAuthChecked) {
    return <Preloader text="Checking your session…" />;
  }

  return isLoggedIn ? children : <Navigate to={ROUTES.home} replace />;
}

export default ProtectedRoute;
