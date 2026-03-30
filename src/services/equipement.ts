// src/services/equipement.ts
import type { EquipementType } from '@/types/equipementType';
import type { CreateEquipementType } from '@/types/equipementType';
import type { CreateEquipementCategory, EquipementCategory } from '@/types/equipementCategory';
import apiClient from './api'


// Récupérer tous les types d'équipements
export const fetchEquipementTypes = async (): Promise<EquipementType[]> => {
    const response = await apiClient.get('/equipement-type');
    return response.data;
}

export const createEquipementType = async (
    payload: CreateEquipementType,
): Promise<any> => {
    const { data } = await apiClient.post('/equipement-type', payload)
    return data
}

export const fetchEquipementCategories = async (): Promise<EquipementCategory[]> => {
    const response = await apiClient.get('/equipement-category')
    return response.data
}

export const createEquipementCategory = async (
    payload: CreateEquipementCategory,
): Promise<any> => {
    const { data } = await apiClient.post('/equipement-category', payload)
    return data
}


