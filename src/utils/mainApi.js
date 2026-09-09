/**
 * Cliente del backend propio de MusicFetch.
 * Se ocupa de la sesión (registro, inicio de sesión, usuario actual) y de las
 * tarjetas guardadas. Como en veromeApi.js, solo se usa la API Fetch nativa:
 * este archivo construye y normaliza peticiones, y quien las dispara y captura
 * los errores es el componente App.
 *
 * Las rutas protegidas viajan con `Authorization: Bearer <token>`. El token lo
 * guarda App en localStorage al iniciar sesión y lo pasa en cada llamada.
 */

import { CARD_TYPES, MAIN_BASE_URL } from './constants';

/**
 * Error de la API con el código de estado a la vista.
 * El cuerpo del servidor viene en español y la interfaz está en inglés, así que
 * quien lo captura decide el texto a partir de `status`; `message` queda para
 * la consola. Sin `status` significa que la petición no llegó a responder.
 */
class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** El primer then() de cada cadena: valida la respuesta y devuelve res.json. */
function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }

  // Todos los errores de la API responden { message }, pero un 502 de nginx o
  // un 429 del limitador pueden llegar en HTML: el texto no puede darse por hecho.
  return res
    .json()
    .catch(() => ({}))
    .then((data) =>
      Promise.reject(
        new ApiError(data.message || `Error ${res.status}`, res.status),
      ),
    );
}

/** Traduce un fallo de red (servidor caído, sin conexión, CORS) en un ApiError. */
function checkNetwork(err) {
  if (err instanceof ApiError) {
    return Promise.reject(err);
  }

  return Promise.reject(new ApiError(err.message, undefined));
}

/**
 * Punto único por el que pasan todas las peticiones.
 * `token` es opcional: las rutas públicas (/signup y /signin) no lo llevan.
 */
function request(path, { method = 'GET', body, token } = {}) {
  const headers = {};

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${MAIN_BASE_URL}${path}`, {
    method,
    headers,
    body: body && JSON.stringify(body),
  })
    .then(checkResponse)
    .catch(checkNetwork);
}

// --- Sesión ---

export function register({ name, email, password }) {
  return request('/signup', {
    method: 'POST',
    body: { name: name.trim(), email: email.trim().toLowerCase(), password },
  });
}

/** Devuelve { token }: el usuario se pide después con getCurrentUser. */
export function login({ email, password }) {
  return request('/signin', {
    method: 'POST',
    body: { email: email.trim().toLowerCase(), password },
  });
}

/**
 * Usuario dueño del token. Es también la comprobación de la sesión guardada:
 * si el token caducó o es falso, el servidor responde 401 y App lo descarta.
 */
export function getCurrentUser(token) {
  return request('/users/me', { token });
}

// --- Tarjetas ---

/**
 * La API llama "pista" a lo que la interfaz llama "tarjeta", y guarda el
 * artista y el álbum en campos propios. Estas dos funciones son la frontera
 * entre ambos vocabularios: fuera de aquí, la aplicación solo maneja tarjetas.
 */
function toTrack(card) {
  const isAlbum = card.type === CARD_TYPES.album;

  const track = {
    trackId: card.id,
    type: card.type,
    title: card.title,
    // En una tarjeta de álbum el artista es el subtítulo; en una de artista,
    // el propio título (ahí el subtítulo son las suscripciones).
    artist: isAlbum ? card.subtitle || card.title : card.title,
    subtitle: card.subtitle,
    description: card.description,
    stats: card.stats,
    // La API de música devuelve alguna canción sin título; JSON.stringify la
    // convertiría en null y el servidor rechazaría la tarjeta entera.
    highlights: card.highlights?.filter(Boolean),
    cover: card.image,
  };

  if (isAlbum) {
    track.album = card.title;
  }

  // Joi rechaza las claves declaradas que llegan como undefined, y `cover`
  // tiene que ser una URL válida: lo que esté vacío no se envía.
  return Object.fromEntries(
    Object.entries(track).filter(([, value]) => value !== undefined && value !== ''),
  );
}

function toCard(track) {
  return {
    // El id de la tarjeta es siempre el de la API de música: así una tarjeta
    // del feed y la misma tarjeta en los resultados de búsqueda se reconocen.
    id: track.trackId,
    // El _id del documento es lo que espera DELETE /tracks/:id.
    savedId: track._id,
    type: track.type,
    title: track.title,
    subtitle: track.subtitle || '',
    image: track.cover || '',
    description: track.description || '',
    stats: track.stats || [],
    highlights: track.highlights || [],
  };
}

export function getSavedCards(token) {
  return request('/tracks', { token }).then((tracks) => tracks.map(toCard));
}

export function saveCard(card, token) {
  return request('/tracks', {
    method: 'POST',
    body: toTrack(card),
    token,
  }).then(toCard);
}

/** `savedId` es el _id que devolvió el servidor, no el id de la API de música. */
export function deleteCard(savedId, token) {
  return request(`/tracks/${savedId}`, { method: 'DELETE', token }).then(
    () => savedId,
  );
}
