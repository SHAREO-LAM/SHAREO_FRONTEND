/**
 * Constantes globales pour l'application
 * Utilisation : import { APP, API, ROUTES, STORAGE_KEYS, REGEX, ROLES } from '@/constants/globals'
 */

export const APP = {
    NAME: import.meta.env.VITE_APP_NAME ?? 'Shareo',
    VERSION: import.meta.env.VITE_APP_VERSION ?? '0.0.0',
    SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL ?? 'support@shareo.app',
    DEFAULT_LOCALE: 'fr',
} as const;

export const API = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'https://api.monapp.com',
    TIMEOUT_MS: Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 5000),
    // Regrouper endpoints ici pour éviter les strings dispersées
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            LOGOUT: '/auth/logout',
            REFRESH: '/auth/refresh',
            PROFILE: '/auth/me',
        },
    },
} as const;

export const ROUTES = {
    HOME: { name: 'home', path: '/' },
    LOGIN: { name: 'login', path: '/login' },
    REGISTER: { name: 'register', path: '/register' },
    DASHBOARD: { name: 'dashboard', path: '/dashboard' },
    PROFILE: { name: 'profile', path: '/profile' },
    NOT_FOUND: { name: 'not-found', path: '/:pathMatch(.*)*' },
} as const;


export enum ROLES {
    ADMIN = 'admin',
    USER = 'user',
    GUEST = 'guest',
}

export const PERMISSIONS = {
    CAN_EDIT_USERS: [ROLES.ADMIN],
    CAN_VIEW_DASHBOARD: [ROLES.ADMIN, ROLES.USER],
} as const;

export const DATE_FORMATS = {
    FULL: 'YYYY-MM-DD HH:mm:ss',
    DATE: 'YYYY-MM-DD',
    FR: 'DD/MM/YYYY',
} as const;

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_PER_PAGE: 20,
    MAX_PER_PAGE: 100,
} as const;

export const UI = {
    DEFAULT_AVATAR: '/images/avatar-default.png',
    MAX_UPLOAD_SIZE_BYTES: 5 * 1024 * 1024, // 5 MB
    ALLOWED_IMAGE_TYPES: ['image/png', 'image/jpeg', 'image/webp'] as const,
} as const;

export const VALIDATION = {
    PASSWORD_MIN_LENGTH: 8,
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 30,
} as const;

export const ERRORS = {
    NETWORK: 'Une erreur réseau est survenue. Veuillez réessayer.',
    UNAUTHORIZED: 'Non autorisé. Veuillez vous reconnecter.',
    NOT_FOUND: 'Ressource introuvable.',
    DEFAULT: 'Une erreur est survenue. Veuillez réessayer plus tard.',
} as const;


