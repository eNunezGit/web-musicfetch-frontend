/**
 * Configuración central de MusicFetch.
 * Todos los valores no variables (hardcoded) viven aquí y se nombran en MAYÚSCULAS.
 */

/**
 * URL base de la Verome API.
 * Por defecto apunta al despliegue público, para que cualquier compilación
 * funcione sin configuración previa. Para trabajar contra una copia local de
 * la API basta con definir VITE_VEROME_BASE_URL en .env.
 */
export const VEROME_BASE_URL =
  import.meta.env.VITE_VEROME_BASE_URL ||
  'https://verome-api.enunezgit.deno.net';

/**
 * URL base del backend propio (sesión y tarjetas guardadas).
 * Mismo criterio que la Verome API: por defecto el despliegue público, para
 * trabajar contra el servidor local basta con definir VITE_MAIN_BASE_URL.
 */
export const MAIN_BASE_URL =
  import.meta.env.VITE_MAIN_BASE_URL ||
  'https://api.musicfetch.chickenkiller.com';

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
export const CARDS_PER_PAGE = 4;

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

/**
 * Claves del almacenamiento local.
 * El token es lo único que la aplicación persiste en el navegador: el usuario
 * y sus tarjetas se piden al servidor con él en cada arranque.
 */
export const STORAGE_KEYS = {
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
  cardsLoadFailed:
    'Your saved cards could not be loaded. Please reload the page.',
  emptyQuery: 'Enter the name of an artist or an album',
  loginRequired: 'Sign in to save this card',
  registerSuccess: 'Registration successfully completed!',
  registerFailure: 'Oops, something went wrong. Please try again.',
  // El registro conecta al usuario. Si esa segunda parte falla, la cuenta ya
  // existe: repetir el registro chocaría con su propio correo.
  accountCreatedSignInFailed:
    'Your account was created, but the session could not be started. Please sign in.',
};

/**
 * Errores de sesión que ve el usuario, por código de estado del servidor.
 * La API responde en español y la interfaz está en inglés, así que el texto
 * se decide aquí a partir del código, no del mensaje que llega en el cuerpo.
 * `offline` es el caso en que la petición ni siquiera llegó a responder.
 */
export const AUTH_ERRORS = {
  400: 'Please check the information you entered.',
  401: 'The email address or the password is incorrect.',
  409: 'An account with that email address already exists.',
  429: 'Too many attempts. Please try again in a few minutes.',
  default: 'Something went wrong. Please try again.',
  offline: 'The server is not responding. Please try again later.',
};

/** Enlaces externos del pie de página. */
export const EXTERNAL_LINKS = {
  github: 'https://github.com/eNunezGit',
  tripleten: 'https://tripleten.com/',
  api: 'https://github.com/Kirazul/Verome-API',
};
