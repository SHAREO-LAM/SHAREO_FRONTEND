// src/types/user.ts
import type { components } from '@/api-types';

// DTO principal (réponse = DTO update)
export type CompanyPayout = components['schemas']['UpdateCompanyDto'];

// DTO création
export type CreateCompany = components['schemas']['CreateCompanyDto'];
