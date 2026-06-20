import createClient from "openapi-fetch";
import type { paths } from "../types/api.js";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:38001";

export function createApiClient(token?: string) {
  return createClient<paths>({
    baseUrl: BASE_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function createUnauthenticatedClient() {
  return createClient<paths>({ baseUrl: BASE_URL });
}
