import type { NextRequest } from "next/server";

import { proxyDeliveryAuthRequest } from "@/lib/auth/delivery-auth-proxy";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  return proxyDeliveryAuthRequest(request, "login");
}