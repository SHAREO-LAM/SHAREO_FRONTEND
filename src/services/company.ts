import apiClient from './api'
import type { Company, CreateCompany } from '@/types/company'
import type { CreateUserCompany } from '@/types/userCompany'

// Lister tous les companies
export const getCompanies = async (): Promise<Company[]> => {
  const { data } = await apiClient.get<Company[]>('company')
  return data
}

// Récupérer un company par ID
export const getCompany = async (id: string): Promise<Company> => {
  const { data } = await apiClient.get<Company>(`company/${id}`)
  return data
}

// Créer un company
export const createCompany = async (payload: CreateCompany): Promise<Company> => {
  const { data } = await apiClient.post<Company>('/company', payload)
  return data
}

// Mettre à jour un company
export const updateCompany = async (id: string, payload: Company): Promise<Company> => {
  const { data } = await apiClient.patch<Company>(`/company/${id}`, payload)
  return data
}

// Supprimer un company
export const deleteCompany = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/company/${id}`)
}

// Associer un utilisateur à une compagnie
export const createUserCompany = async (payload: CreateUserCompany): Promise<any> => {
  const { data } = await apiClient.post('/user-company', payload)
  return data
}
