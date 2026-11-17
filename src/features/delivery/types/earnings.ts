export type EarningsPeriod = "today" | "week" | "month" | "all";

export type DeliveryEarningItem = {
  id: string;
  orderId: string;
  orderNumber: string;
  deliveredAt: string;
  commissionAmountInr: number;
  orderValueInr: number;
  collectionMode: "cash" | "online";
  commissionType: "fixed" | "percentage";
};

export type DeliveryEarningsSummary = {
  period: EarningsPeriod;
  totalCommissionInr: number;
  deliveryCount: number;
  lifetimeEarningsInr: number;
};

export type PaginatedDeliveryEarnings = {
  summary: DeliveryEarningsSummary;
  items: DeliveryEarningItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};