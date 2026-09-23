import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createRetailAccessToken, RETAIL_ACCESS_COOKIE, RETAIL_ACCESS_MAX_AGE_SECONDS } from "@/lib/retail-access";

const passwordsMatch = (provided: string, expected: string) => {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
};

export async function POST(request: NextRequest) {
  const { password } = (await request.json()) as { password?: string };
  const expectedPassword = process.env.VAREJO_ACCESS_PASSWORD;

  if (!expectedPassword) {
    return NextResponse.json(
      { message: "O acesso ao catálogo de varejo ainda não foi configurado." },
      { status: 503 },
    );
  }

  if (!password || !passwordsMatch(password, expectedPassword)) {
    return NextResponse.json({ message: "Senha incorreta." }, { status: 401 });
  }

  const token = createRetailAccessToken();
  if (!token) return NextResponse.json({ message: "A assinatura do acesso interno ainda não foi configurada." }, { status: 503 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(RETAIL_ACCESS_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: RETAIL_ACCESS_MAX_AGE_SECONDS,
    path: "/",
  });
  return response;
}
