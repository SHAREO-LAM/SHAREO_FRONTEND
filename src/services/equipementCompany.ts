// src/services/equipementCompany.ts
import type { CreateEquipementCompany, EquipementCompanyReadDto } from '@/types/equipementCompany'
import apiClient from './api'

// Récupérer tous les équipements
export const getEquipementsCompany = async (): Promise<EquipementCompanyReadDto[]> => {
  const { data } = await apiClient.get<EquipementCompanyReadDto[]>('equipement-company')
  return data
}

// Récupérer un équipement par ID
export const getEquipementCompany = async (id: string): Promise<EquipementCompanyReadDto> => {
  const { data } = await apiClient.get<EquipementCompanyReadDto>(`equipement-company/${id}`)
  return data
}

// Créer un équipement
export const createEquipementCompany = async (payload: CreateEquipementCompany): Promise<EquipementCompanyReadDto> => {
  const { data } = await apiClient.post<EquipementCompanyReadDto>('equipement-company', payload)
  return data
}

// Mettre à jour un équipement
export const updateEquipementCompany = async (
  id: string,
  payload: Partial<CreateEquipementCompany>
): Promise<EquipementCompanyReadDto> => {
  const { data } = await apiClient.patch<EquipementCompanyReadDto>(`equipement-company/${id}`, payload)
  return data
}

// Supprimer un équipement
export const deleteEquipementCompany = async (id: string): Promise<void> => {
  await apiClient.delete(`equipement-company/${id}`)
}

// Récupérer les dates indisponibles pour un équipement
export const getUnavailableDatesEquipement = async (id: string): Promise<{ disabledDates: string[] }> => {
  const { data } = await apiClient.get<{ disabledDates: string[] }>(`/equipement-company/${id}/unavailable-dates`);
  return data;
}

// Vérifier la disponibilité d’un équipement
export const checkEquipmentAvailability = async (
  id: string,
  startDate: string,
  endDate: string,
  quantity: number
): Promise<boolean> => {
  const { data } = await apiClient.get<{ available: boolean }>(
    `/equipement-company/${id}/check-availability`,
    {
      params: { startDate, endDate, quantity },
    }
  );

  return data.available;
};