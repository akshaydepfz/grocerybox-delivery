export type DeliveryPartnerAppProfile = {
  id: string;
  merchantId: string;
  merchantStoreName: string;
  fullName: string;
  phone: string;
  commissionType: "fixed" | "percentage";
  commissionValue: number;
  completedDeliveries: number;
  isActive: boolean;
  joinedAt: string;
  lifetimeEarningsInr?: number;
};