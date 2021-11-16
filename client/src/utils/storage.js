function parse(data) {
  return data ? JSON.parse(data) : {};
}

export function getLocal(name) {
  if (!name) return {};
  return parse(localStorage.getItem(name));
}

export function saveLocal(name, value) {
  if (!name || !value) return {};
  localStorage.setItem(name, JSON.stringify(value));
  return getLocal(name);
}

export function removeLocal(name) {
  if (!name) return {};
  localStorage.removeItem(name);
  return {};
}
