// src/types/equipement-category.ts
import type { components } from '@/api-types';

// DTO principal (réponse = DTO update)
export type EquipementCategory = components['schemas']['UpdateEquipementCategoryDto'];

// DTO création
export type CreateEquipementCategory = components['schemas']['CreateEquipementCategoryDto'];
