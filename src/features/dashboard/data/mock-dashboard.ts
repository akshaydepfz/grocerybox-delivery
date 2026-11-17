import type {
  ActiveDelivery,
  NewDeliveryRequest,
  PerformanceSnapshot,
  RecentDeliveryActivity,
} from "../types/dashboard";

export const MOCK_MERCHANT_NAME = "Fresh Mart";

export const MOCK_PERFORMANCE: PerformanceSnapshot = {
  todayDeliveries: 12,
  completed: 8,
  pending: 4,
  todayEarningsInr: 240,
};

export const MOCK_ACTIVE_DELIVERY: ActiveDelivery = {
  id: "GB10245",
  merchantName: "Fresh Mart",
  customerName: "Anjali",
  customerPhone: "+91 9876543210",
  pickup: "Fresh Mart, Kozhikode",
  dropoff: "Mavoor Road, Kozhikode",
  distanceKm: 3.2,
  etaMinutes: 20,
  status: "out_for_delivery",
};

export const MOCK_NEW_DELIVERIES: NewDeliveryRequest[] = [
  {
    id: "GB10246",
    customerName: "Suresh",
    pickup: "Fresh Mart, Kozhikode",
    dropoff: "Palayam, Kozhikode",
    distanceKm: 2.4,
    earningsInr: 25,
  },
  {
    id: "GB10247",
    customerName: "Meera",
    pickup: "Fresh Mart, Kozhikode",
    dropoff: "Feroke, Kozhikode",
    distanceKm: 4.1,
    earningsInr: 30,
  },
];

export const MOCK_RECENT_ACTIVITY: RecentDeliveryActivity[] = [
  {
    id: "GB10242",
    customerName: "Riya",
    completedAt: "10:45 AM",
    commissionInr: 28,
  },
  {
    id: "GB10241",
    customerName: "Vishnu",
    completedAt: "9:20 AM",
    commissionInr: 22,
  },
  {
    id: "GB10240",
    customerName: "Fatima",
    completedAt: "8:05 AM",
    commissionInr: 30,
  },
];