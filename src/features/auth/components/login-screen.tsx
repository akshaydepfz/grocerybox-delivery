"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { LoginForm } from "@/components/auth/LoginForm";
import { LoginIllustration } from "@/components/auth/LoginIllustration";
import { GroceryAnimatedLoader } from "@/components/shared/animated-loader";

import { DELIVERY_ROUTES } from "../constants";

import { useAuth } from "./auth-provider";

export function LoginScreen() {
  const router = useRouter();
  const { partner, isAuthReady } = useAuth();

  useEffect(() => {
    if (isAuthReady && partner) {
      router.replace(DELIVERY_ROUTES.dashboard);
    }
  }, [isAuthReady, partner, router]);

  if (!isAuthReady) {
    return <GroceryAnimatedLoader fullScreen label="Preparing sign-in" theme="light" />;
  }

  if (partner) {
    return <GroceryAnimatedLoader fullScreen label="Opening dashboard" theme="light" />;
  }

  return (
    <div className="min-h-dvh bg-white text-[#17211B]">
      <div className="flex min-h-dvh flex-col lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <section
          className="hidden border-r border-[#E5E7EB] lg:block"
          aria-label="About GroceryBox delivery"
        >
          <LoginIllustration variant="desktop" className="min-h-dvh" />
        </section>

        <section className="flex min-h-dvh flex-col">
          <div className="flex flex-1 flex-col items-center justify-center px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
            <LoginForm />
          </div>

          <footer className="border-t border-[#E5E7EB] px-5 py-5 text-center text-xs text-[#737B74] lg:py-6">
            © 2026 GroceryBox. All rights reserved.
          </footer>
        </section>
      </div>
    </div>
  );
}