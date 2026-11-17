/** HttpOnly session cookie mirrored on the Next.js app origin (BFF auth proxy). */
export const DELIVERY_PARTNER_SESSION_COOKIE = "delivery_partner_session";

/** Matches backend default when Max-Age is not present on Set-Cookie. */
export const DELIVERY_PARTNER_SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;