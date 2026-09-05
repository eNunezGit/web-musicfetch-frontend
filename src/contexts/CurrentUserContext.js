import { createContext } from 'react';

/** Usuario de la sesión actual; null cuando nadie ha iniciado sesión. */
export const CurrentUserContext = createContext(null);
