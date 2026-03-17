// src/types/domain.ts
import type { components } from '@/api-types';

export type Domain = components['schemas']['Domain'] & {
	imageUrls?: string[] | null;
};

// DTO principal (réponse = DTO update)
export type UpdateDomainDto = components['schemas']['UpdateDomainDto'];

// DTO création
export type CreateDomain = components['schemas']['CreateDomainDto'];
