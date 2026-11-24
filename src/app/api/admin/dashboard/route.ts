import { NextResponse } from "next/server";
import { hasAdminAccess } from "@/lib/admin-access";
import { supabaseAdmin } from "@/lib/supabase";
import { trayApiFetch } from "@/lib/tray-client";
import marketplacePricesData from "@/data/marketplace_prices.json";
import {
  resolveExactProductCostDetails,
  isOwnProductionTextile,
} from "@/lib/sheet-costs";
import type {
  SalesChannel,
  DashboardResponse,
  ChannelPerformance,
  ProductProfitSummary,
  MonthlySalesHistory,
  AdSpendRecord,
  AdPlatform,
  AdSpendSummary,
  DashboardScope,
} from "@/types/dashboard";

interface TrayOrderItem {
  Order: {
    id: string;
    date: string;
    hour?: string;
    status: string;
    total: string;
    partial_total: string;
    discount?: string;
    point_sale?: string;
    shipment?: string;
    shipment_value?: string;
    Customer?: {
      name?: string;
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
    status: string;
    total: string;
    partial_total: string;
    discount?: string;
    point_sale?: string;
    shipment?: string;
    shipment_value?: string;
    Customer?: {
      name?: string;
      city?: string;
      state?: string;
    };
    ProductsSold?: Array<{
      ProductsSold: {
        product_id: string;
        name: string;
        reference?: string;
        price: string;
        cost_price?: string;
        quantity: string;
        url?: {
          http?: string;
          https?: string;
        };
        ProductSoldImage?: Array<{
          http?: string;
          https?: string;
          thumbs?: {
            "90"?: { http?: string; https?: string };
            "180"?: { http?: string; https?: string };
          };
        }>;
      };
    }>;
  };
}

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
 * Calcula a comissão detalhada exata da plataforma com base nas regras canônicas de marketplace.
 *
 * @description
 * - Shopee: 20,0% (14% comissão + 6% programa frete grátis) + R$ 4,00 taxa fixa por unidade vendida.
 * - Mercado Livre: 16,0% padrão + R$ 6,00 taxa fixa por unidade para itens < R$ 79,00; ≥ R$ 79,00 sem taxa fixa de R$ 6.
 * - TikTok Shop: 7,0% comissão + R$ 2,00 taxa de transação por unidade vendida.
 * - Site / Loja Virtual (Tray Checkout): 3,5% taxa gateway/cartão + R$ 0,50 taxa de transação por pedido.
 *
 * @param {SalesChannel} channel - Canal de venda
 * @param {number} itemPrice - Preço unitário efetivo de venda
 * @param {number} quantity - Quantidade de itens
 * @returns Decomposição completa da taxa do canal
 * @category Dashboard
 * @since v3.2.0
 */
function calculateDetailedCommission(
  channel: SalesChannel,
  itemPrice: number,
  quantity: number,
): {
  rate_percent: number;
  percentage_amount: number;
  fixed_fee: number;
  total_fee: number;
  effective_rate_percent: number;
  rule_description: string;
} {
  const itemRevenue = itemPrice * quantity;
  let rate_percent = 3.5;
  let fixed_fee = 0;
  let rule_description = "";

  if (channel === "shopee") {
    rate_percent = 20.0;
    fixed_fee = 4.5 * quantity;
    rule_description = "20% (18,60% comissão líquida + 1,40% transação) + R$ 4,50 taxa fixa por un.";
  } else if (channel === "mercadolivre") {
    rate_percent = 16.0;
    fixed_fee = itemPrice < 79.0 ? 6.0 * quantity : 0;
    rule_description =
      itemPrice < 79.0
        ? "16% comissão + R$ 6,00 taxa fixa por un. (< R$ 79)"
        : "16% comissão padrão (anúncio ≥ R$ 79 sem taxa fixa de R$ 6)";
  } else if (channel === "tiktok") {
    rate_percent = 7.0;
    fixed_fee = 2.0 * quantity;
    rule_description = "7% comissão + R$ 2,00 taxa de transação por un.";
  } else {
    // site / loja virtual
    rate_percent = 3.5;
    fixed_fee = 0.5 * (quantity > 0 ? 1 : 0);
    rule_description = "3,5% taxa gateway/cartão + R$ 0,50 taxa de transação";
  }

  const percentage_amount = itemRevenue * (rate_percent / 100);
  const total_fee = percentage_amount + fixed_fee;
  const effective_rate_percent =
    itemRevenue > 0 ? (total_fee / itemRevenue) * 100 : rate_percent;

  return {
    rate_percent,
    percentage_amount,
    fixed_fee,
    total_fee,
    effective_rate_percent,
    rule_description,
  };
}

/**
 * Endpoint consolidado de métricas financeiras, vendas e anúncios.
 *
 * @description
 * 1. Valida o acesso administrativo via hasAdminAccess()
 * 2. Carrega tabela de custos do catálogo no Supabase
 * 3. Busca pedidos da Tray Commerce do período solicitado
 * 4. Aplica filtro de escopo ("all" para visão geral ou "textil" para confecção própria)
 * 5. Cruza produtos com CMV auditado da planilha oficial e sinaliza terceiros sem custo
 * 6. Decompõe comissões percentuais (%) e taxas fixas (R$) por canal
 * 7. Agrega histórico de anúncios (marketing_ad_spend) e calcula ROAS
 *
 * @param {Request} request - Requisição HTTP com parâmetros ?days=X&channel=Y&status=Z&scope=W
 * @returns {Promise<NextResponse>} Payload completo DashboardResponse
 * @category Dashboard
 * @since v3.2.0
 */
interface AllTimeCache {
  timestamp: number;
  data: ProductProfitSummary[];
}
let allTimeProductsCache: AllTimeCache | null = null;

interface AllTimeOrdersCache {
  timestamp: number;
  orders: Array<{
    id: string;
    date: string;
    status: string;
    total: string;
    partial_total: string;
    point_sale?: string;
  }>;
}
let allTimeOrdersCache: AllTimeOrdersCache | null = null;
const ALL_TIME_CACHE_TTL = 10 * 60 * 1000;

async function getAllTimeOrders(): Promise<Array<{
  id: string;
  date: string;
  status: string;
  total: string;
  partial_total: string;
  point_sale?: string;
}>> {
  if (allTimeOrdersCache && Date.now() - allTimeOrdersCache.timestamp < ALL_TIME_CACHE_TTL) {
    return allTimeOrdersCache.orders;
  }

  try {
    let page = 1;
    const allOrders: Array<{
      id: string;
      date: string;
      status: string;
      total: string;
      partial_total: string;
      point_sale?: string;
    }> = [];

    while (true) {
      const res = await trayApiFetch<{
        Orders?: Array<{
          Order: {
            id: string;
            date: string;
            status: string;
            total: string;
            partial_total: string;
            point_sale?: string;
          };
        }>;
        paging?: { total: number };
      }>(`orders?page=${page}&limit=50`);

      const ords = res.Orders || [];
      if (!ords.length) break;
      for (const item of ords) {
        allOrders.push(item.Order);
      }
      if (allOrders.length >= (res.paging?.total || 0)) break;
      page++;
    }

    allTimeOrdersCache = {
      timestamp: Date.now(),
      orders: allOrders,
    };
    return allOrders;
  } catch (err) {
    console.warn("[Dashboard:API] Falha ao buscar todos os pedidos históricos da Tray:", err);
    return allTimeOrdersCache?.orders || [];
  }
}

const MONTH_NAMES_PT: Record<string, { short: string; full: string }> = {
  "01": { short: "Jan", full: "Janeiro" },
  "02": { short: "Fev", full: "Fevereiro" },
  "03": { short: "Mar", full: "Março" },
  "04": { short: "Abr", full: "Abril" },
  "05": { short: "Mai", full: "Maio" },
  "06": { short: "Jun", full: "Junho" },
  "07": { short: "Jul", full: "Julho" },
  "08": { short: "Ago", full: "Agosto" },
  "09": { short: "Set", full: "Setembro" },
  "10": { short: "Out", full: "Outubro" },
  "11": { short: "Nov", full: "Novembro" },
  "12": { short: "Dez", full: "Dezembro" },
};

function getMonthlySalesHistory(
  orders: Array<{
    id: string;
    date: string;
    status: string;
    total: string;
    partial_total: string;
    point_sale?: string;
  }>
): MonthlySalesHistory[] {
  const map = new Map<
    string,
    {
      gross_revenue: number;
      orders_count: number;
      by_channel: { site: number; shopee: number; mercado_livre: number };
    }
  >();

  for (const o of orders) {
    const isCancelled = (o.status || "").toUpperCase().includes("CANCELADO");
    if (isCancelled || !o.date) continue;

    const monthKey = o.date.substring(0, 7); // "YYYY-MM"
    const rev = Number(o.total || o.partial_total || 0);

    const pointSale = (o.point_sale || "").toLowerCase();
    let channel: "site" | "shopee" | "mercado_livre" = "site";
    if (pointSale.includes("shopee")) {
      channel = "shopee";
    } else if (pointSale.includes("mercado") || pointSale.includes("ml")) {
      channel = "mercado_livre";
    }

    let item = map.get(monthKey);
    if (!item) {
      item = {
        gross_revenue: 0,
        orders_count: 0,
        by_channel: { site: 0, shopee: 0, mercado_livre: 0 },
      };
      map.set(monthKey, item);
    }

    item.gross_revenue += rev;
    item.orders_count += 1;
    item.by_channel[channel] = (item.by_channel[channel] || 0) + rev;
  }

  const sortedMonths = Array.from(map.keys()).sort();
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const currentDay = now.getDate();
  const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const result: MonthlySalesHistory[] = [];

  for (let i = 0; i < sortedMonths.length; i++) {
    const m = sortedMonths[i];
    const data = map.get(m)!;
    const [year, monthStr] = m.split("-");
    const nameObj = MONTH_NAMES_PT[monthStr] || { short: monthStr, full: monthStr };
    const label = `${nameObj.short}/${year.slice(2)}`;
    const full_label = `${nameObj.full} de ${year}`;
    const avgTicket = data.orders_count > 0 ? data.gross_revenue / data.orders_count : 0;

    let growth_percent: number | null = null;
    if (i > 0) {
      const prevData = map.get(sortedMonths[i - 1])!;
      if (prevData.gross_revenue > 0) {
        growth_percent = ((data.gross_revenue - prevData.gross_revenue) / prevData.gross_revenue) * 100;
      }
    }

    const is_current_month = m === currentMonthKey;
    let projected_revenue: number | undefined = undefined;
    if (is_current_month && currentDay > 0) {
      projected_revenue = (data.gross_revenue / currentDay) * daysInCurrentMonth;
    }

    result.push({
      month: m,
      label,
      full_label,
      gross_revenue: data.gross_revenue,
      orders_count: data.orders_count,
      average_ticket: avgTicket,
      growth_percent,
      is_current_month,
      projected_revenue,
      by_channel: data.by_channel,
    });
  }

  return result;
}

async function getAllTimeProducts(
  costMapByTrayId: Map<number, { cost: number; sku: string; name: string; image_url?: string; stock?: number }>,
  costMapBySku: Map<string, { cost: number; name: string; image_url?: string; stock?: number }>,
  liveTrayProductsMap: Map<number, { stock: number; name?: string; sku?: string; image_url?: string; price?: number; cost_price?: number; is_active: boolean }>,
  mktPricesMap: Record<string, { sku: string; base_price?: number; channels?: Record<string, number | undefined> }>
): Promise<ProductProfitSummary[]> {
  if (allTimeProductsCache && Date.now() - allTimeProductsCache.timestamp < ALL_TIME_CACHE_TTL) {
    return allTimeProductsCache.data;
  }

  try {
    const ordersMap = new Map<string, { point_sale?: string; status?: string }>();
    const allHistoricalOrders = await getAllTimeOrders();
    for (const o of allHistoricalOrders) {
      ordersMap.set(String(o.id), o);
    }

    let page = 1;
    let allSold: any[] = [];
    while (true) {
      const res = await trayApiFetch<{ ProductsSolds?: any[]; paging?: { total: number } }>(
        `products_solds?page=${page}&limit=50`,
      );
      const items = res.ProductsSolds || [];
      if (!items.length) break;
      allSold = allSold.concat(items);
      if (allSold.length >= (res.paging?.total || 0)) break;
      page++;
    }

    // Buscar detalhes e cost_price na Tray API para produtos da série histórica não mapeados
    const missingPids = new Set<number>();
    for (const item of allSold) {
      const pid = Number(item.ProductsSold?.product_id);
      if (pid > 0 && !liveTrayProductsMap.has(pid)) {
        missingPids.add(pid);
      }
    }

    if (missingPids.size > 0) {
      const missingArr = Array.from(missingPids);
      const concurrency = 6;
      for (let i = 0; i < missingArr.length; i += concurrency) {
        const chunk = missingArr.slice(i, i + concurrency);
        await Promise.all(
          chunk.map(async (pid) => {
            try {
              const res = await trayApiFetch<{ Product: any }>(`products/${pid}`);
              if (res && res.Product) {
                const p = res.Product;
                const stockNum = Math.max(0, Number(p.stock || 0));
                const img =
                  p.ProductImage?.[0]?.thumbs?.["90"]?.https ||
                  p.ProductImage?.[0]?.thumbs?.["90"]?.http ||
                  p.ProductImage?.[0]?.https ||
                  p.ProductImage?.[0]?.http;
                const isAvail = p.available === "1" || p.available === 1 || p.available == null;
                const isAct = p.active === "1" || p.active === 1 || p.active == null;
                liveTrayProductsMap.set(pid, {
                  stock: stockNum,
                  name: p.name,
                  sku: p.reference,
                  image_url: img,
                  price: p.price ? Number(p.price) : undefined,
                  cost_price: p.cost_price ? Number(p.cost_price) : undefined,
                  is_active: isAvail && isAct,
                });
              }
            } catch {
              // ignora falha de busca de produto avulso
            }
          })
        );
      }
    }

    const productStats = new Map<
      string,
      {
        product_id: string | number;
        sku: string;
        name: string;
        image_url?: string;
        stock_quantity?: number;
        channel: SalesChannel;
        units_sold: number;
        total_revenue: number;
        total_cost: number;
        total_commissions: number;
        percentage_commissions: number;
        fixed_fees: number;
        is_own_production: boolean;
        has_missing_cost: boolean;
      }
    >();

    for (const item of allSold) {
      const s = item.ProductsSold;
      const order = ordersMap.get(String(s.order_id));
      if (order && (order.status || "").toUpperCase().includes("CANCELADO")) {
        continue;
      }

      const channel = resolveSalesChannel(order?.point_sale);
      const skuKey = (s.reference || "").toUpperCase().trim();
      const mapKey = `${channel}:${skuKey || s.product_id}`;

      const qty = Number(s.quantity || 1);
      const itemPrice = Number(s.price || 0);
      const itemRevenue = itemPrice * qty;

      const dbInfo = costMapBySku.get(skuKey) || costMapByTrayId.get(Number(s.product_id));
      const liveInfo = liveTrayProductsMap.get(Number(s.product_id));

      const fallbackCost = liveInfo?.cost_price || dbInfo?.cost || Number(s.cost_price || 0);
      const costDetails = resolveExactProductCostDetails(
        liveInfo?.name || s.name,
        liveInfo?.sku || skuKey,
        fallbackCost,
        itemPrice
      );
      const itemCost = (costDetails.cost || 0) * qty;

      const comm = calculateDetailedCommission(channel, itemPrice, qty);

      const img = liveInfo?.image_url ||
                s.ProductSoldImage?.[0]?.thumbs?.["90"]?.https ||
                s.ProductSoldImage?.[0]?.thumbs?.["90"]?.http ||
                s.ProductSoldImage?.[0]?.https ||
                s.ProductSoldImage?.[0]?.http ||
                dbInfo?.image_url;

      const stock = liveInfo?.stock ?? dbInfo?.stock ?? 0;

      if (!productStats.has(mapKey)) {
        productStats.set(mapKey, {
          product_id: s.product_id,
          sku: liveInfo?.sku || s.reference || `PRD-${s.product_id}`,
          name: liveInfo?.name || s.name,
          image_url: img,
          stock_quantity: stock,
          channel,
          units_sold: 0,
          total_revenue: 0,
          total_cost: 0,
          total_commissions: 0,
          percentage_commissions: 0,
          fixed_fees: 0,
          is_own_production: isOwnProductionTextile(s.name, skuKey),
          has_missing_cost: costDetails.has_missing_cost || costDetails.cost === 0,
        });
      }

      const curr = productStats.get(mapKey)!;
      curr.units_sold += qty;
      curr.total_revenue += itemRevenue;
      curr.total_cost += itemCost;
      curr.total_commissions += comm.total_fee;
      curr.percentage_commissions += comm.percentage_amount;
      curr.fixed_fees += comm.fixed_fee;
      if (!curr.image_url && img) curr.image_url = img;
    }

    const result: ProductProfitSummary[] = Array.from(productStats.values()).map((p) => {
      const net = p.has_missing_cost ? 0 : (p.total_revenue - p.total_cost - p.total_commissions);
      const skuKey = (p.sku || "").toUpperCase().trim();
      const mktInfo = mktPricesMap[skuKey];
      const channelKey = p.channel;
      const channelListingPrice = mktInfo?.channels?.[channelKey];
      const unitAvgPrice = p.units_sold > 0 ? p.total_revenue / p.units_sold : 0;
      const resolvedBasePrice = mktInfo?.base_price;

      return {
        product_id: p.product_id,
        sku: p.sku,
        name: p.name,
        image_url: p.image_url,
        stock_quantity: p.stock_quantity,
        main_channel: CHANNEL_LABELS[p.channel],
        units_sold: p.units_sold,
        total_revenue: p.total_revenue,
        total_cost: p.total_cost,
        total_commissions: p.total_commissions,
        percentage_commissions: p.percentage_commissions,
        fixed_fees: p.fixed_fees,
        base_price: resolvedBasePrice,
        channel_listing_price: channelListingPrice,
        unit_avg_price: unitAvgPrice,
        net_profit: net,
        net_margin_percent: p.total_revenue > 0 && !p.has_missing_cost ? (net / p.total_revenue) * 100 : 0,
        is_own_production: p.is_own_production,
        has_missing_cost: p.has_missing_cost,
        is_active: true,
      };
    }).sort((a, b) => b.units_sold - a.units_sold);

    allTimeProductsCache = { timestamp: Date.now(), data: result };
    return result;
  } catch (err) {
    console.error("Error fetching all-time products:", err);
    return [];
  }
}

export async function GET(request: Request) {
  const isAuthorized = await hasAdminAccess();
  if (!isAuthorized) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const rawStartDate = searchParams.get("start_date");
  const rawEndDate = searchParams.get("end_date");

  let startDate: string;
  let endDate: string;
  let days: number;

  if (rawStartDate && rawEndDate) {
    startDate = rawStartDate;
    endDate = rawEndDate;
    const diffMs =
      new Date(`${endDate}T12:00:00`).getTime() - new Date(`${startDate}T12:00:00`).getTime();
    days = Math.max(1, Math.round(diffMs / (24 * 60 * 60 * 1000)) + 1);
  } else {
    days = Math.max(1, Number(searchParams.get("days") || 30));
    const startDateObj = new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000);
    startDate = startDateObj.toISOString().split("T")[0];
    endDate = new Date().toISOString().split("T")[0];
  }

