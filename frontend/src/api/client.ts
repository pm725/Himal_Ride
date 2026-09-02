import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

// Use environment variable or fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request interceptor: Attach token ──────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token  // Changed from accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response interceptor: Handle 401 ────────────────────
apiClient.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.status, response.config.url)
    return response
  },
  async (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data)

    if (error.response?.status === 401) {
      const originalRequest = error.config
      if (!originalRequest._retry) {
        originalRequest._retry = true

        try {
          const refreshToken = useAuthStore.getState().refreshToken
          if (!refreshToken) throw new Error('No refresh token')

          const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
            refresh_token: refreshToken,
          })

          const { access_token } = response.data
          useAuthStore.getState().setToken(access_token)  // Changed from setTokens

          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return axios(originalRequest)
        } catch (refreshError) {
          useAuthStore.getState().logout()
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
    }

    return Promise.reject(error)
  }
)