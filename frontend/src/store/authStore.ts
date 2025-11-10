import { create } from 'zustand';

type User = { id: number; name: string; email: string } | null;

type AuthState = {
  user: User;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    console.log('💾 setAuth called:', { user, token: token?.substring(0, 20) + '...' });
    localStorage.setItem('flow_token', token);
    localStorage.setItem('flow_user', JSON.stringify(user));
    set({ user, token });
    console.log('✅ setAuth: store updated');
  },
  clearAuth: () => {
    console.log('🗑️ clearAuth called');
    localStorage.removeItem('flow_token');
    localStorage.removeItem('flow_user');
    set({ user: null, token: null });
    console.log('✅ clearAuth: store cleared');
  },
}));

export function getToken() {
  return localStorage.getItem('flow_token');
}
