import type { ReactNode } from "react";

import { GroceryBrandLogo } from "@/components/branding/app-logo";

type AuthLayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gb-bg-secondary lg:flex-row">
      <aside className="hidden w-full max-w-md flex-col justify-between border-r border-gb-border bg-gb-primary p-10 text-white lg:flex">
        <div>
          <GroceryBrandLogo className="text-white [&_span]:text-white [&_.text-gb-onboard-lime-500]:text-gb-accent" />
          <h1 className="mt-8 text-3xl font-semibold leading-tight">
            Delivery workspace
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            Pick up orders, update delivery status, and stay synced with
            merchant stores.
          </p>
        </div>
        <p className="text-xs text-white/60">© GroceryBox</p>
      </aside>
      <main className="flex flex-1 flex-col items-center justify-center p-6 sm:p-10">
        <div className="mb-8 lg:hidden">
          <GroceryBrandLogo />
        </div>
        <div className="w-full max-w-md">
          {(title || description) && (
            <header className="mb-8 space-y-2 text-center lg:text-left">
              {title ? (
                <h2 className="text-2xl font-semibold text-gb-text-primary">
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p className="text-sm text-gb-text-secondary">{description}</p>
              ) : null}
            </header>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}