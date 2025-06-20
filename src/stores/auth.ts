import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'

interface User {
  phone: string
  name?: string
}

interface LoginCredentials {
  phone: string
}

interface LoginResponse {
  success: boolean
  message: string
}

interface ApiLoginResponse {
  message: string
}

interface ApiVerifyResponse {
  token: string
}

export const useAuthStore = defineStore('auth', () => {
  const { post, get, loading, error } = useApi()

  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = ref(false)

  const isLoggedIn = computed(() => isAuthenticated.value && !!token.value)

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await post<ApiLoginResponse>('/login', credentials)

    if (response.error) {
      return {
        success: false,
        message: response.error,
      }
    }

    if (response.data) {
      return {
        success: true,
        message: response.data.message,
      }
    }

    return { success: false, message: 'Something went wrong' }
  }

  const verifyCode = async (phone: string, code: string): Promise<LoginResponse> => {
    const response = await post<ApiVerifyResponse>('/login/verify', { phone, code })

    if (response.error) {
      return {
        success: false,
        message: response.error,
      }
    }

    if (response.data) {
      token.value = response.data.token
      isAuthenticated.value = true

      localStorage.setItem('token', response.data.token)

      return {
        success: true,
        message: 'Login successful!',
      }
    }

    return { success: false, message: 'Something went wrong' }
  }

  const logout = async () => {
    try {
      await post('/logout', {})
    } catch (err) {
      console.error('Logout error:', err)
    }

    user.value = null
    token.value = null
    isAuthenticated.value = false

    localStorage.removeItem('token')
  }

  const checkAuth = async () => {
    try {
      const response = await get<{ data: User }>('/me', {
        Authorization: `Bearer ${token.value}`,
      })

      if (response.data?.data) {
        user.value = response.data.data
        isAuthenticated.value = true
        return true
      }
    } catch (err) {
      console.error('Error checking auth: ', err)
      await logout()
      return false
    }

    return false
  }

  const initializeAuth = () => {
    const savedToken = localStorage.getItem('token')

    if (savedToken) {
      token.value = savedToken
      isAuthenticated.value = true
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,

    isLoggedIn,

    login,
    verifyCode,
    logout,
    checkAuth,
    initializeAuth,
  }
})
