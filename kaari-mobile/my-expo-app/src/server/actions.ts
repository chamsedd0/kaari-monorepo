// Typed server actions layer mirroring the web app. Implementations will be filled to match web logic.
// Keep function names and shapes consistent with the web for drop-in parity.

import { request } from '../lib/http';

// Auth
export type LoginInput = { email: string; password: string };
export type LoginResult = { userId: string; token: string };
export async function login(input: LoginInput): Promise<LoginResult> {
  return request<LoginResult>('/api/auth/login', { method: 'POST', body: JSON.stringify(input) });
}

export async function logout(): Promise<{ ok: true }> {
  return request<{ ok: true }>('/api/auth/logout', { method: 'POST' });
}

// Example: fetch profile
export type Profile = { id: string; fullName: string; email: string };
export async function getProfile(): Promise<Profile> {
  return request<Profile>('/api/me', { method: 'GET' });
}

// Example: reservation list (tenant)
export type Reservation = { id: string; status: string; createdAt: string };
export async function listReservations(params: { page?: number; pageSize?: number }) {
  return request<{ items: Reservation[]; total: number }>('/api/reservations', { method: 'GET', query: params });
}


