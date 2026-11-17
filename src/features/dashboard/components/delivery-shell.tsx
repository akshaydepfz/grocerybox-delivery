"use client";

import { LogOut } from "lucide-react";
import type { ReactNode } from "react";

import { GroceryBrandLogo } from "@/components/branding/app-logo";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { useAuth } from "@/features/auth/components/auth-provider";
import { signOutDeliveryPartner } from "@/features/auth/services/delivery-partner-login-service";

type DeliveryShellProps = {
  children: ReactNode;
};

export function DeliveryShell({ children }: DeliveryShellProps) {
  const { partner, setPartner } = useAuth();

  const handleSignOut = async () => {
    await signOutDeliveryPartner();
    setPartner(null);
    window.location.assign(AUTH_ROUTES.login);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f6f8]">
      <header className="sticky top-0 z-20 border-b border-[#eceef2] bg-white px-4 py-3 shadow-gb-sm sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <GroceryBrandLogo size="compact" />
          <div className="flex items-center gap-3">
            {partner ? (
              <span className="hidden max-w-[220px] truncate text-sm text-gb-text-secondary sm:inline">
                {partner.fullName} · {partner.phone}
              </span>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void handleSignOut()}
            >
              <LogOut className="size-4" aria-hidden />
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}