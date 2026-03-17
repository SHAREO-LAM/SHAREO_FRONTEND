// src/types/equipement-company.ts
import type { components } from '@/api-types';




// DTO principal (réponse = DTO update
export type UpdateEquipementCompanyDto = components['schemas']['UpdateEquipementCompanyDto'];

// Pour la lecture --> Info sur le type récupés en plus
export type EquipementCompanyReadDto = components['schemas']['EquipementCompanyReadDto'] & {
	imageUrl?: string | null;
	imageUrls?: string[] | null;
};

// Backward-compatible alias used in admin views.
export type EquipementCompany = EquipementCompanyReadDto;

// DTO création
export type CreateEquipementCompany = components['schemas']['CreateEquipementCompanyDto'];
