"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAuthStore } from "@/stores/auth-store";

import type { DeliveryPartnerProfile } from "../types/delivery-partner";
import { revalidateDeliveryPartnerSession } from "../services/delivery-partner-login-service";

type AuthContextValue = {
  partner: DeliveryPartnerProfile | null;
  isAuthReady: boolean;
  sessionError: string | null;
  refreshSession: () => Promise<void>;
  setPartner: (partner: DeliveryPartnerProfile | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_PROBE_ATTEMPTS = 3;
const SESSION_PROBE_DELAY_MS = 400;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function probeDeliverySession() {
  let last: Awaited<ReturnType<typeof revalidateDeliveryPartnerSession>> = {
    kind: "unavailable",
  };

  for (let attempt = 0; attempt < SESSION_PROBE_ATTEMPTS; attempt += 1) {
    last = await revalidateDeliveryPartnerSession();
    if (last.kind !== "unavailable") {
      return last;
    }
    if (attempt < SESSION_PROBE_ATTEMPTS - 1) {
      await wait(SESSION_PROBE_DELAY_MS * (attempt + 1));
    }
  }

  return last;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setSession, clearSession, setHydrated } = useAuthStore();
  const [partner, setPartnerState] = useState<DeliveryPartnerProfile | null>(
    null,
  );
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const applyPartner = useCallback(
    (next: DeliveryPartnerProfile | null) => {
      setPartnerState(next);
      if (next) {
        setSession({
          partnerId: next.id,
          merchantId: next.merchantId,
          merchantStoreName: next.merchantStoreName,
          fullName: next.fullName,
          phone: next.phone,
        });
      } else {
        clearSession();
      }
    },
    [clearSession, setSession],
  );

  const refreshSession = useCallback(async () => {
    const result = await probeDeliverySession();
    if (result.kind === "authenticated") {
      setSessionError(null);
      applyPartner(result.session.partner);
      return;
    }
    if (result.kind === "unauthenticated") {
      setSessionError(null);
      applyPartner(null);
      return;
    }
    setSessionError("Could not verify your session. Check your connection and try again.");
  }, [applyPartner]);

  useEffect(() => {
    let active = true;
    void (async () => {
      const result = await probeDeliverySession();
      if (!active) {
        return;
      }

      if (result.kind === "authenticated") {
        setSessionError(null);
        applyPartner(result.session.partner);
      } else if (result.kind === "unauthenticated") {
        setSessionError(null);
        applyPartner(null);
      } else {
        setSessionError(
          "Could not verify your session. Check your connection and try again.",
        );
        applyPartner(null);
      }

      setHydrated(true);
      setIsAuthReady(true);
    })();
    return () => {
      active = false;
    };
  }, [applyPartner, setHydrated]);

  return (
    <AuthContext.Provider
      value={{
        partner,
        isAuthReady,
        sessionError,
        refreshSession,
        setPartner: applyPartner,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}