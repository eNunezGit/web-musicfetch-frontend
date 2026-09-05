/**
 * Configuración central de MusicFetch.
 * Todos los valores no variables (hardcoded) viven aquí y se nombran en MAYÚSCULAS.
 */

/** URL base de la Verome API. Se sobrescribe con VITE_VEROME_BASE_URL en .env. */
export const VEROME_BASE_URL =
  import.meta.env.VITE_VEROME_BASE_URL || 'http://localhost:8000';

/** Filtros de /api/search que consultamos en cada búsqueda. */
export const SEARCH_FILTERS = ['artists', 'albums'];

/** Tipos de tarjeta que genera la aplicación. */
export const CARD_TYPES = {
  artist: 'artist',
  album: 'album',
};

/** Etiqueta legible de cada tipo de tarjeta. */
export const CARD_TYPE_LABELS = {
  [CARD_TYPES.artist]: 'Artist',
  [CARD_TYPES.album]: 'Album',
};

/** Cuántas tarjetas se renderizan por tanda ("Mostrar más" añade otra tanda). */
export const CARDS_PER_PAGE = 3;

/** Longitud máxima de la descripción que se guarda en una tarjeta. */
export const MAX_DESCRIPTION_LENGTH = 320;

/**
 * Lado, en píxeles, al que se piden las imágenes de las tarjetas.
 * La API devuelve miniaturas de 60 px en las búsquedas y banners de hasta
 * 2880 px en las fichas de artista; ambos tamaños se corrigen en la URL.
 */
export const THUMBNAIL_SIZE = 544;

/** Rutas de la aplicación. */
export const ROUTES = {
  home: '/',
  feed: '/my-feed',
};

/** Nombres de los popups. Cadena vacía = ningún popup abierto. */
export const POPUPS = {
  none: '',
  login: 'login',
  register: 'register',
  tooltip: 'tooltip',
};

/** Claves del almacenamiento local que usa el backend simulado. */
export const STORAGE_KEYS = {
  users: 'musicfetch.users',
  cards: 'musicfetch.cards',
  token: 'musicfetch.token',
};

/** Textos que la interfaz muestra al usuario. */
export const MESSAGES = {
  nothingFound: 'Nothing found',
  nothingFoundHint:
    'Try another artist or album name, or check the spelling.',
  emptyFeed: 'You have not saved any cards yet',
  emptyFeedHint:
    'Search for an artist or an album on the home page and save it to see it here.',
  searchFailed:
    'The search could not be completed. There may be a connection problem or the API may be unavailable. Please try again later.',
  saveFailed: 'The card could not be saved. Please try again.',
  deleteFailed: 'The card could not be deleted. Please try again.',
  emptyQuery: 'Enter the name of an artist or an album',
  loginRequired: 'Sign in to save this card',
  registerSuccess: 'Registration successfully completed!',
  registerFailure: 'Oops, something went wrong. Please try again.',
};

/** Enlaces externos del pie de página. */
export const EXTERNAL_LINKS = {
  github: 'https://github.com/eNunezGit',
  tripleten: 'https://tripleten.com/',
  api: 'https://github.com/Kirazul/Verome-API',
};
