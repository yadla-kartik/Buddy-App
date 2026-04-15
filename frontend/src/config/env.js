const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const rawApiUrl = import.meta.env.VITE_API_URL?.trim();
const rawSocketUrl = import.meta.env.VITE_SOCKET_URL?.trim();

export const API_BASE_URL = trimTrailingSlash(
  rawApiUrl || "http://localhost:5000/api"
);

const inferredSocketUrl = API_BASE_URL.replace(/\/api$/, "");

export const SOCKET_BASE_URL = trimTrailingSlash(
  rawSocketUrl || inferredSocketUrl
);
