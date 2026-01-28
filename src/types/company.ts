// src/types/company-payout.ts
import type { components } from '@/api-types';

// DTO principal (réponse = DTO update)
export type Company = components['schemas']['UpdateCompanyDto'];

// DTO création
export type CreateCompany = components['schemas']['CreateCompanyDto'];
