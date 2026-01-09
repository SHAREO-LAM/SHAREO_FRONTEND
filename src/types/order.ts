// src/types/orders.ts
import type { components } from '@/api-types';

// DTO principal (réponse = DTO update)
export type Order = components['schemas']['UpdateOrderDto'];

// DTO création
export type CreateOrder = components['schemas']['CreateOrderDto'];
