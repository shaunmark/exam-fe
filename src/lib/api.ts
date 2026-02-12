import { ApiError } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
    ...rest,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new ApiError(res.status, res.statusText, errorBody);
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}
