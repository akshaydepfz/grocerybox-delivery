import { NextRequest, NextResponse } from "next/server";

import { apiBaseUrl } from "@/config/api-config";

import {
  DELIVERY_PARTNER_SESSION_COOKIE,
  DELIVERY_PARTNER_SESSION_MAX_AGE_SECONDS,
} from "./delivery-session-cookie";

export type DeliveryAuthProxyAction = "login" | "me" | "logout";

const ALLOWED: Record<DeliveryAuthProxyAction, Set<string>> = {
  login: new Set(["POST"]),
  me: new Set(["GET"]),
  logout: new Set(["POST"]),
};

function upstreamAuthUrl(action: DeliveryAuthProxyAction): string {
  return `${apiBaseUrl}/api/v1/delivery/auth/${action}`;
}

function extractSessionCookieValue(setCookieHeader: string): {
  value: string | null;
  maxAge?: number;
} | null {
  if (!setCookieHeader.includes(`${DELIVERY_PARTNER_SESSION_COOKIE}=`)) {
    return null;
  }

  const valueMatch = setCookieHeader.match(
    new RegExp(`${DELIVERY_PARTNER_SESSION_COOKIE}=([^;]*)`),
  );
  if (!valueMatch) {
    return null;
  }

  const rawValue = valueMatch[1]?.trim() ?? "";
  const maxAgeMatch = setCookieHeader.match(/Max-Age=(\d+)/i);
  const maxAge = maxAgeMatch ? Number(maxAgeMatch[1]) : undefined;

  return {
    value: rawValue,
    maxAge,
  };
}

export function applySessionCookieFromUpstream(
  upstream: Response,
  response: NextResponse,
): void {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
  };

  const setCookieHeaders =
    typeof upstream.headers.getSetCookie === "function"
      ? upstream.headers.getSetCookie()
      : [];

  const legacyHeader = upstream.headers.get("set-cookie");
  if (legacyHeader && setCookieHeaders.length === 0) {
    setCookieHeaders.push(legacyHeader);
  }

  for (const header of setCookieHeaders) {
    const parsed = extractSessionCookieValue(header);
    if (!parsed) {
      continue;
    }

    const { value, maxAge } = parsed;
    const shouldClear =
      value === "" || value === '""' || (maxAge !== undefined && maxAge <= 0);

    if (shouldClear || value === null) {
      response.cookies.set(DELIVERY_PARTNER_SESSION_COOKIE, "", {
        ...cookieOptions,
        maxAge: 0,
      });
      continue;
    }

    response.cookies.set(DELIVERY_PARTNER_SESSION_COOKIE, value, {
      ...cookieOptions,
      maxAge: maxAge ?? DELIVERY_PARTNER_SESSION_MAX_AGE_SECONDS,
    });
  }
}

export async function proxyDeliveryAuthRequest(
  request: NextRequest,
  action: DeliveryAuthProxyAction,
): Promise<NextResponse> {
  const allowedMethods = ALLOWED[action];
  if (!allowedMethods.has(request.method)) {
    return NextResponse.json(
      { success: false, message: "Method not allowed" },
      { status: 405 },
    );
  }

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

  const upstream = await fetch(upstreamAuthUrl(action), upstreamInit);
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