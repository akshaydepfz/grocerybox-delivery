import { NextRequest, NextResponse } from "next/server";

import { apiBaseUrl } from "@/config/api-config";

import { DELIVERY_PARTNER_SESSION_COOKIE } from "./delivery-session-cookie";
import { applySessionCookieFromUpstream } from "./delivery-auth-proxy";

export async function proxyDeliveryApiRequest(
  request: NextRequest,
  upstreamRelativePath: string,
  allowedMethods: Set<string>,
): Promise<NextResponse> {
  if (!allowedMethods.has(request.method)) {
    return NextResponse.json(
      { success: false, message: "Method not allowed" },
      { status: 405 },
    );
  }

  const normalizedPath = upstreamRelativePath.replace(/^\/+/, "");
  const query = request.nextUrl.search;
  const url = `${apiBaseUrl}/api/v1/delivery/${normalizedPath}${query}`;

  const headers = new Headers();
  headers.set("Accept", "application/json");

  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  const session = request.cookies.get(DELIVERY_PARTNER_SESSION_COOKIE)?.value;
  if (session) {
    headers.set("Cookie", `${DELIVERY_PARTNER_SESSION_COOKIE}=${session}`);
  }

  const upstreamInit: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    upstreamInit.body = await request.text();
  }

  const upstream = await fetch(url, upstreamInit);
  const body = await upstream.arrayBuffer();

  const response = new NextResponse(body, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/json; charset=utf-8",
    },
  });

  applySessionCookieFromUpstream(upstream, response);
  return response;
}