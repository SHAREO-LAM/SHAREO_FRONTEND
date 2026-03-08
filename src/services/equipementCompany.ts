// src/services/equipementCompany.ts
import apiClient from './api'
import type { EquipementCompany, CreateEquipementCompany, EquipementCompanyReadDto } from '@/types/equipementCompany'

export const getEquipementsCompany = async (): Promise<EquipementCompanyReadDto[]> => {
  const { data } = await apiClient.get<EquipementCompanyReadDto[]>('equipement-company')
  return data
}

export const getEquipementCompany = async (id: string): Promise<EquipementCompanyReadDto> => {
  const { data } = await apiClient.get<EquipementCompanyReadDto>(`equipement-company/${id}`)
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
