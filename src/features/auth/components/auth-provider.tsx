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
  refreshSession: () => Promise<void>;
  setPartner: (partner: DeliveryPartnerProfile | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setSession, clearSession, setHydrated } = useAuthStore();
  const [partner, setPartnerState] = useState<DeliveryPartnerProfile | null>(
    null,
  );
  const [isAuthReady, setIsAuthReady] = useState(false);

  const applyPartner = useCallback(
    (next: DeliveryPartnerProfile | null) => {
      setPartnerState(next);
      if (next) {
        setSession({
          partnerId: next.id,
          merchantId: next.merchantId,
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
    const session = await revalidateDeliveryPartnerSession();
    applyPartner(session?.partner ?? null);
  }, [applyPartner]);

  useEffect(() => {
    let active = true;
    void (async () => {
      const session = await revalidateDeliveryPartnerSession();
      if (!active) {
        return;
      }
      applyPartner(session?.partner ?? null);
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