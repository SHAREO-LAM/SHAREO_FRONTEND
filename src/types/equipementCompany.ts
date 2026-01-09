// src/types/equipement-company.ts
import type { components } from '@/api-types';

// DTO principal (réponse = DTO update)
export type EquipementCompany = components['schemas']['UpdateEquipementCompanyDto'];

// DTO création
export type CreateEquipementCompany = components['schemas']['CreateEquipementCompanyDto'];
