// src/types/user-informations.ts
import type { components } from '@/api-types';

// DTO principal (réponse = DTO update)
export type UserInformations = components['schemas']['UpdateUserInformationsDto'];

// DTO création
export type CreateUserInformations = components['schemas']['CreateUserInformationsDto'];
