// src/services/api.ts
import axios from 'axios'
import { API } from '../constants/const'
import { getAuthToken } from './auth'

const apiClient = axios.create({
  baseURL: API.BASE_URL,
  timeout: API.TIMEOUT_MS,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      globalThis.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    return Promise.reject(error)
  },
)

export default apiClient
