// src/types/order-status.ts
import type { components } from '@/api-types';

// DTO principal (réponse = DTO update)
export type OrderStatus = components['schemas']['UpdateOrderStatusDto'];

// DTO création
export type CreateOrderStatus = components['schemas']['CreateOrderStatusDto'];
