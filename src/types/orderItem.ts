// src/types/order-item.ts
import type { components } from '@/api-types';

// DTO principal (réponse = DTO update)
export type OrderItem = components['schemas']['UpdateOrderItemDto'];

// DTO création
export type CreateOrderItem = components['schemas']['CreateOrderItemDto'];
