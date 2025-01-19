import create from 'zustand';

interface AuthGoogleStore {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthGoogleStore = create<AuthGoogleStore>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  clearToken: () => set({ token: null }),
}));
