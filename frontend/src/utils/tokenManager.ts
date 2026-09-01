import { useAuthStore } from '../stores/authStore'

export function getAuthToken(): string | null {
  return useAuthStore.getState().accessToken
}

export function getRefreshToken(): string | null {
  return useAuthStore.getState().refreshToken
}

export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

export function getCurrentUser() {
  return useAuthStore.getState().user
}

export function logout() {
  useAuthStore.getState().logout()
  window.location.href = '/login'
}