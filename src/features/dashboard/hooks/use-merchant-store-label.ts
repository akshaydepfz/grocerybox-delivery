import { useAuth } from "@/features/auth/components/auth-provider";

export function useMerchantStoreLabel(): string {
  const { partner } = useAuth();
  const name = partner?.merchantStoreName?.trim();
  return name && name.length > 0 ? name : "Your store";
}