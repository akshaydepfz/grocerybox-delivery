export type { DeliveryPartnerProfile, DeliveryPartnerSession } from "./delivery-partner";

export type AuthSession = {
  partnerId: string;
  merchantId: string;
  fullName: string;
  phone: string;
};