import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_ACCESS_COOKIE = "mesa_graca_admin_access";
export const ADMIN_ACCESS_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 horas

const getAdminSecret = () =>
  process.env.ADMIN_PIN ||
  process.env.VAREJO_ACCESS_PASSWORD ||
  "mesagraca2026";

const signature = (issuedAt: string, secret: string) =>
  createHmac("sha256", secret)
    .update(`mesa-graca-admin:v1:${issuedAt}`)
    .digest("base64url");

export function createAdminAccessToken(now = Date.now()) {
  const secret = getAdminSecret();
  const issuedAt = String(now);
  return `v1.${issuedAt}.${signature(issuedAt, secret)}`;
}

const safelyMatches = (provided: string, expected: string) => {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
};

export async function hasAdminAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_ACCESS_COOKIE)?.value;
  const secret = getAdminSecret();

  if (!token || !secret) return false;

  const [version, issuedAt, providedSignature, ...rest] = token.split(".");
  if (
    version !== "v1" ||
    !issuedAt ||
    !providedSignature ||
    rest.length ||
    !/^\d+$/.test(issuedAt)
  )
    return false;

  const issuedAtMs = Number(issuedAt);
  if (
    !Number.isSafeInteger(issuedAtMs) ||
    issuedAtMs > Date.now() ||
    Date.now() - issuedAtMs > ADMIN_ACCESS_MAX_AGE_SECONDS * 1000
  )
    return false;

  return safelyMatches(providedSignature, signature(issuedAt, secret));
}

export function verifyAdminPin(providedPin: string): boolean {
  const correct = getAdminSecret();
  return safelyMatches(providedPin.trim(), correct.trim());
}
