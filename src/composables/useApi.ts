import { ref, readonly } from 'vue'
import { API_CONFIG } from '@/config/api'

interface ApiResponse<T = unknown> {
  data: T | null
  error: string | null
  loading: boolean
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: unknown
}

export function useApi() {
  const baseURL = ref(API_CONFIG.BASE_URL)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const callApi = async <T = unknown>(
    endpoint: string,
    options: ApiOptions = {},
  ): Promise<ApiResponse<T>> => {
    const { method = 'GET', headers = {}, body } = options

    loading.value = true
    error.value = null

    try {
      const url = `${baseURL.value}${endpoint}`

      const requestOptions: RequestInit = {
        method,
        ...API_CONFIG.CORS,
        headers: {
          ...API_CONFIG.DEFAULT_HEADERS,
          ...headers,
        },
      }

      if (body && method !== 'GET') {
        requestOptions.body = JSON.stringify(body)
      }

      // Add timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)
      requestOptions.signal = controller.signal

      const response = await fetch(url, requestOptions)
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      return {
        data,
        error: null,
        loading: false,
      }
    } catch (err) {
      let errorMessage = 'Something went wrong'

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Request timeout'
        } else {
          errorMessage = err.message
        }
      }

      error.value = errorMessage

      return {
        data: null,
        error: errorMessage,
        loading: false,
      }
    } finally {
      loading.value = false
    }
  }

  const get = <T = unknown>(endpoint: string, headers?: Record<string, string>) => {
    return callApi<T>(endpoint, { method: 'GET', headers })
  }

  const post = <T = unknown>(endpoint: string, body: unknown, headers?: Record<string, string>) => {
    return callApi<T>(endpoint, { method: 'POST', body, headers })
  }

  const put = <T = unknown>(endpoint: string, body: unknown, headers?: Record<string, string>) => {
    return callApi<T>(endpoint, { method: 'PUT', body, headers })
  }

  const del = <T = unknown>(endpoint: string, headers?: Record<string, string>) => {
    return callApi<T>(endpoint, { method: 'DELETE', headers })
  }

  const patch = <T = unknown>(
    endpoint: string,
    body: unknown,
    headers?: Record<string, string>,
  ) => {
    return callApi<T>(endpoint, { method: 'PATCH', body, headers })
  }

  const clearError = () => {
    error.value = null
  }

  const setBaseURL = (url: string) => {
    baseURL.value = url
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    baseURL: readonly(baseURL),

    callApi,
    get,
    post,
    put,
    del,
    patch,
    clearError,
    setBaseURL,
  }
}
