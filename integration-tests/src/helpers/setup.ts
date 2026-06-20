import { signIn } from "./auth.js";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:38001";

let cachedToken: string | undefined;

export async function getAuthToken(): Promise<string> {
  if (!cachedToken) {
    const { token } = await signIn();
    cachedToken = token;
  }
  return cachedToken;
}

export function authedHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  } as const;
}

export async function api(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const doFetch = (t: string) =>
    fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        ...authedHeaders(t),
        ...(options.headers ?? {}),
      },
    });

  let token = await getAuthToken();
  let res = await doFetch(token);
  if (res.status === 401) {
    cachedToken = undefined;
    token = await getAuthToken();
    res = await doFetch(token);
  }
  return res;
}

export async function apiJson<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<{ status: number; body: T }> {
  const res = await api(path, options);
  const body = (await res.json()) as T;
  return { status: res.status, body };
}

export interface PaginatedResponse<T = unknown> {
  current_page: number;
  total: number;
  per_page: number;
  data: T[];
}

export async function apiPaginated<T = unknown>(
  path: string,
): Promise<PaginatedResponse<T>> {
  const { body } = await apiJson<PaginatedResponse<T>>(path);
  return body;
}

export async function apiArray<T = unknown>(path: string): Promise<T[]> {
  const { body } = await apiJson<T[]>(path);
  return body;
}
