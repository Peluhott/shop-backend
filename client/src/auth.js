export function getAuthToken() {
  return localStorage.getItem('token');
}

export function getAuthPayload() {
  const token = getAuthToken();
  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split('.');
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function isAdminUser() {
  return Boolean(getAuthPayload()?.is_admin);
}
