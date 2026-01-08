// src/types/payout-status.ts
import type { components } from '@/api-types';

// DTO principal (réponse = DTO update)
export type PayoutStatus = components['schemas']['UpdatePayoutStatusDto'];

// DTO création
export type CreatePayoutStatus = components['schemas']['CreatePayoutStatusDto'];
