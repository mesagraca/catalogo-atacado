import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { hasAdminAccess } from "@/lib/admin-access";
import { trayApiFetch } from "@/lib/tray-client";
import { resolveExactProductCost } from "@/lib/sheet-costs";
import type {
  DashboardResponse,
  SalesChannel,
  AdPlatform,
  ChannelPerformance,
  ProductProfitSummary,
  AdSpendSummary,
  AdSpendRecord,
} from "@/types/dashboard";

export const dynamic = "force-dynamic";

interface TrayOrderItem {
  Order: {
    id: string;
    date: string;
    point_sale: string;
    status: string;
    total: string;
    partial_total: string;
    discount?: string;
    payment_method_rate?: string;
    Customer?: {
      city?: string;
      state?: string;
    };
  };
}

interface TrayCompleteOrder {
  Order: {
    id: string;
    date: string;
    hour?: string;
    point_sale: string;
    status: string;
    shipment?: string;
    total: string;
    partial_total: string;
    shipment_value?: string;
    discount?: string;
    taxes?: string;
    ProductsSold?: Array<{
      ProductsSold: {
        product_id: string;
        name: string;
        reference: string;
        price: string;
        quantity: string;
        cost_price?: string;
        url?: {
          http?: string;
          https?: string;
        };
        ProductSoldImage?: Array<{
          http?: string;
          https?: string;
          thumbs?: {
            "30"?: { http?: string; https?: string };
            "90"?: { http?: string; https?: string };
            "180"?: { http?: string; https?: string };
          };
        }>;
      };
    }>;
    Customer?: {
      city?: string;
      state?: string;
    };
  };
}

const COMMISSION_RATES: Record<SalesChannel, number> = {
  shopee: 0.18,
  mercadolivre: 0.16,
  tiktok: 0.07,
  site: 0.035,
};

const CHANNEL_LABELS: Record<SalesChannel, string> = {
  site: "Loja Virtual",
  shopee: "Shopee",
  mercadolivre: "Mercado Livre",
  tiktok: "TikTok Shop",
};

/**
 * Normaliza a string do ponto de venda da Tray para o identificador do canal.
 *
 * @param {string} raw - Nome original vindo do pedido
 * @returns {SalesChannel} Identificador canônico do canal
 * @category Dashboard
 * @since v3.0.0
 */
function resolveSalesChannel(raw?: string): SalesChannel {
  const norm = (raw || "").toUpperCase();
  if (norm.includes("SHOPEE")) return "shopee";
  if (norm.includes("MERCADO")) return "mercadolivre";
  if (norm.includes("TIKTOK")) return "tiktok";
  return "site";
}

/**
 * Endpoint consolidado de métricas financeiras, vendas e anúncios.
 *
 * @description
 * 1. Valida o acesso administrativo via hasAdminAccess()
 * 2. Carrega tabela de custos do catálogo no Supabase
 * 3. Busca pedidos da Tray Commerce do período solicitado
 * 4. Cruza produtos vendidos com o CMV (Custo da Mercadoria Vendida) e imagem
 * 5. Deduz comissões por canal e calcula margem e lucro líquido
 * 6. Agrega histórico de anúncios (marketing_ad_spend) e calcula ROAS
 *
 * @param {Request} request - Requisição HTTP com parâmetros ?days=X&channel=Y
 * @returns {Promise<NextResponse>} Payload completo DashboardResponse
 * @category Dashboard
 * @since v3.0.0
 */
