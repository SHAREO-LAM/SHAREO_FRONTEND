// src/services/equipementCompany.ts
import apiClient from './api'
import type { EquipementCompany, CreateEquipementCompany, EquipementCompanyRead } from '@/types/equipementCompany'

export const getEquipementsCompany = async (): Promise<EquipementCompany[]> => {
  const { data } = await apiClient.get<EquipementCompany[]>('equipement-company')
  console.log('EquipementsCompany:', data) 
  return data
}

export const getEquipementCompany = async (id: string): Promise<EquipementCompanyRead> => {
  const { data } = await apiClient.get<EquipementCompanyRead>(`equipement-company/${id}`)
  return data
}

export const createEquipementCompany = async (payload: CreateEquipementCompany): Promise<EquipementCompany> => {
  const { data } = await apiClient.post<EquipementCompany>('equipement-company', payload)
  return data
}

export const updateEquipementCompany = async (
  id: string,
  payload: Partial<CreateEquipementCompany>
): Promise<EquipementCompany> => {
  const { data } = await apiClient.patch<EquipementCompany>(`equipement-company/${id}`, payload)
  return data
}

export const deleteEquipementCompany = async (id: string): Promise<void> => {
  await apiClient.delete(`equipement-company/${id}`)
}