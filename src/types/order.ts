import type { components } from '@/api-types';

// DTO principal (réponse = DTO update)
export type UpdateOrderDto = components['schemas']['UpdateOrderDto'];

// DTO création
export type CreateOrder = components['schemas']['CreateOrderDto'];

// Nouveau DTO pour récupérer les commandes d'une entreprise
export type OrderItem= components['schemas']['OrderItem'];
export type Order = components['schemas']['Order'];

// Type pour la réponse du backend
export type OrdersByCompanyResponse = Order[];