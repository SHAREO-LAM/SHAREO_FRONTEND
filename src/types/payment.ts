// src/types/payment.ts
import type { components } from '@/api-types';

// DTO principal (réponse = DTO update)
export type Payment = components['schemas']['UpdatePaymentDto'];

// DTO création
export type CreatePayment = components['schemas']['CreatePaymentDto'];
