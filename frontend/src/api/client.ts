import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // If unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = useAuthStore.getState().refreshToken
        if (!refreshToken) throw new Error('No refresh token')
        
        const response = await axios.post('/api/v1/auth/refresh', {
          refresh_token: refreshToken,
        })
        
        const { access_token, refresh_token } = response.data
        useAuthStore.getState().setTokens(access_token, refresh_token)
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return axios(originalRequest)
      } catch (refreshError) {
        // Refresh failed - logout
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)