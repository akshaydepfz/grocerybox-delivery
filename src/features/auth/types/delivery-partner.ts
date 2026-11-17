export type DeliveryPartnerProfile = {
  id: string;
  merchantId: string;
  merchantStoreName: string;
  fullName: string;
  phone: string;
};

export type DeliveryPartnerSession = {
  partner: DeliveryPartnerProfile;
};