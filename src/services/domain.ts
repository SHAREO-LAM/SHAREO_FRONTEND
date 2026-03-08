import apiClient from './api'
import type { UpdateDomainDto, CreateDomain } from '@/types/domain'

// Lister tous les domains
export const getDomains = async (): Promise<UpdateDomainDto[]> => {
  console.log('Fetching domains...') // Log pour indiquer que la requête est en cours
  const { data } = await apiClient.get<UpdateDomainDto[]>('domain')
  console.log('Fetched domains:', data) // Log pour vérifier les données reçues
  return data
}

// Récupérer un domain par ID
export const getDomain = async (id: string): Promise<UpdateDomainDto> => {
  const { data } = await apiClient.get<UpdateDomainDto>(`domain/${id}`)
  return data
}

// Créer un domain
export const createDomain = async (payload: CreateDomain): Promise<UpdateDomainDto> => {
  const { data } = await apiClient.post<UpdateDomainDto>('/domain', payload)
  return data
}

// Mettre à jour un domain
export const updateDomain = async (id: string, payload: UpdateDomainDto): Promise<UpdateDomainDto> => {
  const { data } = await apiClient.patch<UpdateDomainDto>(`/domain/${id}`, payload)
  return data
}

// Supprimer un domain
export const deleteDomain = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/domain/${id}`)
}

export const getUnavailableDates = async (id: string): Promise<{ disabledDates: string[] }> => {
  const { data } = await apiClient.get<{ disabledDates: string[] }>(`/domain/${id}/unavailable-dates`);
  return data;
}

export const checkDomainAvailability = async (
  id: string,
  startDate: string,
  endDate: string
): Promise<boolean> => {
  const { data } = await apiClient.get<{ available: boolean }>(
    `/domain/${id}/check-availability`,
    {
      params: { startDate, endDate },
    }
  );

  return data.available;
};
