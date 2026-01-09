// src/types/user-company.ts
import type { components } from '@/api-types';

// DTO principal (réponse = DTO update)
export type UserCompany = components['schemas']['UpdateUserCompanyDto'];

// DTO création
export type CreateUserCompany = components['schemas']['CreateUserCompanyDto'];
