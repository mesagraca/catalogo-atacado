import { NextResponse } from "next/server";
import { hasAdminAccess } from "@/lib/admin-access";
import { supabaseAdmin } from "@/lib/supabase";
import { syncShopeeAds } from "@/lib/shopee-ads-sync";
import type { AdPlatform } from "@/types/dashboard";

/**
 * Endpoint de sincronizaÃ§Ã£o automÃ¡tica dos canais de mÃ­dia paga:
 * - Shopee Ads (Shopee Open Platform API v2)
 * - Meta Ads (Instagram & Facebook Insights API)
 * - Mercado Ads (Mercado Livre Product Ads)
 * - TikTok Ads (TikTok for Business API)
 *
 * @description
 * Pode ser chamado via Cron Job noturno ou sob demanda atravÃ©s do botÃ£o
 * "Sincronizar APIs de AnÃºncios" na dashboard do administrador.
 *
 * @category Admin
 * @since v4.1.0
 */
export async function POST(request: Request) {
  const isAuthorized = await hasAdminAccess();
  if (!isAuthorized) {
    return NextResponse.json({ message: "NÃ£o autorizado." }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { message: "Banco de dados indisponÃ­vel." },
      { status: 500 }
    );
  }

  let startDate: string | undefined;
  let endDate: string | undefined;
  try {
    const body = await request.json().catch(() => ({}));
    if (body?.start_date) startDate = String(body.start_date);
    if (body?.end_date) endDate = String(body.end_date);
  } catch {
    // MantÃ©m valores padrÃ£o
  }

  const syncResults: Record<
    "meta_ads" | "shopee_ads" | "mercado_ads" | "tiktok_ads",
    { success: boolean; message: string; records_imported: number }
  > = {
    shopee_ads: {
      success: false,
      message: "Iniciando sincronizaÃ§Ã£o Shopee Ads...",
      records_imported: 0,
    },
    meta_ads: {
      success: false,
      message: "Aguardando META_ACCESS_TOKEN e META_AD_ACCOUNT_ID nas variÃ¡veis de ambiente.",
      records_imported: 0,
    },
    mercado_ads: {
      success: false,
      message: "Aguardando escopo de publicidade ativo no token do Mercado Livre.",
      records_imported: 0,
    },
    tiktok_ads: {
      success: false,
      message: "Aguardando TIKTOK_ADVERTISER_ID nas variÃ¡veis de ambiente.",
      records_imported: 0,
    },
  };

  // 1. SincronizaÃ§Ã£o Shopee Ads
  try {
    const shopeeResult = await syncShopeeAds(startDate, endDate);
    syncResults.shopee_ads = {
      success: shopeeResult.success,
      message: shopeeResult.message,
      records_imported: shopeeResult.records_imported,
    };
  } catch (shopeeErr: unknown) {
    const msg = shopeeErr instanceof Error ? shopeeErr.message : String(shopeeErr);
    syncResults.shopee_ads = {
      success: false,
      message: `Erro interno Shopee Ads: ${msg}`,
      records_imported: 0,
    };
  }

  // 2. SincronizaÃ§Ã£o Meta Ads (se configurado)
  const metaToken = process.env.META_ACCESS_TOKEN;
  const metaAccountId = process.env.META_AD_ACCOUNT_ID;
  if (metaToken && metaAccountId) {
    try {
      const url = `https://graph.facebook.com/v21.0/act_${metaAccountId}/insights?fields=spend,impressions,clicks,actions&date_preset=yesterday&access_token=${metaToken}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        const data = json.data?.[0];
        if (data) {
          const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
          const payload = {
            platform: "meta_ads" as AdPlatform,
            date: yesterday,
            amount_spent: parseFloat(data.spend || "0"),
            impressions: parseInt(data.impressions || "0", 10),
            clicks: parseInt(data.clicks || "0", 10),
            conversions: (data.actions || []).find((a: any) => a.action_type === "purchase")?.value || 0,
            campaign_name: "Meta Ads Geral (Instagram / FB)",
            updated_at: new Date().toISOString(),
          };

          const { data: existing } = await supabaseAdmin
            .from("marketing_ad_spend")
            .select("id")
            .eq("platform", "meta_ads")
            .eq("date", yesterday)
            .maybeSingle();

          if (existing?.id) {
            await supabaseAdmin.from("marketing_ad_spend").update(payload).eq("id", existing.id);
          } else {
            await supabaseAdmin.from("marketing_ad_spend").insert(payload);
          }

          syncResults.meta_ads = {
            success: true,
            message: "Dados sincronizados com sucesso da Meta Graph API.",
            records_imported: 1,
          };
        }
      } else {
        syncResults.meta_ads = {
          success: false,
          message: `Erro na API da Meta: HTTP ${res.status}`,
          records_imported: 0,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      syncResults.meta_ads = {
        success: false,
        message: `Falha na requisiÃ§Ã£o Meta: ${msg}`,
        records_imported: 0,
      };
    }
  }

  return NextResponse.json({
    message: "VerificaÃ§Ã£o de sincronizaÃ§Ã£o de anÃºncios executada.",
    synced_at: new Date().toISOString(),
    results: syncResults,
  });
}
