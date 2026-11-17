/**
 * REST path registry for the delivery partner API.
 */
import { API_V1_PREFIX } from "@/config/api-config";

export const apiPath = (...segments: string[]): string => {
  const normalized = segments
    .map((segment) => segment.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean);
  return `/${normalized.join("/")}`;
};

/** Delivery partner auth and future protected routes. */
export const API_ENDPOINTS = {
  deliveryAuthLogin: `${API_V1_PREFIX}/delivery/auth/login`,
  deliveryAuthMe: `${API_V1_PREFIX}/delivery/auth/me`,
  deliveryAuthLogout: `${API_V1_PREFIX}/delivery/auth/logout`,
  deliveryOrders: `${API_V1_PREFIX}/delivery/orders`,
  deliveryPerformanceSummary: `${API_V1_PREFIX}/delivery/performance/summary`,
} as const satisfies Record<string, string>;

export function deliveryOrderPath(orderId: string): string {
  return `${API_ENDPOINTS.deliveryOrders}/${orderId}`;
}

export type ApiEndpointKey = keyof typeof API_ENDPOINTS;