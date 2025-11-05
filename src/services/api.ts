// src/services/api.ts
import axios from 'axios'
import { API } from '../constants/const'

const apiClient = axios.create({
  baseURL: API.BASE_URL,
  timeout: API.TIMEOUT_MS,
})

export default apiClient
