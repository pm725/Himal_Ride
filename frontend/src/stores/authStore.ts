import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '../api/client'

export interface User {
  id: string
  full_name: string
  email: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean

  login: (email: string, password: string) => Promise<void>
  register: (data: { full_name: string; email: string; password: string }) => Promise<void>
  logout: () => void
  setToken: (token: string) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,

      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const response = await apiClient.post('/api/v1/auth/login', { email, password })
          const { access_token, refresh_token } = response.data

          const userRes = await apiClient.get('/api/v1/users/me', {
            headers: { Authorization: `Bearer ${access_token}` },
          })

          set({
            user: userRes.data,
            token: access_token,
            refreshToken: refresh_token,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data) => {
        set({ isLoading: true })
        try {
          await apiClient.post('/api/v1/auth/register', {
            full_name: data.full_name,
            email: data.email,
            password: data.password,
          })
          // Auto-login after registration
          await get().login(data.email, data.password)
          set({ isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isLoading: false,
        })
        localStorage.removeItem('himal-auth')
      },
    }),
    { name: 'himal-auth' }
  )
)