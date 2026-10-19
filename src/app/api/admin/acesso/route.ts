import { NextResponse } from "next/server";
import {
  ADMIN_ACCESS_COOKIE,
  ADMIN_ACCESS_MAX_AGE_SECONDS,
  createAdminAccessToken,
  verifyAdminPin,
} from "@/lib/admin-access";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { pin?: string; password?: string };
    const provided = body.pin || body.password || "";

    if (!verifyAdminPin(provided)) {
      return NextResponse.json(
        { message: "PIN ou senha incorreta." },
        { status: 401 },
      );
    }

    const token = createAdminAccessToken();
    const response = NextResponse.json({ ok: true, message: "Acesso autorizado." });

    if (token) {
      response.cookies.set(ADMIN_ACCESS_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ADMIN_ACCESS_MAX_AGE_SECONDS,
        path: "/",
      });
    }

    return response;
  } catch {
    return NextResponse.json(
      { message: "Falha na requisição de autenticação." },
      { status: 400 },
    );
  }
}
