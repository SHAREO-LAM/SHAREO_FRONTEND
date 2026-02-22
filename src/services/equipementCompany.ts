// src/services/equipementCompany.ts
import apiClient from './api'
import type { EquipementCompany, CreateEquipementCompany, EquipementCompanyRead } from '@/types/equipementCompany'

// Lister tous les équipements
export const getEquipementsCompany = async (): Promise<EquipementCompany[]> => {
  const { data } = await apiClient.get<EquipementCompany[]>('equipement-company')
  return data
}

// Récupérer un équipement par ID
export const getEquipementCompany = async (id: string): Promise<EquipementCompanyRead> => {
  const { data } = await apiClient.get<EquipementCompanyRead>(`equipement-company/${id}`)
  return data
}

// Créer un équipement
export const createEquipementCompany = async (payload: CreateEquipementCompany): Promise<EquipementCompany> => {
  const { data } = await apiClient.post<EquipementCompany>('/equipement-company', payload)
  return data
}

// Mettre à jour un équipement
export const updateEquipementCompany = async (id: string, payload: EquipementCompany): Promise<EquipementCompany> => {
  const { data } = await apiClient.patch<EquipementCompany>(`/equipement-company/${id}`, payload)
  return data
}

// Supprimer un équipement
export const deleteEquipementCompany = async (id: string): Promise<void> => {
  await apiClient.delete(`/equipement-company/${id}`)
}

export const getUnavailableDatesEquipement = async (id: string): Promise<{ disabledDates: string[] }> => {
  const { data } = await apiClient.get<{ disabledDates: string[] }>(`/equipement-company/${id}/unavailable-dates`);
  return data;
}


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
