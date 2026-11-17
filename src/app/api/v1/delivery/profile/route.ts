import type { NextRequest } from "next/server";

import { proxyDeliveryApiRequest } from "@/lib/auth/delivery-api-proxy";

export async function GET(request: NextRequest) {
  return proxyDeliveryApiRequest(request, "profile", new Set(["GET"]));
}