  const channelFilter = searchParams.get("channel") || "all";
  const statusParam = searchParams.get("status") || "approved"; // "approved" (padrão), "all", "pending", "cancelled"
  const scope: DashboardScope = searchParams.get("scope") === "textil" ? "textil" : "all";
  const isRefresh = searchParams.get("refresh") === "1";

  if (isRefresh) {
    allTimeProductsCache = null;
    allTimeOrdersCache = null;
  }

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
            image_url =
              typeof first === "string"
                ? first
                : first?.url || first?.https || first?.http;
          } else if (p.media && typeof p.media === "object") {
            const mediaObj = p.media as any;
            const imagesArr = Array.isArray(mediaObj.images) ? mediaObj.images : [];
            if (imagesArr.length > 0) {
              const first = imagesArr[0];
              image_url =
                typeof first === "string"
                  ? first
                  : first?.url || first?.https || first?.http || first?.url_webp;
            }
          }
          const stock = p.stock != null ? Number(p.stock) : undefined;
          if (p.tray_product_id) {
            costMapByTrayId.set(Number(p.tray_product_id), {
              cost,
              sku: p.sku,
              name: p.name,
              image_url,
              stock,
            });
          }
          if (p.sku) {
            costMapBySku.set(p.sku.toUpperCase(), {
              cost,
              name: p.name,
              image_url,
              stock,
            });
          }
        }
      }
    }

    // 2. Buscar pedidos na Tray com Graceful Degradation (não quebra a dashboard se a Tray oscilar ou expirar)
    let rawOrders: TrayOrderItem[] = [];
    let trayWarning: string | null = null;

    try {
      const ordersListRes = await trayApiFetch<{ Orders?: TrayOrderItem[] }>(
        "orders?sort=id_desc&limit=50&page=1",
      );
      rawOrders = ordersListRes?.Orders || [];
      const oldestOrderDate = rawOrders[rawOrders.length - 1]?.Order?.date;

      if (days > 40 || (oldestOrderDate && oldestOrderDate > startDate)) {
        try {
          const ordersPage2Res = await trayApiFetch<{ Orders?: TrayOrderItem[] }>(
            "orders?sort=id_desc&limit=50&page=2",
          );
          if (ordersPage2Res?.Orders) {
            rawOrders = [...rawOrders, ...ordersPage2Res.Orders];
          }
        } catch (err) {
          console.warn("[Dashboard:API] Falha ao carregar página 2 de pedidos:", err);
        }
      }
    } catch (trayErr: unknown) {
      const msg = trayErr instanceof Error ? trayErr.message : String(trayErr);
      trayWarning = `Conexão com a Tray Commerce temporariamente indisponível (${msg}). O catálogo e anúncios continuam operando normalmente.`;
      console.warn("[Dashboard:API] Aviso de conexão com a Tray:", msg);
    }

    // Calcular KPIs oficiais idênticos aos do painel da Tray
    const periodOrders = rawOrders.filter((o) => {
      const orderDate = o.Order.date;
      return orderDate >= startDate && orderDate <= endDate;
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
      if (statusParam === "approved") {
        return !status.includes("CANCELADO");
      }
      if (statusParam === "pending") {
        return status.includes("AGUARDANDO") || status.includes("PENDENTE");
      }
      if (statusParam === "cancelled") {
        return status.includes("CANCELADO");
      }
      // "all" ou qualquer outro status
      return true;
    });

    // 3. Buscar detalhes completos dos pedidos para analisar produtos vendidos com retry e blindagem anti-perda
    const completeOrders: TrayCompleteOrder[] = [];
    const concurrency = 4; // Concorrência otimizada para estabilidade e evitar rate-limit na Tray

    for (let i = 0; i < validOrders.length; i += concurrency) {
      const chunk = validOrders.slice(i, i + concurrency);
      const chunkPromises = chunk.map(async (o) => {
        const orderId = o.Order.id;
        // Tenta até 3 vezes com backoff progressivo caso a Tray oscile
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            const res = await trayApiFetch<TrayCompleteOrder>(`orders/${orderId}/complete`);
            if (res && res.Order) {
              return res;
            }
          } catch (err) {
            if (attempt === 3) {
              console.warn(`[Dashboard:API] Falha ao obter /complete do pedido #${orderId}. Ativando fallback resiliente.`);
            } else {
              await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
            }
          }
        }

        // Fallback garantido: caso /complete falhe nas 3 tentativas, preserva o pedido
        // a partir dos dados já carregados no pedido principal (validOrders)
        return {
          Order: {
            ...o.Order,
            ProductsSold: (o.Order as any).ProductsSold || [],
          },
        } as TrayCompleteOrder;
      });

      const resolved = await Promise.all(chunkPromises);
      for (const item of resolved) {
        if (item && item.Order) completeOrders.push(item);
      }
    }

    // 3.1. Buscar dados de estoque e catálogo 100% AO VIVO direto da Tray API
    const uniqueProductIds = new Set<number>();
    for (const item of completeOrders) {
      for (const pSold of item.Order.ProductsSold || []) {
        const pId = Number(pSold.ProductsSold.product_id);
        if (pId > 0) uniqueProductIds.add(pId);
      }
    }

    interface TrayProductDirect {
      id: string | number;
      name: string;
      reference?: string;
      stock: string | number;
      price?: string | number;
      cost_price?: string | number;
      available?: string | number;
      active?: string | number;
      ProductImage?: Array<{
        https?: string;
        http?: string;
        thumbs?: {
          "90"?: { https?: string; http?: string };
          "180"?: { https?: string; http?: string };
        };
      }>;
    }

    const liveTrayProductsMap = new Map<
      number,
      {
        stock: number;
        name?: string;
        sku?: string;
        image_url?: string;
        price?: number;
        cost_price?: number;
        is_active: boolean;
      }
    >();

    const productIdsArray = Array.from(uniqueProductIds);
    const prodConcurrency = 6;
    for (let i = 0; i < productIdsArray.length; i += prodConcurrency) {
      const chunk = productIdsArray.slice(i, i + prodConcurrency);
      const chunkPromises = chunk.map(async (pid) => {
        try {
          const res = await trayApiFetch<{ Product: TrayProductDirect }>(`products/${pid}`);
          if (res && res.Product) {
            const p = res.Product;
            const stockNum = Math.max(0, Number(p.stock || 0));
            const img =
              p.ProductImage?.[0]?.thumbs?.["90"]?.https ||
              p.ProductImage?.[0]?.thumbs?.["90"]?.http ||
              p.ProductImage?.[0]?.https ||
              p.ProductImage?.[0]?.http;

            const isAvail = p.available === "1" || p.available === 1 || p.available == null;
            const isAct = p.active === "1" || p.active === 1 || p.active == null;
            const isActiveProduct = isAvail && isAct;

            liveTrayProductsMap.set(pid, {
              stock: stockNum,
              name: p.name,
              sku: p.reference,
              image_url: img,
              price: Number(p.price || 0),
              cost_price: Number(p.cost_price || 0),
              is_active: isActiveProduct,
            });
          }
        } catch {
          // Fallback gracioso
        }
      });
      await Promise.all(chunkPromises);
    }

    // 4. Estruturas para acumulação
    const channelStats: Record<
      SalesChannel,
      {
        count: number;
        gross: number;
        cost: number;
        commissions: number;
        percentage_commissions: number;
        fixed_fees: number;
        seller_shipping: number;
      }
    > = {
      site: { count: 0, gross: 0, cost: 0, commissions: 0, percentage_commissions: 0, fixed_fees: 0, seller_shipping: 0 },
      shopee: { count: 0, gross: 0, cost: 0, commissions: 0, percentage_commissions: 0, fixed_fees: 0, seller_shipping: 0 },
      mercadolivre: { count: 0, gross: 0, cost: 0, commissions: 0, percentage_commissions: 0, fixed_fees: 0, seller_shipping: 0 },
      tiktok: { count: 0, gross: 0, cost: 0, commissions: 0, percentage_commissions: 0, fixed_fees: 0, seller_shipping: 0 },
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
        base_price?: number;
        units: number;
        revenue: number;
        cost: number;
        commissions: number;
        percentage_commissions: number;
        fixed_fees: number;
        is_own_production: boolean;
        has_missing_cost: boolean;
        is_active: boolean;
      }
    >();

    const recentOrdersList: DashboardResponse["recent_orders"] = [];
    const dailyMap = new Map<
      string,
      { date: string; gross_revenue: number; net_profit: number; orders_count: number }
    >();

    let totalGrossRevenue = 0;
    let totalCustomerPaid = 0;
    let totalShippingCost = 0;
    let totalSellerShippingCost = 0;
    let totalThirdPartyShippingCost = 0;
    let totalItemsRevenue = 0;
    let totalCmvCost = 0;
    let totalCommissions = 0;
    let matchingOrdersCount = 0;
    let totalMissingCostsCount = 0;

    for (const item of completeOrders) {
      const order = item.Order;
      const channel = resolveSalesChannel(order.point_sale);

      if (channelFilter !== "all" && channel !== channelFilter) {
        continue;
      }

      const productsSold = order.ProductsSold || [];
      const productsSubtotal = Number(order.partial_total || 0);
      const shipmentValue = Number(order.shipment_value || 0);
      const discountValue = Number(order.discount || 0);

      // Fator de ajuste caso haja cupom ou desconto no pedido
      const discountRatio =
        productsSubtotal > 0 && discountValue > 0
          ? Math.max(0, (productsSubtotal - discountValue) / productsSubtotal)
          : 1;

      let orderRevenue = 0;
      let orderCmv = 0;
      let orderUnits = 0;
      let orderPercentageComm = 0;
      let orderFixedFees = 0;
      let orderTotalCommission = 0;
      let orderHasMissingCost = false;
      const orderItems: NonNullable<DashboardResponse["recent_orders"][number]["items"]> = [];

      for (const pSold of productsSold) {
        const prod = pSold.ProductsSold;
        const qty = Number(prod.quantity || 1);
        const itemPrice = Number(prod.price || 0);
        const effectivePrice = itemPrice * discountRatio;
        const itemRevenue = effectivePrice * qty;

        const trayId = Number(prod.product_id);
        const skuKey = (prod.reference || "").toUpperCase();

        const liveTrayProduct = liveTrayProductsMap.get(trayId);

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

        let resolvedStock: number | undefined = undefined;
        if (liveTrayProduct && liveTrayProduct.stock != null) {
          resolvedStock = liveTrayProduct.stock;
        } else if (dbStock != null) {
          resolvedStock = Math.max(0, dbStock);
        }

        const costDetails = resolveExactProductCostDetails(
          liveTrayProduct?.name || prod.name,
          liveTrayProduct?.sku || prod.reference,
          dbCost || liveTrayProduct?.cost_price || Number(prod.cost_price || 0),
          effectivePrice,
        );

        // Se o escopo for 'textil', filtra apenas itens de produção própria
        if (scope === "textil" && !costDetails.is_own_production) {
          continue;
        }

        if (costDetails.has_missing_cost) {
          orderHasMissingCost = true;
          totalMissingCostsCount += 1;
        }

        const comm = calculateDetailedCommission(channel, effectivePrice, qty);
        const itemCost = costDetails.cost * qty;
        const itemNetProfit = itemRevenue - itemCost - comm.total_fee;

        const unitCost = costDetails.cost;
        const unitCommission = qty > 0 ? comm.total_fee / qty : 0;
        const unitNetProfit = effectivePrice - unitCost - unitCommission;
        const itemMarginPercent = effectivePrice > 0 ? (unitNetProfit / effectivePrice) * 100 : 0;

        orderRevenue += itemRevenue;
        orderCmv += itemCost;
        orderUnits += qty;
        orderPercentageComm += comm.percentage_amount;
        orderFixedFees += comm.fixed_fee;
        orderTotalCommission += comm.total_fee;

        const itemThumb =
          prod.ProductSoldImage?.[0]?.thumbs?.["90"]?.https ||
          prod.ProductSoldImage?.[0]?.thumbs?.["90"]?.http ||
          liveTrayProduct?.image_url ||
          prod.ProductSoldImage?.[0]?.https ||
          prod.ProductSoldImage?.[0]?.http ||
          dbImg;

        const itemProdUrl =
          prod.url?.https ||
          prod.url?.http ||
          undefined;

        orderItems.push({
          product_id: prod.product_id,
          name: liveTrayProduct?.name || prod.name,
          sku: liveTrayProduct?.sku || prod.reference || "S/ REF",
          price: itemPrice,
          quantity: qty,
          unit_cost: unitCost,
          cost: unitCost,
          unit_commission: unitCommission,
          total_commission: comm.total_fee,
          commission_rate_percent: comm.rate_percent,
          commission_percentage_amount: comm.percentage_amount,
          commission_fixed_fee: comm.fixed_fee,
          commission_effective_percent: comm.effective_rate_percent,
          commission_rule_label: comm.rule_description,
          unit_net_profit: unitNetProfit,
          total_net_profit: itemNetProfit,
          net_margin_percent: itemMarginPercent,
          image_url: itemThumb,
          product_url: itemProdUrl,
          stock_quantity: resolvedStock,
          is_own_production: costDetails.is_own_production,
          has_missing_cost: costDetails.has_missing_cost,
          pack_description: costDetails.pack_description,
        });

        const statKey = liveTrayProduct?.sku || prod.reference || `ID-${prod.product_id}`;
        const existing = productStats.get(statKey) || {
          id: prod.product_id,
          sku: liveTrayProduct?.sku || prod.reference || "S/ REF",
          name: liveTrayProduct?.name || prod.name,
          image_url: itemThumb,
          stock_quantity: resolvedStock,
          channel,
          base_price: liveTrayProduct?.price ? Number(liveTrayProduct.price) : undefined,
          units: 0,
          revenue: 0,
          cost: 0,
          commissions: 0,
          percentage_commissions: 0,
          fixed_fees: 0,
          is_own_production: costDetails.is_own_production,
          has_missing_cost: costDetails.has_missing_cost,
          is_active: liveTrayProduct?.is_active ?? true,
        };

        if (!existing.image_url && itemThumb) {
          existing.image_url = itemThumb;
        }
        if (existing.stock_quantity == null && resolvedStock != null) {
          existing.stock_quantity = resolvedStock;
        } else if (resolvedStock != null) {
          existing.stock_quantity = resolvedStock;
        }

        existing.units += qty;
        existing.revenue += itemRevenue;
        existing.cost += itemCost;
        existing.commissions += comm.total_fee;
        existing.percentage_commissions += comm.percentage_amount;
        existing.fixed_fees += comm.fixed_fee;
        productStats.set(statKey, existing);
      }

      // Se o pedido não tem itens no escopo:
      // No escopo restrito 'textil', pula se o pedido só tiver produtos de terceiros.
      // No escopo 'all' (geral), NUNCA descarta o pedido: apura com base nos valores oficiais do pedido da Tray.
      if (orderItems.length === 0) {
        if (scope === "textil") {
          continue;
        }

        orderRevenue = Number(order.partial_total || order.total || 0);
        const comm = calculateDetailedCommission(channel, orderRevenue, 1);
        orderTotalCommission = comm.total_fee;
        orderPercentageComm = comm.percentage_amount;
        orderFixedFees = comm.fixed_fee;
        // Custo médio de fabricação da loja (~37.5% CMV)
        orderCmv = orderRevenue * 0.375;
      }

      matchingOrdersCount += 1;
      const orderEffectiveTotal = orderRevenue; // Faturamento correspondente aos itens elegíveis

      // Custo Real de Frete Suportado pelo Vendedor:
      // No Mercado Livre, para pedidos com subtotal de produtos >= R$ 79, o frete grátis ao comprador é obrigatório e debitado da conta da Mesa & Graça
      const isML = channel === "mercadolivre" || (order.point_sale || "").toLowerCase().includes("mercado");
      const isMLFreeShippingSeller = isML && productsSubtotal >= 79 && (shipmentValue > 0 || discountValue > 0);
      const sellerShippingCost = isMLFreeShippingSeller ? (shipmentValue || discountValue || 0) : 0;
      const thirdPartyShipping = shipmentValue > sellerShippingCost ? shipmentValue - sellerShippingCost : 0;

      const orderNetProfit = orderEffectiveTotal - orderCmv - orderTotalCommission - sellerShippingCost;
      const orderCustomerPaid = Number(order.total || (orderEffectiveTotal + shipmentValue));

      channelStats[channel].count += 1;
      channelStats[channel].gross += orderEffectiveTotal;
      channelStats[channel].cost += orderCmv;
      channelStats[channel].commissions += orderTotalCommission;
      channelStats[channel].percentage_commissions += orderPercentageComm;
      channelStats[channel].fixed_fees += orderFixedFees;
      channelStats[channel].seller_shipping += sellerShippingCost;

      totalGrossRevenue += orderEffectiveTotal;
      totalCustomerPaid += orderCustomerPaid;
      totalShippingCost += shipmentValue;
      totalSellerShippingCost += sellerShippingCost;
      totalThirdPartyShippingCost += thirdPartyShipping;
      totalItemsRevenue += orderRevenue;
      totalCmvCost += orderCmv;
      totalCommissions += orderTotalCommission;

      // Agregação na linha do tempo diária
      const orderDateKey = order.date ? order.date.split(" ")[0] : "";
      if (orderDateKey) {
        const dayEntry = dailyMap.get(orderDateKey) || {
          date: orderDateKey,
          gross_revenue: 0,
          net_profit: 0,
          orders_count: 0,
        };
        dayEntry.gross_revenue += orderEffectiveTotal;
        dayEntry.net_profit += orderNetProfit;
        dayEntry.orders_count += 1;
        dailyMap.set(orderDateKey, dayEntry);
      }

      const orderNetMarginPercent =
        orderEffectiveTotal > 0 ? (orderNetProfit / orderEffectiveTotal) * 100 : 0;

      // No Mercado Livre, quando a Tray registra a etiqueta do Mercado Envios no campo de desconto,
      // esse valor é o frete grátis e não um cupom comercial do vendedor.
      const commercialDiscount = isMLFreeShippingSeller ? Math.max(0, discountValue - sellerShippingCost) : discountValue;

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
        total: Number(order.total || orderEffectiveTotal),
        products_subtotal: productsSubtotal,
        shipment_value: shipmentValue,
        seller_shipping_cost: sellerShippingCost,
        discount_value: commercialDiscount,
        net_profit: orderNetProfit,
        net_margin_percent: orderNetMarginPercent,
        items_count: orderUnits,
        commission_amount: orderTotalCommission,
        commission_percentage_amount: orderPercentageComm,
        commission_fixed_fee: orderFixedFees,
        cost_amount: orderCmv,
        has_missing_cost: orderHasMissingCost,
        items: orderItems,
      });
    }

    // 5. Buscar dados de anúncios no Supabase
    let totalAdSpend = 0;
    const adSummaryByPlatform: Record<
      AdPlatform,
      { spent: number; imp: number; clk: number; conv: number }
    > = {
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
        .lte("date", endDate)
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
    const operationalProfit = totalGrossRevenue - totalCmvCost - totalCommissions - totalSellerShippingCost;
    const finalNetProfit = operationalProfit - totalAdSpend;

    const channelsArray: ChannelPerformance[] = (
      Object.keys(channelStats) as SalesChannel[]
    ).map((c) => {
      const s = channelStats[c];
      const net = s.gross - s.cost - s.commissions - s.seller_shipping;
      const effectiveRate = s.gross > 0 ? (s.commissions / s.gross) * 100 : 0;
      return {
        channel: c,
        channel_name: CHANNEL_LABELS[c],
        orders_count: s.count,
        gross_revenue: s.gross,
        product_cost: s.cost,
        commissions: s.commissions,
        percentage_commissions: s.percentage_commissions,
        fixed_fees: s.fixed_fees,
        seller_shipping: s.seller_shipping,
        effective_commission_rate: effectiveRate,
        net_profit: net,
        net_margin_percent: s.gross > 0 ? (net / s.gross) * 100 : 0,
      };
    });

    const mktPricesMap = marketplacePricesData as Record<
      string,
      {
        sku: string;
        base_price?: number;
        channels?: Record<string, number | undefined>;
      }
    >;

    const productsArray: ProductProfitSummary[] = Array.from(productStats.values())
      .map((p) => {
        const net = p.has_missing_cost ? 0 : (p.revenue - p.cost - p.commissions);
        const skuKey = (p.sku || "").toUpperCase().trim();
        const mktInfo = mktPricesMap[skuKey];
        const channelKey = p.channel; // 'shopee' | 'mercadolivre' | 'site' | 'tiktok'
        const channelListingPrice = mktInfo?.channels?.[channelKey];
        const unitAvgPrice = p.units > 0 ? p.revenue / p.units : 0;
        const resolvedBasePrice = p.base_price ?? mktInfo?.base_price;

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
          percentage_commissions: p.percentage_commissions,
          fixed_fees: p.fixed_fees,
          base_price: resolvedBasePrice,
          channel_listing_price: channelListingPrice,
          unit_avg_price: unitAvgPrice,
          net_profit: net,
          net_margin_percent: p.revenue > 0 && !p.has_missing_cost ? (net / p.revenue) * 100 : 0,
          is_own_production: p.is_own_production,
          has_missing_cost: p.has_missing_cost,
          is_active: p.is_active,
        };
      })
      .sort((a, b) => b.units_sold - a.units_sold);

    const platformLabels: Record<AdPlatform, string> = {
      meta_ads: "Meta Ads (Instagram & Facebook)",
      shopee_ads: "Shopee Ads",
      mercado_ads: "Mercado Ads (Mercado Livre)",
      tiktok_ads: "TikTok Ads",
      google_ads: "Google Ads",
    };

    const activeAdPlatforms: AdPlatform[] = ["meta_ads", "shopee_ads", "mercado_ads", "tiktok_ads"];
    const platformToChannel: Record<AdPlatform, SalesChannel> = {
      shopee_ads: "shopee",
      mercado_ads: "mercadolivre",
      tiktok_ads: "tiktok",
      meta_ads: "site",
      google_ads: "site",
    };

    const adSummaryArray: AdSpendSummary[] = activeAdPlatforms.map((p) => {
      const info = adSummaryByPlatform[p] || { spent: 0, imp: 0, clk: 0, conv: 0 };
      const chKey = platformToChannel[p];
      const chRevenue = channelStats[chKey]?.gross || 0;
      // ROAS atribuído rigorosamente ao faturamento do canal correspondente
      const platformRoas = info.spent > 0 && chRevenue > 0 ? chRevenue / info.spent : 0;

      return {
        platform: p,
        platform_name: platformLabels[p],
        total_spent: info.spent,
        impressions: info.imp,
        clicks: info.clk,
        conversions: info.conv,
        roas: platformRoas,
      };
    });

    const overallRoas = totalAdSpend > 0 ? totalGrossRevenue / totalAdSpend : 0;
    const avgTicket = matchingOrdersCount > 0 ? totalGrossRevenue / matchingOrdersCount : 0;

    const timelineArray = Array.from(dailyMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    );

    const allHistoricalOrders = await getAllTimeOrders();
    const monthlyHistory = getMonthlySalesHistory(allHistoricalOrders);
    const allTimeRaw = await getAllTimeProducts(costMapByTrayId, costMapBySku, liveTrayProductsMap, mktPricesMap);
    const allTimeProducts = scope === "textil" ? allTimeRaw.filter(p => p.is_own_production) : allTimeRaw;

    const responsePayload: DashboardResponse = {
      period_days: days,
      start_date: startDate,
      end_date: endDate,
      scope,
      missing_costs_count: totalMissingCostsCount,
      tray_warning: trayWarning,
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
        gross_revenue: totalCustomerPaid > 0 ? totalCustomerPaid : totalGrossRevenue,
        shipping_cost: totalSellerShippingCost,
        third_party_shipping: totalThirdPartyShippingCost,
        items_revenue: totalItemsRevenue,
        product_cost_cmv: totalCmvCost,
        platform_commissions: totalCommissions,
        operational_profit: operationalProfit,
        operational_margin_percent:
          totalItemsRevenue > 0
            ? (operationalProfit / totalItemsRevenue) * 100
            : totalCustomerPaid > 0
            ? (operationalProfit / totalCustomerPaid) * 100
            : 0,
        total_ad_spend: totalAdSpend,
        final_net_profit: finalNetProfit,
        final_net_margin_percent:
          totalItemsRevenue > 0
            ? (finalNetProfit / totalItemsRevenue) * 100
            : totalCustomerPaid > 0
            ? (finalNetProfit / totalCustomerPaid) * 100
            : 0,
        average_ticket: matchingOrdersCount > 0 ? (totalCustomerPaid > 0 ? totalCustomerPaid : totalGrossRevenue) / matchingOrdersCount : 0,
        overall_roas: overallRoas,
      },
      channels: channelsArray,
      products: productsArray,
      all_time_products: allTimeProducts,
      monthly_history: monthlyHistory,
      daily_timeline: timelineArray,
      ads: {
        total_spent: totalAdSpend,
        by_platform: adSummaryArray,
        recent_records: recentAdRecords,
      },
      recent_orders: recentOrdersList,
    };

    return NextResponse.json(responsePayload);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json(
      { message: "Erro ao processar métricas do dashboard.", error: errorMsg },
      { status: 500 },
    );
  }
}