export async function GET(request: Request) {
  const isAuthorized = await hasAdminAccess();
  if (!isAuthorized) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = Math.max(1, Number(searchParams.get("days") || 30));
  const channelFilter = searchParams.get("channel") || "all";
  const statusParam = searchParams.get("status") || "all"; // "all" ou "approved"

  const startDateObj = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const startDate = startDateObj.toISOString().split("T")[0];
  const endDate = new Date().toISOString().split("T")[0];

  try {
    // 1. Carregar produtos do Supabase para mapa de custos, imagens e estoque
    const costMapByTrayId = new Map<
      number,
      { cost: number; sku: string; name: string; image_url?: string; stock?: number }
    >();
    const costMapBySku = new Map<
      string,
      { cost: number; name: string; image_url?: string; stock?: number }
    >();

    if (supabaseAdmin) {
      const { data: dbProducts } = await supabaseAdmin
        .from("produtos")
        .select("id, name, sku, cost_price, tray_product_id, media, stock");

      if (dbProducts) {
        for (const p of dbProducts) {
          const cost = Number(p.cost_price || 0);
          let image_url: string | undefined = undefined;
          if (Array.isArray(p.media) && p.media.length > 0) {
            const first = p.media[0];
            image_url = typeof first === "string" ? first : (first?.url || first?.https || first?.http);
          }
          const stock = p.stock != null ? Number(p.stock) : undefined;
          if (p.tray_product_id) {
            costMapByTrayId.set(Number(p.tray_product_id), { cost, sku: p.sku, name: p.name, image_url, stock });
          }
          if (p.sku) {
            costMapBySku.set(p.sku.toUpperCase(), { cost, name: p.name, image_url, stock });
          }
        }
      }
    }

    // 2. Buscar pedidos na Tray
    const ordersListRes = await trayApiFetch<{ Orders?: TrayOrderItem[] }>(
      "orders?sort=id_desc&limit=50",
    );
    const rawOrders = ordersListRes.Orders || [];

    // Calcular KPIs oficiais idênticos aos do painel da Tray
    const periodOrders = rawOrders.filter((o) => {
      const orderDate = o.Order.date;
      return orderDate >= startDate;
    });

    let trayTotalOrdersRevenue = 0;
    let trayProductsSoldRevenue = 0;
    let trayActiveCount = 0;
    let trayActiveRevenue = 0;
    let trayCancelledCount = 0;
    let trayCancelledRevenue = 0;

    for (const item of periodOrders) {
      const o = item.Order;
      const tot = Number(o.total || o.partial_total || 0);
      const part = Number(o.partial_total || 0);
      const isCancelled = (o.status || "").toUpperCase().includes("CANCELADO");

      trayTotalOrdersRevenue += tot;
      trayProductsSoldRevenue += part;

      if (isCancelled) {
        trayCancelledCount += 1;
        trayCancelledRevenue += tot;
      } else {
        trayActiveCount += 1;
        trayActiveRevenue += tot;
      }
    }

    const trayAvgTicket =
      periodOrders.length > 0 ? trayTotalOrdersRevenue / periodOrders.length : 0;

    // Filtrar pedidos para a apuração conforme o status selecionado
    const validOrders = periodOrders.filter((o) => {
      const status = (o.Order.status || "").toUpperCase();
      if (statusParam === "approved" && status.includes("CANCELADO")) return false;
      return true;
    });

    // 3. Buscar detalhes completos dos pedidos para analisar produtos vendidos
    const completeOrders: TrayCompleteOrder[] = [];
    const concurrency = 5;

    for (let i = 0; i < validOrders.length; i += concurrency) {
      const chunk = validOrders.slice(i, i + concurrency);
      const chunkPromises = chunk.map(async (o) => {
        try {
          return await trayApiFetch<TrayCompleteOrder>(`orders/${o.Order.id}/complete`);
        } catch {
          return null;
        }
      });
      const resolved = await Promise.all(chunkPromises);
      for (const item of resolved) {
        if (item && item.Order) completeOrders.push(item);
      }
    }

    // 4. Estruturas para acumulação
    const channelStats: Record<
      SalesChannel,
      { count: number; gross: number; cost: number; commissions: number }
    > = {
      site: { count: 0, gross: 0, cost: 0, commissions: 0 },
      shopee: { count: 0, gross: 0, cost: 0, commissions: 0 },
      mercadolivre: { count: 0, gross: 0, cost: 0, commissions: 0 },
      tiktok: { count: 0, gross: 0, cost: 0, commissions: 0 },
    };

    const productStats = new Map<
      string,
      {
        id: string | number;
        sku: string;
        name: string;
        image_url?: string;
        stock_quantity?: number;
        channel: SalesChannel;
        units: number;
        revenue: number;
        cost: number;
        commissions: number;
      }
    >();

    const recentOrdersList: DashboardResponse["recent_orders"] = [];
    const dailyMap = new Map<
      string,
      { date: string; gross_revenue: number; net_profit: number; orders_count: number }
    >();

    let totalGrossRevenue = 0;
    let totalCmvCost = 0;
    let totalCommissions = 0;
    let matchingOrdersCount = 0;

    for (const item of completeOrders) {
      const order = item.Order;
      const channel = resolveSalesChannel(order.point_sale);

      if (channelFilter !== "all" && channel !== channelFilter) {
        continue;
      }

      matchingOrdersCount += 1;
      // order.total reflete exatamente o Total pago e exibido na coluna oficial da Tray
      const orderTotal = Number(order.total || order.partial_total || 0);
      const productsSubtotal = Number(order.partial_total || 0);
      const shipmentValue = Number(order.shipment_value || 0);
      const discountValue = Number(order.discount || 0);

      const commissionRate = COMMISSION_RATES[channel];
      const orderCommission = orderTotal * commissionRate;

      // Fator de ajuste caso haja cupom ou desconto no pedido
      const discountRatio =
        productsSubtotal > 0 && discountValue > 0
          ? Math.max(0, (productsSubtotal - discountValue) / productsSubtotal)
          : 1;

      let orderCmv = 0;
      let orderUnits = 0;
      const orderItems: NonNullable<DashboardResponse["recent_orders"][number]["items"]> = [];

      const productsSold = order.ProductsSold || [];
      for (const pSold of productsSold) {
        const prod = pSold.ProductsSold;
        const qty = Number(prod.quantity || 1);
        const itemPrice = Number(prod.price || 0);
        // Preço efetivo considerando descontos proporcionais
        const effectivePrice = itemPrice * discountRatio;
        const itemRevenue = effectivePrice * qty;

        const trayId = Number(prod.product_id);
        const skuKey = (prod.reference || "").toUpperCase();

        let dbCost = 0;
        let dbImg: string | undefined = undefined;
        let dbStock: number | undefined = undefined;

        if (costMapByTrayId.has(trayId)) {
          const entry = costMapByTrayId.get(trayId)!;
          dbCost = entry.cost;
          dbImg = entry.image_url;
          dbStock = entry.stock;
        } else if (costMapBySku.has(skuKey)) {
          const entry = costMapBySku.get(skuKey)!;
          dbCost = entry.cost;
          dbImg = entry.image_url;
          dbStock = entry.stock;
        }

        // Custo unitário rigorosamente conferido contra a planilha oficial Google Sheets
        const unitCost = resolveExactProductCost(
          prod.name,
          prod.reference,
          dbCost || Number(prod.cost_price || 0),
          effectivePrice,
        );

        // Garantir que o estoque nunca seja exibido negativo
        const safeStock = dbStock != null ? Math.max(0, dbStock) : undefined;

        const itemCost = unitCost * qty;
        const itemCommission = itemRevenue * commissionRate;
        const itemNetProfit = itemRevenue - itemCost - itemCommission;

        const unitCommission = effectivePrice * commissionRate;
        const unitNetProfit = effectivePrice - unitCost - unitCommission;
        const itemMarginPercent = effectivePrice > 0 ? (unitNetProfit / effectivePrice) * 100 : 0;

        orderCmv += itemCost;
        orderUnits += qty;

        const itemThumb =
          prod.ProductSoldImage?.[0]?.thumbs?.["90"]?.https ||
          prod.ProductSoldImage?.[0]?.thumbs?.["90"]?.http ||
          prod.ProductSoldImage?.[0]?.https ||
          prod.ProductSoldImage?.[0]?.http ||
          dbImg;

        const itemProdUrl =
          prod.url?.https ||
          prod.url?.http ||
          undefined;

        orderItems.push({
          product_id: prod.product_id,
          name: prod.name,
          sku: prod.reference || "S/ REF",
          price: itemPrice,
          quantity: qty,
          unit_cost: unitCost,
          cost: unitCost,
          unit_commission: unitCommission,
          total_commission: itemCommission,
          unit_net_profit: unitNetProfit,
          total_net_profit: itemNetProfit,
          net_margin_percent: itemMarginPercent,
          image_url: itemThumb,
          product_url: itemProdUrl,
          stock_quantity: safeStock,
        });

        const statKey = prod.reference || `ID-${prod.product_id}`;
        const existing = productStats.get(statKey) || {
          id: prod.product_id,
          sku: prod.reference || "S/ REF",
          name: prod.name,
          image_url: itemThumb,
          stock_quantity: safeStock,
          channel,
          units: 0,
          revenue: 0,
          cost: 0,
          commissions: 0,
        };

        if (!existing.image_url && itemThumb) {
          existing.image_url = itemThumb;
        }
        if (existing.stock_quantity == null && safeStock != null) {
          existing.stock_quantity = safeStock;
        }

        existing.units += qty;
        existing.revenue += itemRevenue;
        existing.cost += itemCost;
        existing.commissions += itemCommission;
        productStats.set(statKey, existing);
      }

      channelStats[channel].count += 1;
      channelStats[channel].gross += orderTotal;
      channelStats[channel].cost += orderCmv;
      channelStats[channel].commissions += orderCommission;

      totalGrossRevenue += orderTotal;
      totalCmvCost += orderCmv;
      totalCommissions += orderCommission;

      const orderNetProfit = orderTotal - orderCmv - orderCommission;

      // Agregação na linha do tempo diária
      const orderDateKey = order.date ? order.date.split(" ")[0] : "";
      if (orderDateKey) {
        const dayEntry = dailyMap.get(orderDateKey) || {
          date: orderDateKey,
          gross_revenue: 0,
          net_profit: 0,
          orders_count: 0,
        };
        dayEntry.gross_revenue += orderTotal;
        dayEntry.net_profit += orderNetProfit;
        dayEntry.orders_count += 1;
        dailyMap.set(orderDateKey, dayEntry);
      }
      const orderNetMarginPercent = orderTotal > 0 ? (orderNetProfit / orderTotal) * 100 : 0;

      recentOrdersList.push({
        id: order.id,
        date: order.date,
        hour: order.hour || undefined,
        channel,
        channel_label: CHANNEL_LABELS[channel],
        status: order.status,
        customer_city: order.Customer?.city,
        customer_state: order.Customer?.state,
        shipment_name: order.shipment || undefined,
        total: orderTotal,
        products_subtotal: productsSubtotal,
        shipment_value: shipmentValue,
        discount_value: discountValue,
        net_profit: orderNetProfit,
        net_margin_percent: orderNetMarginPercent,
        items_count: orderUnits,
        commission_amount: orderCommission,
        cost_amount: orderCmv,
        items: orderItems,
      });
    }

    // 5. Buscar dados de anúncios no Supabase
    let totalAdSpend = 0;
    const adSummaryByPlatform: Record<AdPlatform, { spent: number; imp: number; clk: number; conv: number }> = {
      shopee_ads: { spent: 0, imp: 0, clk: 0, conv: 0 },
      mercado_ads: { spent: 0, imp: 0, clk: 0, conv: 0 },
      tiktok_ads: { spent: 0, imp: 0, clk: 0, conv: 0 },
      meta_ads: { spent: 0, imp: 0, clk: 0, conv: 0 },
      google_ads: { spent: 0, imp: 0, clk: 0, conv: 0 },
    };
    let recentAdRecords: AdSpendRecord[] = [];

    if (supabaseAdmin) {
      const { data: adsData } = await supabaseAdmin
        .from("marketing_ad_spend")
        .select("*")
        .gte("date", startDate)
        .order("date", { ascending: false });

      if (adsData) {
        recentAdRecords = adsData as AdSpendRecord[];
        for (const ad of recentAdRecords) {
          const spent = Number(ad.amount_spent || 0);
          totalAdSpend += spent;
          const p = ad.platform as AdPlatform;
          if (adSummaryByPlatform[p]) {
            adSummaryByPlatform[p].spent += spent;
            adSummaryByPlatform[p].imp += Number(ad.impressions || 0);
            adSummaryByPlatform[p].clk += Number(ad.clicks || 0);
            adSummaryByPlatform[p].conv += Number(ad.conversions || 0);
          }
        }
      }
    }

    // 6. Montar retorno final estruturado
    const operationalProfit = totalGrossRevenue - totalCmvCost - totalCommissions;
    const finalNetProfit = operationalProfit - totalAdSpend;

    const channelsArray: ChannelPerformance[] = (Object.keys(channelStats) as SalesChannel[]).map((c) => {
      const s = channelStats[c];
      const net = s.gross - s.cost - s.commissions;
      return {
        channel: c,
        channel_name: CHANNEL_LABELS[c],
        orders_count: s.count,
        gross_revenue: s.gross,
        product_cost: s.cost,
        commissions: s.commissions,
        net_profit: net,
        net_margin_percent: s.gross > 0 ? (net / s.gross) * 100 : 0,
      };
    });

    const productsArray: ProductProfitSummary[] = Array.from(productStats.values())
      .map((p) => {
        const net = p.revenue - p.cost - p.commissions;
        return {
          product_id: p.id,
          sku: p.sku,
          name: p.name,
          image_url: p.image_url,
          stock_quantity: p.stock_quantity,
          main_channel: CHANNEL_LABELS[p.channel],
          units_sold: p.units,
          total_revenue: p.revenue,
          total_cost: p.cost,
          total_commissions: p.commissions,
          net_profit: net,
          net_margin_percent: p.revenue > 0 ? (net / p.revenue) * 100 : 0,
        };
      })
      .sort((a, b) => b.net_profit - a.net_profit);

    const PLATFORM_NAMES: Record<AdPlatform, string> = {
      shopee_ads: "Shopee Ads",
      mercado_ads: "Mercado Ads",
      tiktok_ads: "TikTok Ads",
      meta_ads: "Meta Ads (Insta / Face)",
      google_ads: "Google Ads",
    };

    const adsSummaryArray: AdSpendSummary[] = (Object.keys(adSummaryByPlatform) as AdPlatform[]).map((p) => {
      const s = adSummaryByPlatform[p];
      return {
        platform: p,
        platform_name: PLATFORM_NAMES[p],
        total_spent: s.spent,
        impressions: s.imp,
        clicks: s.clk,
        conversions: s.conv,
        roas: s.spent > 0 ? totalGrossRevenue / s.spent : undefined,
      };
    });

    const responsePayload: DashboardResponse = {
      period_days: days,
      start_date: startDate,
      end_date: endDate,
      tray_kpis: {
        total_orders_count: periodOrders.length,
        total_orders_revenue: trayTotalOrdersRevenue,
        products_sold_revenue: trayProductsSoldRevenue,
        average_ticket: trayAvgTicket,
        active_orders_count: trayActiveCount,
        active_orders_revenue: trayActiveRevenue,
        cancelled_orders_count: trayCancelledCount,
        cancelled_orders_revenue: trayCancelledRevenue,
      },
      kpis: {
        total_orders: matchingOrdersCount,
        gross_revenue: totalGrossRevenue,
        product_cost_cmv: totalCmvCost,
        platform_commissions: totalCommissions,
        operational_profit: operationalProfit,
        operational_margin_percent: totalGrossRevenue > 0 ? (operationalProfit / totalGrossRevenue) * 100 : 0,
        total_ad_spend: totalAdSpend,
        final_net_profit: finalNetProfit,
        final_net_margin_percent: totalGrossRevenue > 0 ? (finalNetProfit / totalGrossRevenue) * 100 : 0,
        average_ticket: matchingOrdersCount > 0 ? totalGrossRevenue / matchingOrdersCount : 0,
        overall_roas: totalAdSpend > 0 ? totalGrossRevenue / totalAdSpend : 0,
      },
      channels: channelsArray,
      products: productsArray,
      daily_timeline: Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date)),
      ads: {
        total_spent: totalAdSpend,
        by_platform: adsSummaryArray,
        recent_records: recentAdRecords.slice(0, 15),
      },
      recent_orders: recentOrdersList.slice(0, 15),
    };

    return NextResponse.json(responsePayload);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno ao processar métricas.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
