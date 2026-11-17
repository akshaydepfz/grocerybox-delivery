import type { NextRequest } from "next/server";

import { proxyDeliveryApiRequest } from "@/lib/auth/delivery-api-proxy";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return proxyDeliveryApiRequest(request, "orders", new Set(["GET"]));
}