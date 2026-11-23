import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { supabaseAdmin } from "@/lib/supabase";

export interface TraySession {
  api_base: string;
  access_token: string;
  refresh_token: string;
  date_expiration_access_token?: string;
  date_expiration_refresh_token?: string;
  updated_at?: string;
}

let cachedSession: TraySession | null = null;
let refreshPromise: Promise<TraySession> | null = null;

const LOCAL_SESSION_PATH = "C:\\Users\\nando\\.gemini\\tray-api-ai-plugin\\.tray_session.json";
const REFRESH_MARGIN_MINUTES = 30; // Margem preventiva solicitada: 30 minutos

/**
 * Normaliza a URL base da API da Tray Commerce.
 *
 * @description
 * Garante que a URL comece com protocolo seguro https:// e termine com o caminho /web_api.
 *
 * @param {string} raw - URL original fornecida pela Tray ou configuração
 * @returns {string} URL normalizada com /web_api
 * @example
 * const base = normalizeApiBase("4evmjyex.commercesuite.com.br");
 * // => "https://4evmjyex.commercesuite.com.br/web_api"
 * @category Integrations
 * @since v3.0.0
 */
function normalizeApiBase(raw: string): string {
  let clean = raw.trim();
  if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
    clean = `https://${clean}`;
  }
  if (!clean.includes("/web_api")) {
    clean = clean.replace(/\/+$/, "") + "/web_api";
  }
  return clean.replace(/\/+$/, "");
}

/**
 * Converte a string de data da Tray para timestamp em milissegundos.
 *
 * @description
 * A API da Tray retorna datas no fuso horário de Brasília (UTC-3), no formato
 * "YYYY-MM-DD HH:mm:ss" ou formato ISO. Esta função padroniza para timestamp Unix.
 *
 * @param {string} [dateStr] - String de data informada pela Tray
 * @returns {number | null} Timestamp em milissegundos ou null se inválida
 * @category Integrations
 * @since v3.1.0
 */
function parseTrayDate(dateStr?: string): number | null {
  if (!dateStr || typeof dateStr !== "string") return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // Se já possui fuso ou T, tenta converter diretamente
  if (trimmed.includes("T") || trimmed.includes("Z")) {
    const ts = Date.parse(trimmed);
    return isNaN(ts) ? null : ts;
  }

  // Formato típico da Tray: "2026-11-23 16:24:50" (Horário de Brasília UTC-3)
  const isoWithBrTimezone = trimmed.replace(" ", "T") + "-03:00";
  const ts = Date.parse(isoWithBrTimezone);
  return isNaN(ts) ? null : ts;
}

/**
 * Verifica se o access_token está prestes a expirar dentro da margem de segurança.
 *
 * @description
 * Compara o timestamp de expiração da sessão com o horário atual acrescido
 * da margem de segurança configurada (padrão de 30 minutos).
 *
 * @param {TraySession} session - Sessão com as datas de expiração
 * @param {number} [marginMinutes=30] - Margem preventiva em minutos
 * @returns {boolean} True se o token estiver expirado ou expirar na margem
 * @category Integrations
 * @since v3.1.0
 */
export function isTokenExpiringSoon(session: TraySession, marginMinutes = REFRESH_MARGIN_MINUTES): boolean {
  if (!session.access_token) return true;
  if (!session.date_expiration_access_token) return false;

  const expirationTs = parseTrayDate(session.date_expiration_access_token);
  if (!expirationTs) return false;

  const now = Date.now();
  const marginMs = marginMinutes * 60 * 1000;
  return now + marginMs >= expirationTs;
}

/**
 * Salva a sessão atualizada na memória, no Supabase e em disco se disponível.
 *
 * @description
 * Persiste atomicamente as credenciais na tabela `tray_session` do Supabase para que
 * todas as instâncias em nuvem (Vercel) compartilhem a mesma credencial ativa.
 *
 * @param {TraySession} session - Nova sessão a ser persistida
 * @returns {Promise<void>}
 * @category Integrations
 * @since v3.0.0
 */
