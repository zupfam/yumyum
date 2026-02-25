// Data Caching Time-To-Live (TTL) values in milliseconds
// As specified in Story 1.2

// Brand data: 10 minutes
export const BRAND_TTL = 10 * 60 * 1000;

// Dishes data: 5 minutes
export const DISHES_TTL = 5 * 60 * 1000;

// Status data: 2 minutes
export const STATUS_TTL = 2 * 60 * 1000;

export const WHATSAPP_NUMBER = '918310428923'; // Replace with the actual number
export const WHATSAPP_INTEREST_MESSAGE =
  "I'm interested in *YumYum* menu for my food business, let's connect!\n\n_https://yumyum.zupfam.com_";

export const ADMIN_ROLE = 'admin';
export const NO_ROWS_FOUND_ERROR_CODE = 'PGRST116';
export const WHATSAPP_FEEDBACK_MESSAGE = 'Feedback for YumYum';

// Assets
export const DEFAULT_BRAND_LOGO = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200&h=200';
export const DEFAULT_DISH_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400';

// API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6787/api/v1';
export const DEFAULT_COUNTRY_CODE = '+91';

// Roles
export const ROLE_SUPERADMIN = 'superadmin';
export const ROLE_VENDOR = 'vendor';
