// src/types/equipement-types.ts
import type { components } from '@/api-types';

// DTO principal (réponse = DTO update)
export type EquipementType = components['schemas']['UpdateEquipementTypeDto'];

// DTO création
export type CreateEquipementType = components['schemas']['CreateEquipementTypeDto'];
