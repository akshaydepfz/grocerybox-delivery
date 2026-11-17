export type DeliveryCollectionMode = "cash" | "online";

export type DeliveryOrderStep =
  | "placed"
  | "confirmed"
  | "packing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type DeliveryOrderListItem = {
  id: string;
  orderNumber: string;
  customerPhone: string;
  customerName: string;
  placedAt: string;
  updatedAt: string;
  currentStep: DeliveryOrderStep;
  paymentMethod: string;
  paymentStatus: string;
  isOnlinePayment: boolean;
  fulfillmentMethod: string;
  deliveryLabel: string;
  toPay: number;
  addressSummary: string;
  merchantStoreName: string;
  fulfillmentHub: string;
  commissionInr?: number;
  collectionMode?: DeliveryCollectionMode;
};

export type DeliveryOrderAddress = {
  fullName: string;
  phone: string;
  house: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  landmark?: string;
};

export type DeliveryOrderLine = {
  name: string;
  quantity: number;
  unitLabel: string;
  lineSellingTotal: number;
};

export type DeliveryOrderDetail = DeliveryOrderListItem & {
  deliveryInstructions?: string;
  orderNotes?: string;
  paymentDisplay: string;
  address: DeliveryOrderAddress;
  lines: DeliveryOrderLine[];
  collectedAmountInr?: number;
  deliveredAt?: string;
};

export type DeliveryPerformanceSummary = {
  todayDeliveries: number;
  completed: number;
  pending: number;
  todayEarningsInr: number;
  totalDeliveries: number;
  lifetimeEarningsInr: number;
};

export type DeliveryCompleteOrderInput = {
  collectionMode: DeliveryCollectionMode;
};

export type DeliveryCompleteOrderResult = {
  order: DeliveryOrderDetail;
  commissionAmountInr: number;
  collectionMode: DeliveryCollectionMode;
};

export type PaginatedDeliveryOrders = {
  items: DeliveryOrderListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};