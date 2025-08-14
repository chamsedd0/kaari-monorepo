// Bridge auth actions to Zustand store to keep parity with server responses
import { login as apiLogin, logout as apiLogout, LoginInput, LoginResult } from './actions';
import { useAuthStore } from '../store/auth';

export async function login(input: LoginInput): Promise<LoginResult> {
  const res = await apiLogin(input);
  useAuthStore.getState().setSession({ token: res.token, userId: res.userId });
  return res;
}

export async function logout(): Promise<{ ok: true }> {
  const res = await apiLogout();
  useAuthStore.getState().clearSession();
  return res;
}