async function saveTraySession(session: TraySession): Promise<void> {
  cachedSession = session;

  // 1. Persistir no Supabase PostgreSQL (para nuvem / Vercel Serverless)
  if (supabaseAdmin) {
    try {
      await supabaseAdmin
        .from("tray_session")
        .upsert(
          {
            id: "default",
            api_base: session.api_base,
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            date_expiration_access_token: session.date_expiration_access_token || "",
            date_expiration_refresh_token: session.date_expiration_refresh_token || "",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" },
        );
    } catch {
      // continua para fallback local
    }
  }

  // 2. Persistir no arquivo local de desenvolvimento
  try {
    if (existsSync(LOCAL_SESSION_PATH)) {
      writeFileSync(LOCAL_SESSION_PATH, JSON.stringify(session, null, 2), "utf-8");
    }
  } catch {
    // filesystem read-only (ex: Vercel)
  }
}

/**
 * Carrega a sessão ativa da Tray Commerce direto do banco de dados ou ambiente.
 *
 * @param {boolean} [forceRefresh=false] - Força a busca no Supabase ignorando cache em memória
 * @returns {Promise<TraySession | null>} Sessão ativa ou nula
 * @category Integrations
 * @since v3.0.0
 */
export async function getTraySession(forceRefresh = false): Promise<TraySession | null> {
  if (!forceRefresh && cachedSession) return cachedSession;

  // 1. Tentar ler do Supabase (banco compartilhado oficial)
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("tray_session")
        .select("*")
        .eq("id", "default")
        .maybeSingle();

      if (!error && data && data.access_token) {
        cachedSession = {
          api_base: normalizeApiBase(data.api_base),
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          date_expiration_access_token: data.date_expiration_access_token,
          date_expiration_refresh_token: data.date_expiration_refresh_token,
          updated_at: data.updated_at,
        };
        return cachedSession;
      }
    } catch {
      // prossegue para os fallbacks
    }
  }

  // 2. Tentar ler de variável JSON na nuvem
  if (process.env.TRAY_SESSION_JSON) {
    try {
      cachedSession = JSON.parse(process.env.TRAY_SESSION_JSON) as TraySession;
      return cachedSession;
    } catch {
      // prossegue
    }
  }

  // 3. Tentar ler do arquivo local em disco
  if (existsSync(LOCAL_SESSION_PATH)) {
    try {
      cachedSession = JSON.parse(readFileSync(LOCAL_SESSION_PATH, "utf-8")) as TraySession;
      return cachedSession;
    } catch {
      // prossegue
    }
  }

  // 4. Fallback para variáveis de ambiente avulsas
  const base = process.env.TRAY_API_BASE;
  const access = process.env.TRAY_ACCESS_TOKEN;
  const refresh = process.env.TRAY_REFRESH_TOKEN;

  if (base && (access || refresh)) {
    cachedSession = {
      api_base: normalizeApiBase(base),
      access_token: access || "",
      refresh_token: refresh || "",
      updated_at: new Date().toISOString(),
    };
    return cachedSession;
  }

  return null;
}

/**
 * Executa a chamada HTTP de renovação do refresh_token na API da Tray.
 *
 * @param {TraySession} session - Sessão atual
 * @returns {Promise<TraySession>} Sessão renovada
 * @throws {Error} Se a Tray recusar a renovação
 * @category Integrations
 * @since v3.1.0
 */
async function executeRefreshHttp(session: TraySession): Promise<TraySession> {
  const url = new URL(`${session.api_base}/auth`);
  url.searchParams.set("refresh_token", session.refresh_token);

  const res = await fetch(url.toString(), { method: "GET" });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Falha ao renovar token Tray (HTTP ${res.status}): ${errorText}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    refresh_token: string;
    date_expiration_access_token?: string;
    date_expiration_refresh_token?: string;
  };

  const updated: TraySession = {
    ...session,
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    date_expiration_access_token: data.date_expiration_access_token,
    date_expiration_refresh_token: data.date_expiration_refresh_token,
    updated_at: new Date().toISOString(),
  };

  await saveTraySession(updated);
  return updated;
}

