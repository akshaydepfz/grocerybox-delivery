import type {
  DeliveryEarningItem,
  DeliveryEarningsSummary,
  EarningsPeriod,
  PaginatedDeliveryEarnings,
} from "../types/earnings";

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function readPeriod(value: unknown): EarningsPeriod {
  const period = readString(value);
  if (period === "today" || period === "week" || period === "month" || period === "all") {
    return period;
  }
  return "month";
}

function readCollectionMode(value: unknown): DeliveryEarningItem["collectionMode"] {
  const mode = readString(value);
  return mode === "cash" ? "cash" : "online";
}

function readCommissionType(value: unknown): DeliveryEarningItem["commissionType"] {
  const t = readString(value);
  return t === "percentage" ? "percentage" : "fixed";
}

export function deliveryEarningItemFromJson(
  raw: Record<string, unknown>,
): DeliveryEarningItem {
  return {
    id: readString(raw.id),
    orderId: readString(raw.order_id),
    orderNumber: readString(raw.order_number),
    deliveredAt: readString(raw.delivered_at),
    commissionAmountInr: readNumber(raw.commission_amount_inr),
    orderValueInr: readNumber(raw.order_value_inr),
    collectionMode: readCollectionMode(raw.collection_mode),
    commissionType: readCommissionType(raw.commission_type),
  };
}

export function deliveryEarningsSummaryFromJson(
  raw: Record<string, unknown>,
): DeliveryEarningsSummary {
  return {
    period: readPeriod(raw.period),
    totalCommissionInr: readNumber(raw.total_commission_inr),
    deliveryCount: Math.round(readNumber(raw.delivery_count)),
    lifetimeEarningsInr: readNumber(raw.lifetime_earnings_inr),
  };
}

export function paginatedDeliveryEarningsFromJson(
  data: Record<string, unknown>,
): PaginatedDeliveryEarnings {
  const summaryRaw =
    data.summary && typeof data.summary === "object"
      ? (data.summary as Record<string, unknown>)
      : {};
  const itemsRaw = Array.isArray(data.items) ? data.items : [];
  const paginationRaw =
    data.pagination && typeof data.pagination === "object"
      ? (data.pagination as Record<string, unknown>)
      : {};

  return {
    summary: deliveryEarningsSummaryFromJson(summaryRaw),
    items: itemsRaw.map((item) =>
      deliveryEarningItemFromJson(
        item && typeof item === "object" ? (item as Record<string, unknown>) : {},
      ),
    ),
    pagination: {
      page: Number(paginationRaw.page) || 1,
      limit: Number(paginationRaw.limit) || 20,
      total: Number(paginationRaw.total) || 0,
      totalPages:
        Number(paginationRaw.total_pages ?? paginationRaw.totalPages) || 0,
    },
  };
}

export function formatEarningsDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}