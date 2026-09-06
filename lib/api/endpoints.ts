/**
 * Centralized API endpoint definitions.
 * Versioned under /api/v1 (configured in ApiService baseURL).
 */
export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    me: "/auth/me",
    changePassword: "/auth/change-password",
  },
  patients: "/patients",
  appointments: "/appointments",
  consultations: "/consultations",
  treatments: "/treatments",
  labOrders: "/lab-orders",
  invoices: "/invoices",
  payments: "/payments",
  quotes: "/quotes",
  products: "/products",
  employees: "/employees",
  reports: "/reports",
  crm: "/crm",
  notifications: "/notifications",
  settings: "/settings",
  dashboard: "/dashboard",
  roles: "/roles",
  publicRoles: "/roles/public",
  permissions: "/permissions",
  pages: "/pages",
} as const;
