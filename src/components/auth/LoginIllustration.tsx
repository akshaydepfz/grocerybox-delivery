import { Banknote, Clock, Package } from "lucide-react";

import { AppLogoImage } from "@/components/branding/app-logo";
import { cn } from "@/lib/utils";

const BENEFITS = [
  { icon: Clock, text: "Flexible delivery opportunities" },
  { icon: Banknote, text: "Track your daily earnings" },
  { icon: Package, text: "Easy order management" },
] as const;

type LoginIllustrationProps = {
  variant?: "desktop" | "mobile";
  className?: string;
};

export function LoginIllustration({
  variant = "desktop",
  className,
}: LoginIllustrationProps) {
  const isMobile = variant === "mobile";

  return (
    <div
      className={cn(
        "flex flex-col",
        isMobile
          ? "items-center gap-5 px-5 pt-8 pb-2 text-center"
          : "relative justify-between bg-[#F0FDF4]/60 px-10 py-12 lg:px-14 lg:py-14",
        className,
      )}
    >
      {!isMobile ? (
        <div className="inline-flex items-center gap-2.5">
          <AppLogoImage size={36} priority />
          <span className="text-lg font-semibold tracking-tight text-[#17211B]">
            GroceryBox
          </span>
        </div>
      ) : null}

      <div
        className={cn(
          "flex w-full flex-col",
          isMobile ? "items-center gap-4" : "flex-1 justify-center gap-8",
        )}
      >
        <DeliveryRiderArt className={isMobile ? "h-[140px] w-[240px]" : "h-[220px] w-full max-w-md"} />

        <div className={cn("space-y-3", isMobile ? "max-w-sm" : "max-w-lg")}>
          <h1
            className={cn(
              "font-semibold tracking-tight text-[#17211B]",
              isMobile ? "text-xl" : "text-3xl lg:text-[2rem] lg:leading-tight",
            )}
          >
            Deliver more. Earn more.
          </h1>
          <p
            className={cn(
              "leading-relaxed text-[#737B74]",
              isMobile ? "text-sm" : "text-base",
            )}
          >
            Join the GroceryBox delivery team and manage your deliveries with
            ease.
          </p>
        </div>

        <ul
          className={cn(
            "space-y-3 text-left",
            isMobile ? "w-full max-w-sm" : "w-full max-w-lg",
          )}
        >
          {BENEFITS.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-start gap-3 rounded-xl border border-[#E5E7EB]/80 bg-white/80 px-4 py-3 shadow-[0_1px_2px_rgba(23,33,27,0.04)]"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F0FDF4] text-[#16A34A]">
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="pt-1 text-sm text-[#17211B]">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DeliveryRiderArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 240"
      role="img"
      aria-label="Delivery partner with green delivery bag"
      className={cn("mx-auto", className)}
    >
      <defs>
        <linearGradient id="gb-ground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#F0FDF4" stopOpacity="0" />
          <stop offset="100%" stopColor="#DCFCE7" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="215" rx="155" ry="18" fill="url(#gb-ground)" />
      <rect x="72" y="158" width="86" height="44" rx="10" fill="#E5E7EB" />
      <rect x="88" y="168" width="54" height="24" rx="6" fill="#FFFFFF" />
      <path
        d="M72 158 L95 124 L130 118 L158 134 L158 158 Z"
        fill="#16A34A"
        opacity="0.15"
      />
      <circle cx="108" cy="206" r="22" fill="#17211B" opacity="0.08" />
      <circle cx="108" cy="206" r="14" fill="#17211B" opacity="0.12" />
      <circle cx="318" cy="206" r="22" fill="#17211B" opacity="0.08" />
      <circle cx="318" cy="206" r="14" fill="#17211B" opacity="0.12" />
      <path
        d="M140 92 C152 62 188 48 224 58 C258 68 282 98 276 132 C270 162 242 178 208 176"
        fill="#15803D"
      />
      <rect x="188" y="118" width="64" height="78" rx="14" fill="#16A34A" />
      <path
        d="M206 118 L220 96 C228 88 242 86 254 94 L266 118 Z"
        fill="#15803D"
      />
      <rect x="204" y="132" width="32" height="8" rx="4" fill="#F0FDF4" />
      <circle cx="248" cy="82" r="22" fill="#FFDBAC" />
      <path
        d="M226 78 C230 66 246 60 262 66 C274 70 284 82 282 96"
        fill="#17211B"
      />
      <rect x="268" y="134" width="72" height="52" rx="12" fill="#16A34A" />
      <path d="M280 134 L292 112 H332 L340 134 Z" fill="#15803D" />
      <path
        d="M292 148 H316"
        stroke="#F0FDF4"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="332" cy="148" r="5" fill="#F0FDF4" />
      <path
        d="M56 148 H112"
        stroke="#16A34A"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="8 8"
        opacity="0.5"
      />
      <path
        d="M300 68 L340 52"
        stroke="#16A34A"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}