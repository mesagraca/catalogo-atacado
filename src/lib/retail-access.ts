import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export const RETAIL_ACCESS_COOKIE = "mesa_graca_varejo_access";
export const RETAIL_ACCESS_MAX_AGE_SECONDS = 60 * 60 * 12;

const signingSecret = () => process.env.VAREJO_ACCESS_COOKIE_SECRET ?? process.env.VAREJO_ACCESS_PASSWORD;
const signature = (issuedAt: string, secret: string) =>
  createHmac("sha256", secret).update(`mesa-graca-varejo:v1:${issuedAt}`).digest("base64url");

export function createRetailAccessToken(now = Date.now()) {
  const secret = signingSecret();
  if (!secret) return null;
  const issuedAt = String(now);
  return `v1.${issuedAt}.${signature(issuedAt, secret)}`;
}

const safelyMatches = (provided: string, expected: string) => {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
};

export async function hasRetailAccess() {
  const token = (await cookies()).get(RETAIL_ACCESS_COOKIE)?.value;
  const secret = signingSecret();
  if (!token || !secret) return false;
  const [version, issuedAt, providedSignature, ...rest] = token.split(".");
  if (version !== "v1" || !issuedAt || !providedSignature || rest.length || !/^\d+$/.test(issuedAt)) return false;
  const issuedAtMs = Number(issuedAt);
  if (!Number.isSafeInteger(issuedAtMs) || issuedAtMs > Date.now() || Date.now() - issuedAtMs > RETAIL_ACCESS_MAX_AGE_SECONDS * 1000) return false;
  return safelyMatches(providedSignature, signature(issuedAt, secret));
}
