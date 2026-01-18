// src/types/equipement-company.ts
import type { components } from '@/api-types';

// DTO principal (réponse = DTO update)
export type EquipementCompany = components['schemas']['UpdateEquipementCompanyDto'];

// Pour la lecture --> Info sur le type récupés en plus
export type EquipementCompanyRead = components['schemas']['EquipementCompanyReadDto'];

// DTO création
export type CreateEquipementCompany = components['schemas']['CreateEquipementCompanyDto'];
