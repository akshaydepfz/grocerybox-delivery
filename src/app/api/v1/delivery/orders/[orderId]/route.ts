import type { NextRequest } from "next/server";

import { proxyDeliveryApiRequest } from "@/lib/auth/delivery-api-proxy";

type RouteParams = { params: Promise<{ orderId: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { orderId } = await params;
  return proxyDeliveryApiRequest(
    request,
    `orders/${encodeURIComponent(orderId)}`,
    new Set(["GET"]),
  );
}