import apiClient from './api'
import type { UpdateDomainDto, CreateDomain, Domain } from '@/types/domain'

// Lister tous les domains
export const getDomains = async (): Promise<Domain[]> => {
  const { data } = await apiClient.get<Domain[]>('domain')
  return data
}

export const getDomainsByCompanyId = async (companyId: string): Promise<Domain[]> => {
  const { data } = await apiClient.get<Domain[]>(`domain/company/${companyId}`);
  return data;
}

// Récupérer un domain par ID
export const getDomain = async (id: string): Promise<Domain> => {
  const { data } = await apiClient.get<Domain>(`domain/${id}`)
  return data
}

// Créer un domain
export const createDomain = async (payload: CreateDomain): Promise<Domain> => {
  const { data } = await apiClient.post<Domain>('/domain', payload)
  return data
}

// Mettre à jour un domain
export const updateDomain = async (id: string, payload: UpdateDomainDto): Promise<UpdateDomainDto> => {
  const { data } = await apiClient.patch<UpdateDomainDto>(`/domain/${id}`, payload)
  return data
}

// Supprimer un domain
export const deleteDomain = async (id: string): Promise<void> => {
  await apiClient.delete(`/domain/${id}`)
}

export const uploadDomainImage = async (id: string, file: File): Promise<Domain> => {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await apiClient.post<Domain>(`/domain/${id}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return data
}

export const deleteDomainImage = async (id: string, index = 0): Promise<Domain> => {
  const { data } = await apiClient.delete<Domain>(`/domain/${id}/image`, {
    params: { index },
  })
  return data
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
