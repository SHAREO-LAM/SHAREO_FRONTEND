// src/types/company-payout.ts
import type { components } from '@/api-types';

// DTO principal (réponse = DTO update)
export type CompanyPayout = components['schemas']['UpdateCompanyPayoutDto'];

// DTO création
export type CreateCompanyPayout = components['schemas']['CreateCompanyPayoutDto'];
