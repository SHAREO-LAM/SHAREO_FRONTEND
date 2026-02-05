// src/services/auth.ts
import apiClient from './api'
import Cookies from 'js-cookie'

const TOKEN_KEY = 'shareo_access_token'
const TOKEN_EXPIRY_DAYS = 7

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  login: string
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  user?: {
    userId: number
    login: string
    email: string
    isAdmin: boolean
    isSuperAdmin: boolean
  }
}

export interface UserProfile {
  userId: number
  login: string
  email: string
  isAdmin: boolean
  isSuperAdmin: boolean
}

/**
 * Stocke le token JWT de manière sécurisée dans un cookie
 */
export const setAuthToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, {
    expires: TOKEN_EXPIRY_DAYS,
    secure: import.meta.env.PROD, // HTTPS uniquement en production
    sameSite: 'strict',
  })
}

/**
 * Récupère le token JWT stocké
 */
export const getAuthToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY)
}

/**
 * Supprime le token JWT
 */
export const removeAuthToken = (): void => {
  Cookies.remove(TOKEN_KEY)
}

/**
 * Vérifie si l'utilisateur est authentifié (présence du token)
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}

/**
 * Connexion utilisateur
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
  
  if (response.data.access_token) {
    setAuthToken(response.data.access_token)
  }
  
  return response.data
}

/**
 * Inscription utilisateur
 */
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', credentials)
  
  if (response.data.access_token) {
    setAuthToken(response.data.access_token)
  }
  
  return response.data
}

/**
 * Récupération du profil utilisateur
 */
export const getProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>('/auth/profile')
  return response.data
}

/**
 * Déconnexion utilisateur
 */
export const logout = (): void => {
  removeAuthToken()
}
