import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  full_name: string
  role: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  setUser: (user: User) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  logout: () => void
  setLoading: (isLoading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      
      setUser: (user) => set({ user, isAuthenticated: true }),
      
      setTokens: (accessToken, refreshToken) => 
        set({ accessToken, refreshToken }),
      
      logout: () => 
        set({ 
          user: null, 
          accessToken: null, 
          refreshToken: null, 
          isAuthenticated: false 
        }),
      
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'himal-ride-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)