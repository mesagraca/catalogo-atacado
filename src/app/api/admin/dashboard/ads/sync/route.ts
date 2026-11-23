import { NextResponse } from "next/server";
import { hasAdminAccess } from "@/lib/admin-access";
import { supabaseAdmin } from "@/lib/supabase";
import { syncShopeeAds } from "@/lib/shopee-ads-sync";
import { syncMetaAds } from "@/lib/meta-ads-sync";
import type { AdPlatform } from "@/types/dashboard";

/**
 * Endpoint de sincronizacao automatica dos canais de midia paga:
 * - Shopee Ads (Shopee Open Platform API v2)
 * - Meta Ads (Instagram & Facebook Insights API)
 * - Mercado Ads (Mercado Livre Product Ads)
 * - TikTok Ads (TikTok for Business API)
 *
 * @description
 * Pode ser chamado via Cron Job noturno ou sob demanda atraves do botao
 * "Sincronizar APIs de Anuncios" na dashboard do administrador.
 *
 * @category Admin
 * @since v4.1.0
 */
export async function POST(request: Request) {
  const isAuthorized = await hasAdminAccess();
  if (!isAuthorized) {
    return NextResponse.json({ message: "Nao autorizado." }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { message: "Banco de dados indisponivel." },
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
    // Mantem valores padrao
  }

  const syncResults: Record<
    "meta_ads" | "shopee_ads" | "mercado_ads" | "tiktok_ads",
    { success: boolean; message: string; records_imported: number }
  > = {
    shopee_ads: {
      success: false,
      message: "Iniciando sincronizacao Shopee Ads...",
      records_imported: 0,
    },
    meta_ads: {
      success: false,
      message: "Iniciando sincronizacao Meta Ads...",
      records_imported: 0,
    },
    mercado_ads: {
      success: false,
      message: "Aguardando escopo de publicidade ativo no token do Mercado Livre.",
      records_imported: 0,
    },
    tiktok_ads: {
      success: false,
      message: "Aguardando TIKTOK_ADVERTISER_ID nas variaveis de ambiente.",
      records_imported: 0,
    },
  };

  // 1. Sincronizacao Shopee Ads
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

  // 2. Sincronizacao Meta Ads (Instagram / FB)
  try {
    const metaResult = await syncMetaAds(startDate, endDate);
    syncResults.meta_ads = {
      success: metaResult.success,
      message: metaResult.message,
      records_imported: metaResult.records_imported,
    };
  } catch (metaErr: unknown) {
    const msg = metaErr instanceof Error ? metaErr.message : String(metaErr);
    syncResults.meta_ads = {
      success: false,
      message: `Erro interno Meta Ads: ${msg}`,
      records_imported: 0,
    };
  }

  return NextResponse.json({
    message: "Verificacao de sincronizacao de anuncios executada.",
    synced_at: new Date().toISOString(),
    results: syncResults,
  });
}
