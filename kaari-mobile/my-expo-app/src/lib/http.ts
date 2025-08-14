import { env } from '../config/env';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class HttpError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function request<T>(path: string, options?: RequestInit & { query?: Record<string, any> }): Promise<T> {
  const url = new URL(path, env.apiBaseUrl);
  if (options?.query) {
    Object.entries(options.query).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      url.searchParams.append(k, String(v));
    });
  }
  const res = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : undefined;
  if (!res.ok) throw new HttpError('HTTP error', res.status, json);
  return json as T;
}


