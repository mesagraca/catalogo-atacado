/**
 * Meta Graph API v21.0 - Ads Sync Service
 * Sincronizador automatico de metricas diarias de anuncios da Meta (Instagram & Facebook Ads) para a Dashboard.
 *
 * @description
 * 1. Conecta a Meta Graph API v21.0 no endpoint `GET /act_{ad_account_id}/insights`.
 * 2. Solicita os dados com `time_increment=1` para particionar e coletar dia a dia.
 * 3. Extrai spend, impressions, clicks, cpc, ctr e conversoes de compras (purchases).
 * 4. Persiste de forma idempotente na tabela `marketing_ad_spend` do Supabase.
 *
 * @category Admin/Integrations
 * @since v4.1.0
 */

import { supabaseAdmin } from "@/lib/supabase";
import type { AdPlatform } from "@/types/dashboard";

export interface MetaDailyInsight {
  date_start: string; // "YYYY-MM-DD"
  date_stop: string;
  spend: string;
  impressions: string;
  clicks: string;
  cpc?: string;
  cpm?: string;
  ctr?: string;
  actions?: Array<{
    action_type: string;
    value: string;
  }>;
  action_values?: Array<{
    action_type: string;
    value: string;
  }>;
}

export interface MetaSyncResult {
  success: boolean;
  message: string;
  records_imported: number;
  total_spend: number;
  date_range: {
    start: string;
    end: string;
  };
}

/**
 * Converte o ID da conta da Meta garantindo o formato limpo numÃ©rico.
 *
 * @param {string} rawId - ID informado (com ou sem prefixo act_)
 * @returns {string} ID sem prefixo
 */
export function normalizeMetaAccountId(rawId: string): string {
  return rawId.trim().replace(/^act_/i, "");
}

/**
 * Executa a sincronizacao oficial das metricas de Meta Ads no periodo especificado.
 *
 * @param {string} [startDateIso] - Data inicial em YYYY-MM-DD
 * @param {string} [endDateIso] - Data final em YYYY-MM-DD
 * @returns {Promise<MetaSyncResult>} Resultado consolidado da importacao
 */
export async function syncMetaAds(
  startDateIso?: string,
  endDateIso?: string
): Promise<MetaSyncResult> {
  const token = process.env.META_ACCESS_TOKEN;
  const rawAccountId = process.env.META_AD_ACCOUNT_ID;

  if (!token || !rawAccountId) {
    return {
      success: false,
      message: "Credenciais da Meta nao configuradas no ambiente (META_ACCESS_TOKEN e META_AD_ACCOUNT_ID).",
      records_imported: 0,
      total_spend: 0,
      date_range: { start: startDateIso || "", end: endDateIso || "" },
    };
  }

  if (!supabaseAdmin) {
    return {
      success: false,
      message: "Supabase Admin indisponivel para persistencia.",
      records_imported: 0,
      total_spend: 0,
      date_range: { start: startDateIso || "", end: endDateIso || "" },
    };
  }

  const accountId = normalizeMetaAccountId(rawAccountId);

  const now = new Date();
  const defaultEnd = now.toISOString().split("T")[0];
  const defaultStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const startIso = startDateIso || defaultStart;
  const endIso = endDateIso || defaultEnd;

  const timeRange = JSON.stringify({ since: startIso, until: endIso });
  const fields = "spend,impressions,clicks,cpc,cpm,ctr,actions,action_values";

  const url = `https://graph.facebook.com/v21.0/act_${accountId}/insights?time_range=${encodeURIComponent(
    timeRange
  )}&time_increment=1&fields=${fields}&limit=100&access_token=${token}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();

    if (!res.ok || json.error) {
      const errorMsg = json.error?.message || `HTTP ${res.status}`;
      return {
        success: false,
        message: `Erro na Meta Graph API: ${errorMsg}`,
        records_imported: 0,
        total_spend: 0,
        date_range: { start: startIso, end: endIso },
      };
    }

    const insights: MetaDailyInsight[] = json.data || [];
    let recordsImported = 0;
    let totalSpend = 0;

    for (const item of insights) {
      const dateIso = item.date_start;
      const spendNum = parseFloat(item.spend || "0");
      const impsNum = parseInt(item.impressions || "0", 10);
      const clicksNum = parseInt(item.clicks || "0", 10);

      // ConversÃµes de compras (purchases)
      const purchaseAction = (item.actions || []).find(
        (a) => a.action_type === "purchase" || a.action_type === "omni_purchase"
      );
      const conversionsNum = purchaseAction ? parseInt(purchaseAction.value || "0", 10) : 0;

      // Faturamento atribuÃ­do
      const purchaseValueAction = (item.action_values || []).find(
        (a) => a.action_type === "purchase" || a.action_type === "omni_purchase"
      );
      const revenueNum = purchaseValueAction ? parseFloat(purchaseValueAction.value || "0") : 0;

      totalSpend += spendNum;

      const payload = {
        platform: "meta_ads" as AdPlatform,
        date: dateIso,
        amount_spent: parseFloat(spendNum.toFixed(2)),
        impressions: impsNum,
        clicks: clicksNum,
        conversions: conversionsNum,
        campaign_name: "Meta Ads (Instagram / FB)",
        notes: revenueNum > 0 ? `Receita Atribuida: R$ ${revenueNum.toFixed(2)}` : "",
        updated_at: new Date().toISOString(),
      };

      const { data: existing } = await supabaseAdmin
        .from("marketing_ad_spend")
        .select("id")
        .eq("platform", "meta_ads")
        .eq("date", dateIso)
        .maybeSingle();

      if (existing?.id) {
        await supabaseAdmin
          .from("marketing_ad_spend")
          .update(payload)
          .eq("id", existing.id);
      } else {
        await supabaseAdmin.from("marketing_ad_spend").insert(payload);
      }

      recordsImported++;
    }

    const successMessage = recordsImported > 0
      ? `Sincronizacao Meta Ads concluida com sucesso. ${recordsImported} dias importados (Total: R$ ${totalSpend.toFixed(2)}).`
      : `Sincronizacao Meta Ads concluida. Conta consultada com sucesso (sem investimento no periodo selecionado).`;

    return {
      success: true,
      message: successMessage,
      records_imported: recordsImported,
      total_spend: parseFloat(totalSpend.toFixed(2)),
      date_range: { start: startIso, end: endIso },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Falha na conexao com a Meta Graph API: ${msg}`,
      records_imported: 0,
      total_spend: 0,
      date_range: { start: startIso, end: endIso },
    };
  }
}
