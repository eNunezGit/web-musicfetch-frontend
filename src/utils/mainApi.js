/**
 * Backend simulado de MusicFetch.
 *
 * Persiste usuarios y tarjetas en localStorage imitando la forma de una base de
 * datos: un registro de usuarios y, aparte, las tarjetas indexadas por usuario.
 * Cada consulta filtra por el usuario del token, así que un usuario solo puede
 * leer y borrar sus propias tarjetas.
 *
 * Todas las funciones devuelven promesas para que, cuando exista el backend
 * real, baste con sustituir el cuerpo por un fetch() sin tocar los componentes.
 *
 * PENDIENTE: sustituir por el servidor real. Las contraseñas se guardan en
 * claro porque esto es una simulación local; el backend debe hashearlas.
 */

import { STORAGE_KEYS } from './constants';

const TOKEN_PREFIX = 'mock.';

function readCollection(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    // Si el almacenamiento tiene datos corruptos, empezamos de cero.
    return {};
  }
}

function writeCollection(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Simula la latencia de red para que el preloader sea visible. */
function resolveLater(value, delay = 400) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), delay);
  });
}

function rejectLater(message, delay = 400) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
}

function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

function userIdFromToken(token) {
  if (typeof token !== 'string' || !token.startsWith(TOKEN_PREFIX)) {
    return '';
  }
  return token.slice(TOKEN_PREFIX.length);
}

export function register({ name, email, password }) {
  const users = readCollection(STORAGE_KEYS.users);
  const normalizedEmail = email.trim().toLowerCase();

  if (users[normalizedEmail]) {
    return rejectLater('An account with that email address already exists');
  }

  const user = {
    id: `u${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
  };

  users[normalizedEmail] = user;
  writeCollection(STORAGE_KEYS.users, users);

  return resolveLater(toPublicUser(user));
}

export function login({ email, password }) {
  const users = readCollection(STORAGE_KEYS.users);
  const user = users[email.trim().toLowerCase()];

  if (!user || user.password !== password) {
    return rejectLater('The email address or the password is incorrect');
  }

  return resolveLater({
    token: `${TOKEN_PREFIX}${user.id}`,
    user: toPublicUser(user),
  });
}

/** Recupera la sesión guardada al recargar la página. */
export function checkToken(token) {
  const userId = userIdFromToken(token);
  const users = readCollection(STORAGE_KEYS.users);
  const user = Object.values(users).find((candidate) => candidate.id === userId);

  if (!user) {
    return rejectLater('Invalid session', 0);
  }

  return resolveLater(toPublicUser(user), 0);
}

export function getSavedCards(token) {
  const userId = userIdFromToken(token);

  if (!userId) {
    return rejectLater('Invalid session', 0);
  }

  const cardsByUser = readCollection(STORAGE_KEYS.cards);

  return resolveLater(cardsByUser[userId] || [], 0);
}

export function saveCard(card, token) {
  const userId = userIdFromToken(token);

  if (!userId) {
    return rejectLater('Invalid session');
  }

  const cardsByUser = readCollection(STORAGE_KEYS.cards);
  const userCards = cardsByUser[userId] || [];

  if (userCards.some((saved) => saved.id === card.id)) {
    return rejectLater('This card is already in your feed');
  }

  const savedCard = { ...card, owner: userId, createdAt: new Date().toISOString() };

  cardsByUser[userId] = [savedCard, ...userCards];
  writeCollection(STORAGE_KEYS.cards, cardsByUser);

  return resolveLater(savedCard);
}

export function deleteCard(cardId, token) {
  const userId = userIdFromToken(token);

  if (!userId) {
    return rejectLater('Invalid session');
  }

  const cardsByUser = readCollection(STORAGE_KEYS.cards);
  const userCards = cardsByUser[userId] || [];

  if (!userCards.some((saved) => saved.id === cardId)) {
    return rejectLater('The card does not exist or does not belong to you');
  }

  cardsByUser[userId] = userCards.filter((saved) => saved.id !== cardId);
  writeCollection(STORAGE_KEYS.cards, cardsByUser);

  return resolveLater(cardId);
}
