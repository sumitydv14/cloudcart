export const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SELLER: 'seller',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
