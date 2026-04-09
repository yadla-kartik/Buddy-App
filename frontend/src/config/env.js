const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const rawApiUrl = import.meta.env.VITE_API_URL?.trim();

export const API_BASE_URL = trimTrailingSlash(
  rawApiUrl || "http://localhost:5000/api"
);

