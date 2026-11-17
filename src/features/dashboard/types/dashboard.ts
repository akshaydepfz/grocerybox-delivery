export type DeliveryStatus =
  | "assigned"
  | "picked_up"
  | "out_for_delivery"
  | "delivered";

export type ActiveDelivery = {
  id: string;
  merchantName: string;
  customerName: string;
  customerPhone: string;
  pickup: string;
  dropoff: string;
  distanceKm: number;
  etaMinutes: number;
  status: DeliveryStatus;
};

export type NewDeliveryRequest = {
  id: string;
  customerName: string;
  pickup: string;
  dropoff: string;
  distanceKm: number;
  earningsInr: number;
};

export type RecentDeliveryActivity = {
  id: string;
  customerName: string;
  completedAt: string;
  commissionInr: number;
};

export type PerformanceSnapshot = {
  todayDeliveries: number;
  completed: number;
  pending: number;
  todayEarningsInr: number;
};