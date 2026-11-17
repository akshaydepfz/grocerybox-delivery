export function validateLoginPhone(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Phone number is required.";
  }

  const digits = trimmed.replace(/\D/g, "");
  const normalized =
    digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;

  if (normalized.length === 10 && /^[6-9]\d{9}$/.test(normalized)) {
    return null;
  }

  return "Enter a valid 10-digit mobile number.";
}

export function validateLoginPassword(value: string): string | null {
  if (!value) {
    return "Password is required.";
  }
  if (value.length < 8) {
    return "Password must be at least 8 characters.";
  }
  return null;
}

export function isLoginFormValid(phone: string, password: string): boolean {
  return (
    validateLoginPhone(phone) === null &&
    validateLoginPassword(password) === null
  );
}