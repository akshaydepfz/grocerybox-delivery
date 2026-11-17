import type { NextRequest } from "next/server";

import { proxyDeliveryAuthRequest } from "@/lib/auth/delivery-auth-proxy";

export async function GET(request: NextRequest) {
  return proxyDeliveryAuthRequest(request, "me");
}