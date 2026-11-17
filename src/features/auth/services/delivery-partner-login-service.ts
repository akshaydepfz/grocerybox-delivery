import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import { envelopeErrorMessage, parseApiEnvelope } from "@/lib/api/envelope";
import { ApiError } from "@/lib/api/types";

import type { DeliveryPartnerSession } from "../types/delivery-partner";
import { deliveryPartnerFromJson } from "../utils/delivery-partner-parse";

export type DeliveryPartnerLoginInput = {
  phone: string;
  password: string;
  rememberMe: boolean;
};

export class DeliveryLoginError extends Error {
  readonly status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.name = "DeliveryLoginError";
    this.status = status;
  }
}

function assertSessionPayload(
  data: unknown,
  status: number,
): DeliveryPartnerSession {
  const envelope = parseApiEnvelope(data);
  if (!envelope.success || typeof envelope.data !== "object" || !envelope.data) {
    throw new ApiError(envelopeErrorMessage(status, envelope), status);
  }
  const body = envelope.data as Record<string, unknown>;
  if (typeof body.partner !== "object" || !body.partner) {
    throw new ApiError("Unexpected login response.", status);
  }
  return {
    partner: deliveryPartnerFromJson(body.partner as Record<string, unknown>),
  };
}

export async function signInDeliveryPartner(
  input: DeliveryPartnerLoginInput,
): Promise<DeliveryPartnerSession> {
  void input.rememberMe;
  try {
    const response = await apiClient.post(API_ENDPOINTS.deliveryAuthLogin, {
      phone: input.phone,
      password: input.password,
    });
    return assertSessionPayload(response.data, response.status);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new DeliveryLoginError(
        error.message || "Invalid phone or password.",
        error.status,
      );
    }
    throw error;
  }
}

export async function revalidateDeliveryPartnerSession(): Promise<DeliveryPartnerSession | null> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.deliveryAuthMe);
    return assertSessionPayload(response.data, response.status);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    return null;
  }
}

export async function signOutDeliveryPartner(): Promise<void> {
  try {
    await apiClient.post(API_ENDPOINTS.deliveryAuthLogout);
  } catch {
    // Best-effort logout.
  }
}

export function friendlyDeliveryLoginError(error: unknown): string {
  if (error instanceof DeliveryLoginError) {
    if (error.status === 401) {
      return "Invalid phone or password.";
    }
    if (error.status === 403) {
      return "Your account is inactive. Contact your store owner.";
    }
    if (error.status === 503) {
      return "Sign-in is temporarily unavailable. Try again shortly.";
    }
    return error.message || "Unable to sign in.";
  }
  if (error instanceof ApiError) {
    return error.message || "Unable to sign in.";
  }
  return "Unable to sign in. Please try again.";
}