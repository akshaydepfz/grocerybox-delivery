"use client";

import { Eye, EyeOff, Loader2, Lock, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, InputWithIcon } from "@/components/ui/input";
import { useAuth } from "@/features/auth/components/auth-provider";
import { DELIVERY_ROUTES } from "@/features/auth/constants";
import {
  friendlyDeliveryLoginError,
  signInDeliveryPartner,
} from "@/features/auth/services/delivery-partner-login-service";
import {
  isLoginFormValid,
  validateLoginPassword,
  validateLoginPhone,
} from "@/features/auth/utils/login-validation";
import { cn } from "@/lib/utils";

const REMEMBER_KEY = "gb_delivery_remember_phone";

function readRememberedPhone(): string {
  if (typeof window === "undefined") {
    return "";
  }
  try {
    return localStorage.getItem(REMEMBER_KEY) ?? "";
  } catch {
    return "";
  }
}

type FieldErrors = {
  phone?: string;
  password?: string;
  form?: string;
};

export function LoginForm() {
  const router = useRouter();
  const { setPartner } = useAuth();
  const formId = useId();
  const [phone, setPhone] = useState(readRememberedPhone);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(
    () => readRememberedPhone().length > 0,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ phone: false, password: false });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formNotice, setFormNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const syncFieldErrors = useCallback(
    (nextPhone: string, nextPassword: string) => {
      setErrors((prev) => ({
        ...prev,
        phone: touched.phone
          ? validateLoginPhone(nextPhone) ?? undefined
          : prev.phone,
        password: touched.password
          ? validateLoginPassword(nextPassword) ?? undefined
          : prev.password,
      }));
    },
    [touched.phone, touched.password],
  );

  const canSubmit = isLoginFormValid(phone, password) && !isSubmitting;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTouched({ phone: true, password: true });

    const phoneError = validateLoginPhone(phone);
    const passwordError = validateLoginPassword(password);
    if (phoneError || passwordError) {
      setErrors({
        phone: phoneError ?? undefined,
        password: passwordError ?? undefined,
      });
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setFormNotice(null);

    try {
      const normalizedPhone = phone.replace(/\D/g, "").slice(-10);

      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, normalizedPhone);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      const session = await signInDeliveryPartner({
        phone: normalizedPhone,
        password,
        rememberMe,
      });
      setPartner(session.partner);
      router.replace(DELIVERY_ROUTES.dashboard);
    } catch (error) {
      setErrors({ form: friendlyDeliveryLoginError(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[420px]">
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_8px_30px_rgba(23,33,27,0.06)] sm:p-8">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#16A34A] uppercase">
          Delivery partner portal
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#17211B]">
          Welcome back
        </h2>
        <p className="mt-1.5 text-sm text-[#737B74]">
          Sign in to continue to your delivery dashboard.
        </p>

        <form
          id={formId}
          className="mt-7 space-y-5"
          onSubmit={(e) => void handleSubmit(e)}
          noValidate
        >
          <div className="space-y-1.5">
            <label
              htmlFor={`${formId}-phone`}
              className="text-sm font-medium text-[#17211B]"
            >
              Phone number
            </label>
            <InputWithIcon
              id={`${formId}-phone`}
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => {
                const next = e.target.value.replace(/[^\d+\s-]/g, "");
                setPhone(next);
                syncFieldErrors(next, password);
              }}
              onBlur={() => {
                setTouched((t) => ({ ...t, phone: true }));
                const message = validateLoginPhone(phone);
                setErrors((prev) => ({
                  ...prev,
                  phone: message ?? undefined,
                }));
              }}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={
                errors.phone ? `${formId}-phone-error` : undefined
              }
              leadingIcon={<Phone className="size-[18px]" />}
            />
            {errors.phone ? (
              <p
                id={`${formId}-phone-error`}
                className="text-xs text-red-600"
                role="alert"
              >
                {errors.phone}
              </p>
            ) : (
              <p className="text-xs text-[#737B74]">
                Use your 10-digit mobile number registered with your store.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor={`${formId}-password`}
              className="text-sm font-medium text-[#17211B]"
            >
              Password
            </label>
            <PasswordField
              formId={formId}
              password={password}
              showPassword={showPassword}
              error={errors.password}
              onToggle={() => setShowPassword((v) => !v)}
              onChange={(next) => {
                setPassword(next);
                syncFieldErrors(phone, next);
              }}
              onBlur={() => {
                setTouched((t) => ({ ...t, password: true }));
                const message = validateLoginPassword(password);
                setErrors((prev) => ({
                  ...prev,
                  password: message ?? undefined,
                }));
              }}
            />
            {errors.password ? (
              <p
                id={`${formId}-password-error`}
                className="text-xs text-red-600"
                role="alert"
              >
                {errors.password}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
            <label className="flex cursor-pointer items-center gap-2.5">
              <Checkbox
                checked={rememberMe}
                onCheckedChange={(checked) =>
                  setRememberMe(checked === true)
                }
                aria-label="Remember me"
              />
              <span className="text-sm text-[#17211B]">Remember me</span>
            </label>
            <button
              type="button"
              className="text-sm font-medium text-[#16A34A] hover:text-[#15803D]"
              onClick={() => {
                setErrors((prev) => ({ ...prev, form: undefined }));
                setFormNotice(
                  "Contact your store owner to reset your password.",
                );
              }}
            >
              Forgot password?
            </button>
          </div>

          {formNotice ? (
            <div
              className="rounded-xl border border-[#bbf7d0] bg-[#F0FDF4] px-3.5 py-2.5 text-sm text-[#15803D]"
              role="status"
            >
              {formNotice}
            </div>
          ) : null}

          {errors.form ? (
            <div
              className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
              role="alert"
            >
              {errors.form}
            </div>
          ) : null}

          <Button
            type="submit"
            variant="brand"
            size="lg"
            disabled={!canSubmit}
            className="h-12 w-full rounded-xl text-base font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-5 animate-spin" aria-hidden />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

type PasswordFieldProps = {
  formId: string;
  password: string;
  showPassword: boolean;
  error?: string;
  onToggle: () => void;
  onChange: (value: string) => void;
  onBlur: () => void;
};

function PasswordField({
  formId,
  password,
  showPassword,
  error,
  onToggle,
  onChange,
  onBlur,
}: PasswordFieldProps) {
  return (
    <div className="relative">
      <span
        className="pointer-events-none absolute top-1/2 left-3.5 flex -translate-y-1/2 text-[#737B74]"
        aria-hidden
      >
        <Lock className="size-[18px]" />
      </span>
      <Input
        id={`${formId}-password`}
        name="password"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={cn("pr-11 pl-11")}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${formId}-password-error` : undefined}
      />
      <button
        type="button"
        className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#737B74] transition-colors hover:bg-[#F0FDF4] hover:text-[#16A34A]"
        onClick={onToggle}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff className="size-[18px]" aria-hidden />
        ) : (
          <Eye className="size-[18px]" aria-hidden />
        )}
      </button>
    </div>
  );
}