// src/types/domain.ts
import type { components } from '@/api-types';

// DTO principal (réponse = DTO update)
export type UpdateDomainDto = components['schemas']['UpdateDomainDto'];

// DTO création
export type CreateDomain = components['schemas']['CreateDomainDto'];
