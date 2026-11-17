import type { LucideIcon } from "lucide-react";

type DashboardPlaceholderPageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function DashboardPlaceholderPage({
  title,
  description,
  icon: Icon,
}: DashboardPlaceholderPageProps) {
  return (
    <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-white px-6 py-16 text-center shadow-[0_4px_20px_rgba(23,33,27,0.04)]">
      <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#F0FDF4] text-[#16A34A]">
        <Icon className="size-6" aria-hidden />
      </span>
      <h1 className="text-xl font-semibold text-[#17211B]">{title}</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-[#737B74]">{description}</p>
      <p className="mt-6 text-xs text-[#737B74]">
        Placeholder screen — full experience coming soon.
      </p>
    </div>
  );
}