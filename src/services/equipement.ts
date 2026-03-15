// src/services/equipement.ts
import type { EquipementType } from '@/types/equipementType';
import apiClient from './api'


// Récupérer tous les types d'équipements
export const fetchEquipementTypes = async (): Promise<EquipementType[]> => {
    const response = await apiClient.get('/equipement-type');
    return response.data;
}