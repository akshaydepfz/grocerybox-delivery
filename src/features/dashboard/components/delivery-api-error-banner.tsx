"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDeliveryQueryError } from "@/features/delivery/hooks/use-delivery-orders";

type DeliveryApiErrorBannerProps = {
  error: unknown;
  onRetry: () => void;
};

export function DeliveryApiErrorBanner({
  error,
  onRetry,
}: DeliveryApiErrorBannerProps) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Live delivery data could not be loaded</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-900/90">
            {formatDeliveryQueryError(error)} The dashboard only uses real APIs
            now (no demo orders).
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 h-8 rounded-lg border-amber-300 bg-white"
            onClick={onRetry}
          >
            <RefreshCw className="size-3.5" />
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}