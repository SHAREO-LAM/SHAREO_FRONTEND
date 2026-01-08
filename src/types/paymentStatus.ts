// src/types/payment-status.ts
import type { components } from '@/api-types';

// DTO principal (réponse = DTO update)
export type PaymentStatus = components['schemas']['UpdatePaymentStatusDto'];

// DTO création
export type CreatePaymentStatus = components['schemas']['CreatePaymentStatusDto'];
