"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { GroceryAnimatedLoader } from "@/components/shared/animated-loader";

import { AUTH_ROUTES } from "../constants";

import { useAuth } from "./auth-provider";

type AuthRouteGateProps = {
  children: ReactNode;
};

/** Protects dashboard routes — redirects unauthenticated users to login. */
export function AuthRouteGate({ children }: AuthRouteGateProps) {
  const router = useRouter();
  const { partner, isAuthReady, sessionError, refreshSession } = useAuth();

  useEffect(() => {
    if (isAuthReady && !partner && !sessionError) {
      router.replace(AUTH_ROUTES.login);
    }
  }, [isAuthReady, partner, router, sessionError]);

  if (!isAuthReady) {
    return <GroceryAnimatedLoader fullScreen label="Loading your workspace" />;
  }

  if (sessionError) {
    return (
      <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-base font-medium text-[#17211B]">{sessionError}</p>
        <Button
          type="button"
          variant="brand"
          className="rounded-xl"
          onClick={() => void refreshSession()}
        >
          Try again
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() => router.replace(AUTH_ROUTES.login)}
        >
          Back to sign in
        </Button>
      </div>
    );
  }

  if (!partner) {
    return <GroceryAnimatedLoader fullScreen label="Loading your workspace" />;
  }

  return children;
}