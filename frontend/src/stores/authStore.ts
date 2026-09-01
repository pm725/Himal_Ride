import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  full_name: string
  role: string
  is_active: boolean
  is_verified: boolean
  created_at: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  setUser: (user: User) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  setLoading: (isLoading: boolean) => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: true 
        })
      },

      setTokens: (accessToken, refreshToken) => {
        set({ 
          accessToken, 
          refreshToken,
          isAuthenticated: true 
        })
      },

      login: (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        })
        // Clear any stored data
        localStorage.removeItem('himal-ride-auth')
      },

      setLoading: (isLoading) => {
        set({ isLoading })
      },

      hydrate: () => {
        // Force rehydration from storage
        const stored = localStorage.getItem('himal-ride-auth')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            const state = parsed.state
            if (state?.accessToken && state?.user) {
              set({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: true,
              })
            }
          } catch (e) {
            console.error('Failed to hydrate auth state:', e)
          }
        }
      },
    }),
    {
      name: 'himal-ride-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)