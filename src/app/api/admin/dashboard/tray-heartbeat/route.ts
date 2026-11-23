import { NextResponse } from "next/server";
import { getValidTraySession, getTraySession, isTokenExpiringSoon } from "@/lib/tray-client";

/**
 * Endpoint de monitoramento e renovação automática (Heartbeat) da sessão da Tray Commerce.
 *
 * @description
 * 1. Verifica o status do token de acesso e do refresh token.
 * 2. Se o token estiver a menos de 30 minutos de expirar, renova preventivamente via Mutex.
 * 3. Retorna diagnóstico completo de conectividade para jobs de automação e painel de controle.
 *
 * @returns {Promise<NextResponse>} Resumo do estado da sessão
 * @category Integrations
 * @since v3.1.0
 */
export async function GET() {
  try {
    const initialSession = await getTraySession(true);
    if (!initialSession) {
      return NextResponse.json(
        { ok: false, message: "Nenhuma sessão da Tray Commerce configurada." },
        { status: 404 },
      );
    }

    const wasExpiringSoon = isTokenExpiringSoon(initialSession, 30);
    const validSession = await getValidTraySession();

    return NextResponse.json({
      ok: true,
      message: wasExpiringSoon
        ? "Token da Tray Commerce renovado preventivamente com sucesso."
        : "Sessão da Tray Commerce saudável e ativa.",
      was_renewed: wasExpiringSoon,
      api_base: validSession.api_base,
      date_expiration_access_token: validSession.date_expiration_access_token,
      date_expiration_refresh_token: validSession.date_expiration_refresh_token,
      updated_at: validSession.updated_at,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, error: errorMsg, message: "Falha na verificação de integridade da Tray." },
      { status: 500 },
    );
  }
}
