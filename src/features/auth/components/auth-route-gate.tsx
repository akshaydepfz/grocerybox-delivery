"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { GroceryAnimatedLoader } from "@/components/shared/animated-loader";

import { AUTH_ROUTES } from "../constants";

import { useAuth } from "./auth-provider";

type AuthRouteGateProps = {
  children: ReactNode;
};

/** Protects dashboard routes — redirects unauthenticated users to login. */
export function AuthRouteGate({ children }: AuthRouteGateProps) {
  const router = useRouter();
  const { partner, isAuthReady } = useAuth();

  useEffect(() => {
    if (isAuthReady && !partner) {
      router.replace(AUTH_ROUTES.login);
    }
  }, [isAuthReady, partner, router]);

  if (!isAuthReady || !partner) {
    return <GroceryAnimatedLoader fullScreen label="Loading your workspace" />;
  }

  return children;
}