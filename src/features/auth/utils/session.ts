export function resolveSignedInEmail(email?: string | null): string {
  const trimmed = email?.trim();
  return trimmed?.length ? trimmed : "";
}