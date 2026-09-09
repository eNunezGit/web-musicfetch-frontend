import { useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import Preloader from '../Preloader/Preloader';
import { ROUTES } from '../../utils/constants';

/**
 * Deja pasar solo a los usuarios con sesión iniciada.
 * Mientras se comprueba el token muestra el preloader, para no redirigir
 * a quien sí tiene sesión guardada al recargar la página.
 * A quien no la tiene lo devuelve al inicio y avisa con onUnauthorized, para
 * que se abra el formulario de acceso: llegar a la portada sin explicación
 * dejaría al usuario sin saber por qué no ha entrado.
 */
function ProtectedRoute({ isLoggedIn, isAuthChecked, onUnauthorized, children }) {
  // Solo se decide cuando la sesión está comprobada; antes no se sabe nada.
  const isBlocked = isAuthChecked && !isLoggedIn;

  // Quien ya estaba dentro y deja de estarlo es alguien que cerró sesión, no
  // un intruso. Hace falta recordarlo porque al cerrar sesión esta ruta se ve
  // bloqueada un instante: react-router navega dentro de una transición, así
  // que el cambio de sesión se pinta antes que el cambio de ruta.
  const hasBeenAuthorized = useRef(false);

  // Los efectos van antes de cualquier return: los hooks no pueden quedar
  // detrás de una condición.
  useEffect(() => {
    if (isLoggedIn) {
      hasBeenAuthorized.current = true;
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isBlocked && !hasBeenAuthorized.current) {
      onUnauthorized();
    }
  }, [isBlocked, onUnauthorized]);

  if (!isAuthChecked) {
    return <Preloader text="Checking your session…" />;
  }

  return isLoggedIn ? children : <Navigate to={ROUTES.home} replace />;
}

export default ProtectedRoute;
