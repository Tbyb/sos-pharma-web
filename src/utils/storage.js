const APP_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/api.*$/, '');

export function getStorageUrl(path) {
  if (!path) return null;
  return `${APP_BASE_URL}/storage/${path}`;
}
