// src/types/equipement-types.ts
import type { components } from '@/api-types';

// DTO création
export type CreateEquipementType = components['schemas']['CreateEquipementTypeDto'];

// DTO lecture (l'OpenAPI expose un schéma incomplet, on le complète ici)
export type EquipementType = components['schemas']['UpdateEquipementTypeDto'];