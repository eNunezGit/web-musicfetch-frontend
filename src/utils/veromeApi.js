/**
 * Cliente de la Verome API (API third-party).
 * Solo se usa la API Fetch nativa: aquí no hay librerías externas.
 * Este archivo únicamente construye y normaliza peticiones; quien las dispara
 * y captura los errores es el componente App.
 */

import {
  CARD_TYPES,
  MAX_DESCRIPTION_LENGTH,
  SEARCH_FILTERS,
  THUMBNAIL_SIZE,
  VEROME_BASE_URL,
} from './constants';

/** Sufijo de tamaño de las imágenes de Google: "=w60-h60-p-l90-rj". */
const GOOGLE_THUMBNAIL_SIZE = /=w\d+-h\d+(?=-|$)/;

/** El primer then() de cada cadena: valida la respuesta y devuelve res.json. */
function checkResponse(res) {
  if (!res.ok) {
    return Promise.reject(new Error(`Error ${res.status}: ${res.statusText}`));
  }
  return res.json();
}

/** La API responde 200 con { success: false } cuando no encuentra la entidad. */
function checkPayload(data) {
  if (data && data.success === false) {
    return Promise.reject(new Error(data.error || 'Resource not found'));
  }
  return data;
}

function request(path, params = {}) {
  const url = new URL(path, VEROME_BASE_URL);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return fetch(url).then(checkResponse).then(checkPayload);
}

/**
 * Pide la imagen al tamaño que realmente usa la tarjeta.
 * Google acepta el tamaño en la propia URL, así que evitamos tanto las
 * miniaturas de 60 px (que se verían borrosas) como los banners de casi
 * un megabyte, y el recorte cuadrado lo hace el servidor.
 */
function resizeImage(url) {
  if (typeof url !== 'string' || !GOOGLE_THUMBNAIL_SIZE.test(url)) {
    return url || '';
  }

  return url.replace(
    GOOGLE_THUMBNAIL_SIZE,
    `=w${THUMBNAIL_SIZE}-h${THUMBNAIL_SIZE}`,
  );
}

function truncate(text) {
  if (typeof text !== 'string' || text.length <= MAX_DESCRIPTION_LENGTH) {
    return text || '';
  }
  return `${text.slice(0, MAX_DESCRIPTION_LENGTH).trimEnd()}…`;
}

/**
 * Convierte un resultado crudo de /api/search en la tarjeta que renderiza la app.
 * Descartamos lo que no tenga browseId porque sin él no podemos pedir el detalle.
 */
function toCard(item, filter, query) {
  if (!item || !item.browseId || !item.title) {
    return null;
  }

  const type = filter === 'artists' ? CARD_TYPES.artist : CARD_TYPES.album;

  return {
    id: item.browseId,
    type,
    title: item.title,
    // El álbum muestra a su artista; el artista muestra su etiqueta de tipo.
    subtitle: type === CARD_TYPES.album ? item.artists?.[0]?.name || '' : '',
    image: resizeImage(item.thumbnails?.[0]?.url),
    query,
  };
}

/** Alterna artistas y álbumes para que la primera tanda de 3 mezcle ambos tipos. */
function interleave(groups) {
  const merged = [];
  const longest = Math.max(...groups.map((group) => group.length), 0);

  for (let index = 0; index < longest; index += 1) {
    groups.forEach((group) => {
      if (group[index]) {
        merged.push(group[index]);
      }
    });
  }

  return merged;
}

/** Busca artistas y álbumes a la vez y devuelve una lista única de tarjetas. */
export function searchMusic(query) {
  const trimmedQuery = query.trim();

  return Promise.all(
    SEARCH_FILTERS.map((filter) =>
      request('/api/search', { q: trimmedQuery, filter }).then((data) =>
        (data.results || [])
          .map((item) => toCard(item, filter, trimmedQuery))
          .filter(Boolean),
      ),
    ),
  ).then(interleave);
}

function toArtistCard(data, card) {
  const { artist } = data;

  return {
    ...card,
    title: artist.name || card.title,
    subtitle: artist.subscribers ? `${artist.subscribers} subscribers` : '',
    image: resizeImage(artist.thumbnail) || card.image,
    description: truncate(artist.description),
    stats: [
      { label: 'Albums', value: data.albums?.length ?? 0 },
      { label: 'Singles', value: data.singles?.length ?? 0 },
      { label: 'Top songs', value: data.topSongs?.length ?? 0 },
    ],
    highlights: (data.topSongs || []).slice(0, 3).map((song) => song.title),
  };
}

function toAlbumCard(data, card) {
  const { album, artist } = data;

  return {
    ...card,
    title: album.title || card.title,
    subtitle: artist?.name || card.subtitle,
    image: resizeImage(album.thumbnail) || card.image,
    description: '',
    stats: [
      { label: 'Year', value: album.year || '—' },
      { label: 'Tracks', value: album.trackCount ?? data.tracks?.length ?? 0 },
    ],
    highlights: (data.tracks || []).slice(0, 3).map((track) => track.title),
  };
}

/**
 * Enriquece una tarjeta de resultado con los datos completos de la entidad.
 * Es lo que convierte un resultado de búsqueda en la tarjeta del feed.
 */
export function getCardDetails(card) {
  const isArtist = card.type === CARD_TYPES.artist;
  const path = isArtist ? `/api/artists/${card.id}` : `/api/albums/${card.id}`;

  return request(path).then((data) =>
    isArtist ? toArtistCard(data, card) : toAlbumCard(data, card),
  );
}
