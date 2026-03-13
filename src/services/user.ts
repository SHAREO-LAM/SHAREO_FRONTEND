import apiClient from './api'
import type { User, CreateUser } from '@/types/user'

// Lister tous les utilisateurs
export const getUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>('/user')
  return data
}

// Récupérer un utilisateur par ID
export const getUser = async (id: string): Promise<User> => {
  const { data } = await apiClient.get<User>(`/user/${id}`)
  return data
}

// Créer un utilisateur
export const createUser = async (payload: CreateUser): Promise<User> => {
  const { data } = await apiClient.post<User>('/user', payload)
  return data
}

// Mettre à jour un utilisateur
export const updateUser = async (id: string, payload: Partial<User>): Promise<User> => {
  const { data } = await apiClient.patch<User>(`/user/${id}`, payload)
  return data
}

// Supprimer un utilisateur
export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/user/${id}`)
}
