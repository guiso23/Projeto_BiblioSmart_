import { INITIAL_BOOKS_CATALOG } from '../data/initialBooks';

const BOOKS_KEY = 'BV_BOOKS_CATALOG';
const AUTH_KEY = 'BV_USER';
const LOAN_KEY_PREFIX = 'BV_LOANS_';
const USERS_KEY = 'BV_USERS_DB';

const fakeStorage = {};

async function getItem(key) {
  return Promise.resolve(fakeStorage[key] || null);
}

async function setItem(key, value) {
  fakeStorage[key] = value;
  return Promise.resolve();
}

async function removeItem(key) {
  delete fakeStorage[key];
  return Promise.resolve();
}

export async function loadUsersDB() {
  const usersJson = await getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
}

export async function saveUsersDB(users) {
  await setItem(USERS_KEY, JSON.stringify(users));
}

export async function setupAndLoadCatalog() {
  try {
    let booksJson = await getItem(BOOKS_KEY);
    if (booksJson === null) {
      await setItem(BOOKS_KEY, JSON.stringify(INITIAL_BOOKS_CATALOG));
      return INITIAL_BOOKS_CATALOG;
    } else {
      return JSON.parse(booksJson);
    }
  } catch (error) {
    return INITIAL_BOOKS_CATALOG;
  }
}

export async function saveCatalog(books) {
  await setItem(BOOKS_KEY, JSON.stringify(books));
}

export async function loadUserLoanData(userEmail) {
  const defaultData = { carrinho: [], emprestimos: [] };
  const dataJson = await getItem(LOAN_KEY_PREFIX + userEmail);
  return dataJson ? JSON.parse(dataJson) : defaultData;
}

export async function saveUserLoanData(userEmail, data) {
  await setItem(LOAN_KEY_PREFIX + userEmail, JSON.stringify(data));
}

export async function saveUser(user) {
  await setItem(AUTH_KEY, JSON.stringify(user));
}

export async function loadUser() {
  const s = await getItem(AUTH_KEY);
  return s ? JSON.parse(s) : null;
}

export async function clearUser() {
  await removeItem(AUTH_KEY);
}