/**
 * Renova o access_token utilizando Mutex / Lock Singleton para prevenir condições de corrida.
 *
 * @description
 * Garante que apenas UMA requisição faça o handshake com a Tray Commerce por vez.
 * Se múltiplas requisições paralelas detectarem a necessidade de renovação, todas
 * aguardarão a mesma Promise compartilhada. Antes de chamar a Tray, verifica se outra
 * instância da Vercel já efetuou a renovação no Supabase nos últimos segundos.
 *
 * @param {TraySession} [currentSession] - Sessão atual opcional
 * @returns {Promise<TraySession>} Sessão renovada e válida
 * @category Integrations
 * @since v3.1.0
 */
export async function refreshTrayTokenSafe(currentSession?: TraySession): Promise<TraySession> {
  if (refreshPromise) {
    return await refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      // 1. Verificar se outra instância acabou de salvar um token válido no Supabase
      const dbSession = await getTraySession(true);
      if (dbSession && !isTokenExpiringSoon(dbSession, REFRESH_MARGIN_MINUTES)) {
        cachedSession = dbSession;
        return dbSession;
      }

      const sessionToRefresh = currentSession || dbSession;
      if (!sessionToRefresh || !sessionToRefresh.refresh_token) {
        throw new Error("Não há refresh_token disponível para renovar a sessão da Tray.");
      }

      const refreshed = await executeRefreshHttp(sessionToRefresh);
      return refreshed;
    } finally {
      refreshPromise = null;
    }
  })();

  return await refreshPromise;
}

/**
 * Obtém uma sessão da Tray Commerce garantidamente válida com margem de 30 minutos.
 *
 * @description
 * Realiza renovação preventiva em background caso o token esteja a menos de 30 minutos
 * da expiração, eliminando interrupções no carregamento do painel administrativo.
 *
 * @returns {Promise<TraySession>} Sessão pronta para consumo
 * @throws {Error} Se a sessão for inexistente ou irrecuperável
 * @category Integrations
 * @since v3.1.0
 */
export async function getValidTraySession(): Promise<TraySession> {
  let session = await getTraySession();
  if (!session) {
    throw new Error("Sessão da Tray Commerce não configurada.");
  }

  // Renovação preventiva automática com margem de 30 minutos
  if (isTokenExpiringSoon(session, REFRESH_MARGIN_MINUTES)) {
    session = await refreshTrayTokenSafe(session);
  }

  return session;
}

/**
 * Executa uma requisição autenticada contra a API da Tray Commerce com renovação preventiva e defensiva.
 *
 * @template T - Tipo esperado do retorno
 * @param {string} endpoint - Caminho relativo (ex: 'orders?limit=50')
 * @param {RequestInit} [options] - Opções fetch opcionais
 * @returns {Promise<T>} Resposta parseada em JSON
 * @throws {Error} Se a requisição falhar após renovação
 * @example
 * const orders = await trayApiFetch<{ Orders: any[] }>("orders?limit=10");
 * @category Integrations
 * @since v3.0.0
 */
export async function trayApiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let session = await getValidTraySession();

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const separator = cleanEndpoint.includes("?") ? "&" : "?";
  let url = `${session.api_base}/${cleanEndpoint}${separator}access_token=${session.access_token}`;

  let res = await fetch(url, options);

  // Se por algum motivo externo ainda retornar 401 Unauthorized, tenta renovar forçadamente via Mutex
  if (res.status === 401 && session.refresh_token) {
    session = await refreshTrayTokenSafe(session);
    url = `${session.api_base}/${cleanEndpoint}${separator}access_token=${session.access_token}`;
    res = await fetch(url, options);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro Tray API (HTTP ${res.status}): ${text}`);
  }

  return (await res.json()) as T;
}
