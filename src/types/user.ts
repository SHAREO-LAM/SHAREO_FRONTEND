// src/types/user.ts
import type { components } from '@/api-types';

// DTO principal (réponse = DTO update)
export type User = components['schemas']['UpdateUserDto'];

// DTO création
export type CreateUser = components['schemas']['CreateUserDto'];
