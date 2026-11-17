import type {
  DeliveryCollectionMode,
  DeliveryOrderAddress,
  DeliveryOrderDetail,
  DeliveryOrderLine,
  DeliveryOrderListItem,
  DeliveryOrderStep,
  DeliveryPerformanceSummary,
} from "../types/order";

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function readOptionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function readStep(value: unknown): DeliveryOrderStep {
  const step = readString(value);
  switch (step) {
    case "placed":
    case "confirmed":
    case "packing":
    case "out_for_delivery":
    case "delivered":
    case "cancelled":
      return step;
    default:
      return "placed";
  }
}

function readCollectionMode(value: unknown): DeliveryCollectionMode | undefined {
  const mode = readString(value);
  if (mode === "cash" || mode === "online") {
    return mode;
  }
  return undefined;
}

function parseAddress(raw: unknown): DeliveryOrderAddress {
  const record =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    fullName: readString(record.full_name),
    phone: readString(record.phone),
    house: readString(record.house),
    street: readString(record.street),
    city: readString(record.city),
    state: readString(record.state),
    pinCode: readString(record.pin_code),
    landmark: readString(record.landmark) || undefined,
    lat: readOptionalNumber(record.lat),
    lng: readOptionalNumber(record.lng),
  };
}

function parseLines(raw: unknown): DeliveryOrderLine[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.map((item) => {
    const record =
      item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      name: readString(record.name),
      quantity: readNumber(record.quantity),
      unitLabel: readString(record.unit_label),
      lineSellingTotal: readNumber(record.line_selling_total),
    };
  });
}

export function deliveryOrderListItemFromJson(
  raw: Record<string, unknown>,
): DeliveryOrderListItem {
  return {
    id: readString(raw.id),
    orderNumber: readString(raw.order_number),
    customerPhone: readString(raw.customer_phone),
    customerName: readString(raw.customer_name),
    placedAt: readString(raw.placed_at),
    updatedAt: readString(raw.updated_at),
    currentStep: readStep(raw.current_step),
    paymentMethod: readString(raw.payment_method),
    paymentStatus: readString(raw.payment_status),
    isOnlinePayment: raw.is_online_payment === true,
    fulfillmentMethod: readString(raw.fulfillment_method),
    deliveryLabel: readString(raw.delivery_label),
    toPay: readNumber(raw.to_pay),
    addressSummary: readString(raw.address_summary),
    merchantStoreName: readString(raw.merchant_store_name),
    fulfillmentHub: readString(raw.fulfillment_hub),
    commissionInr: readOptionalNumber(raw.commission_inr),
    collectionMode: readCollectionMode(raw.collection_mode),
  };
}

export function deliveryOrderDetailFromJson(
  raw: Record<string, unknown>,
): DeliveryOrderDetail {
  const base = deliveryOrderListItemFromJson({
    id: raw.id,
    order_number: raw.order_id ?? raw.order_number,
    customer_phone: raw.customer_phone,
    customer_name: (raw.address as Record<string, unknown> | undefined)?.full_name,
    placed_at: raw.placed_at,
    updated_at: raw.updated_at,
    current_step: raw.current_step,
    payment_method: raw.payment_method,
    payment_status: raw.payment_status,
    is_online_payment: raw.is_online_payment,
    fulfillment_method: raw.fulfillment_method,
    delivery_label: raw.delivery_label,
    to_pay: (raw.pricing as Record<string, unknown> | undefined)?.to_pay,
    address_summary: "",
    merchant_store_name: raw.merchant_store_name,
    fulfillment_hub: raw.fulfillment_hub,
    commission_inr: raw.commission_inr,
    collection_mode: raw.collection_mode,
  });

  const address = parseAddress(raw.address);
  if (!base.customerName) {
    base.customerName = address.fullName;
  }
  base.addressSummary = formatAddressSummary(address);

  return {
    ...base,
    deliveryInstructions: readString(raw.delivery_instructions) || undefined,
    orderNotes: readString(raw.order_notes) || undefined,
    paymentDisplay: readString(raw.payment_display),
    address,
    lines: parseLines(raw.lines),
    collectedAmountInr: readOptionalNumber(raw.collected_amount_inr),
    deliveredAt: readString(raw.delivered_at) || undefined,
  };
}

export function deliveryPerformanceFromJson(
  raw: Record<string, unknown>,
): DeliveryPerformanceSummary {
  return {
    todayDeliveries: Math.round(readNumber(raw.today_deliveries)),
    completed: Math.round(readNumber(raw.completed)),
    pending: Math.round(readNumber(raw.pending)),
    todayEarningsInr: readNumber(raw.today_earnings_inr),
    totalDeliveries: Math.round(readNumber(raw.total_deliveries)),
    lifetimeEarningsInr: readNumber(raw.lifetime_earnings_inr),
  };
}

export function formatAddressSummary(address: DeliveryOrderAddress): string {
  return [address.house, address.street, address.city, address.pinCode]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");
}

export function isCodOrder(order: Pick<DeliveryOrderListItem, "paymentMethod">): boolean {
  return order.paymentMethod.toLowerCase() === "cod";
}