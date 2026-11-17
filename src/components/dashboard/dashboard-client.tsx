"use client";

import { useEffect, useState, useTransition, Fragment } from "react";
import Link from "next/link";
import type {
  DashboardResponse,
  SalesChannel,
  AdPlatform,
  AdSpendRecord,
} from "@/types/dashboard";

const money = (v?: number | null) =>
  v == null
    ? "R$ 0,00"
    : new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(v);

const percent = (v?: number | null) =>
  v == null ? "0,0%" : `${v.toFixed(1).replace(".", ",")}%`;

/**
 * Ícone oficial vetorizado da Shopee (Bolsa oficial com monograma S).
 */
function ShopeeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fill="#EE4D2D"
        d="M15.9414 17.9633c.229-1.879-.981-3.077-4.1758-4.0969-1.548-.528-2.277-1.22-2.26-2.1719.065-1.056 1.048-1.825 2.352-1.85a5.2898 5.2898 0 0 1 2.8838.89c.116.072.197.06.263-.039.09-.145.315-.494.39-.62.051-.081.061-.187-.068-.281-.185-.1369-.704-.4149-.983-.5319a6.4697 6.4697 0 0 0-2.5118-.514c-1.909.008-3.4129 1.215-3.5389 2.826-.082 1.1629.494 2.1078 1.73 2.8278.262.152 1.6799.716 2.2438.892 1.774.552 2.695 1.5419 2.478 2.6969-.197 1.047-1.299 1.7239-2.818 1.7439-1.2039-.046-2.2878-.537-3.1278-1.19l-.141-.11c-.104-.08-.218-.075-.287.03-.05.077-.376.547-.458.67-.077.108-.035.168.045.234.35.293.817.613 1.134.775a6.7097 6.7097 0 0 0 2.8289.727 4.9048 4.9048 0 0 0 2.0759-.354c1.095-.465 1.8029-1.394 1.9449-2.554zM11.9986 1.4009c-2.068 0-3.7539 1.95-3.8329 4.3899h7.6657c-.08-2.44-1.765-4.3899-3.8328-4.3899zm7.8516 22.5981-.08.001-15.7843-.002c-1.074-.04-1.863-.91-1.971-1.991l-.01-.195L1.298 6.2858a.459.459 0 0 1 .45-.494h4.9748C6.8448 2.568 9.1607 0 11.9996 0c2.8388 0 5.1537 2.5689 5.2757 5.7898h4.9678a.459.459 0 0 1 .458.483l-.773 15.5883-.007.131c-.094 1.094-.979 1.9769-2.0709 2.0059z"
      />
    </svg>
  );
}

/**
 * Ícone oficial vetorizado do Mercado Livre (Aperto de Mãos com Fundo Amarelo).
 */
function MercadoLivreIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="7" fill="#FFE600" />
      <g transform="translate(4, 7)">
        <path
          d="M0 10.5l4-3.5c.8-.7 2-.6 2.7.2l1.6 1.8c.4.4 1 .4 1.4 0l1.8-1.6c.8-.7 2-.7 2.8 0l1.6 1.5c.4.4 1 .4 1.4 0l1.8-1.6c.7-.6 1.8-.6 2.5.1L24 9.5"
          stroke="#2D3277"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 13.5l3.8-3.3c.7-.6 1.8-.6 2.5.1l1.8 1.9c.4.4 1 .4 1.4 0l1.8-1.6c.7-.6 1.8-.6 2.5.1l1.8 1.9c.4.4 1 .4 1.4 0l2-1.8"
          stroke="#2D3277"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/**
 * Ícone oficial vetorizado do TikTok Shop (Cromático ciano/magenta sobre preto).
 */
function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#000000" />
      <g transform="scale(0.85) translate(2, 2)">
        <path
          d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
          fill="#25F4EE"
          transform="translate(-0.5, -0.5)"
        />
        <path
          d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
          fill="#FE2C55"
          transform="translate(0.5, 0.5)"
        />
        <path
          d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  );
}

/**
 * Ícone oficial da Loja Virtual (Tray Commerce em Azul #00A3E0).
 */
function TrayStoreIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#00A3E0" />
      <path
        d="M6 7.5h12M12 7.5v9.5M8.5 17h7"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="17.5" cy="16.5" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

const CHANNEL_CONFIG: Record<
  SalesChannel,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    Icon: React.FC<{ className?: string }>;
  }
> = {
  site: {
    label: "Loja Virtual",
    bg: "bg-sky-50 text-sky-900 border-sky-200",
    text: "text-sky-700",
    border: "border-sky-300",
    Icon: TrayStoreIcon,
  },
  shopee: {
    label: "Shopee",
    bg: "bg-orange-50 text-orange-950 border-orange-200",
    text: "text-orange-700",
    border: "border-orange-300",
    Icon: ShopeeIcon,
  },
  mercadolivre: {
    label: "Mercado Livre",
    bg: "bg-amber-50 text-amber-950 border-amber-200",
    text: "text-amber-800",
    border: "border-amber-300",
    Icon: MercadoLivreIcon,
  },
  tiktok: {
    label: "TikTok Shop",
    bg: "bg-zinc-900 text-zinc-100 border-zinc-700",
    text: "text-zinc-100",
    border: "border-zinc-700",
    Icon: TikTokIcon,
  },
};

const PLATFORM_LABELS: Record<AdPlatform, string> = {
  shopee_ads: "Shopee Ads",
  mercado_ads: "Mercado Ads",
  tiktok_ads: "TikTok Ads",
  meta_ads: "Meta Ads (Instagram / Facebook)",
  google_ads: "Google Ads",
};

/**
 * Retorna o canal normalizado para mapear com o ícone.
 */
function getChannelKey(channelName: string): SalesChannel {
  const norm = channelName.toLowerCase();
  if (norm.includes("shopee")) return "shopee";
  if (norm.includes("mercado")) return "mercadolivre";
  if (norm.includes("tiktok")) return "tiktok";
  return "site";
}

/**
 * Painel Administrativo de Métricas de Vendas, Lucratividade e Investimento em Anúncios.
 *
 * @description
 * Interface interativa que consolida pedidos da Tray Commerce e campanhas publicitárias:
 * 1. KPIs financeiros em tempo real (Faturamento Bruto, CMV, Comissões e Lucro Líquido)
 * 2. Miniaturas das fotos de prévia dos produtos (Thumbnails 44x44px)
 * 3. Ícones vetorizados oficiais por canal (Shopee, Mercado Livre, TikTok Shop e Loja Virtual)
 * 4. Tabela de rentabilidade por produto ordenado pelo maior lucro líquido acumulado
 * 5. Aba dedicada de Anúncios com cálculo de ROAS, CAC e Lucro Real pós-marketing
 * 6. Modal integrado para lançamento de gastos de campanhas no Supabase
 *
 * @returns {JSX.Element} Dashboard operacional completa
 * @since v3.0.0
 * @category Dashboard
 */
export function DashboardClient() {
  const [days, setDays] = useState<number>(30);
  const [channel, setChannel] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"vendas" | "anuncios">("vendas");
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para itens expansíveis / clicáveis (drill-down de pedidos e produtos)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [expandedProductSku, setExpandedProductSku] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Estados de busca rápida e filtros operacionais
  const [productSearch, setProductSearch] = useState<string>("");
  const [orderSearch, setOrderSearch] = useState<string>("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<"todos" | "a_enviar" | "enviados">("todos");
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Exportação para planilha Excel / CSV
  const handleExportCsv = () => {
    if (!data?.products || data.products.length === 0) {
      alert("Nenhum dado disponível para exportar.");
      return;
    }

    const headers = [
      "Produto",
      "SKU / Referencia",
      "Canal Principal",
      "Unidades Vendidas",
      "Faturamento Bruto (R$)",
      "Custo Total CMV (R$)",
      "Comissoes Canal (R$)",
      "Lucro Liquido (R$)",
      "Margem Liquida (%)",
      "Estoque Atual",
    ];

    const rows = data.products.map((p) => [
      `"${p.name.replace(/"/g, '""').replace(/<br\s*\/?>/gi, " - ")}"`,
      `"${p.sku}"`,
      `"${p.main_channel}"`,
      p.units_sold,
      p.total_revenue.toFixed(2).replace(".", ","),
      p.total_cost.toFixed(2).replace(".", ","),
      p.total_commissions.toFixed(2).replace(".", ","),
      p.net_profit.toFixed(2).replace(".", ","),
      p.net_margin_percent.toFixed(1).replace(".", ","),
      p.stock_quantity != null ? p.stock_quantity : "—",
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio-lucro-mesaegraca-${days}dias.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Modal de Novo Lançamento de Anúncio
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [savingAd, setSavingAd] = useState<boolean>(false);
  const [adForm, setAdForm] = useState<{
    platform: AdPlatform;
    date: string;
    amount_spent: string;
    impressions: string;
    clicks: string;
    conversions: string;
    campaign_name: string;
    notes: string;
  }>({
    platform: "shopee_ads",
    date: new Date().toISOString().split("T")[0],
    amount_spent: "",
    impressions: "",
    clicks: "",
    conversions: "",
    campaign_name: "",
    notes: "",
  });

  // Modo de visualização de pedidos: "all" (bater 1:1 com a Tray) ou "approved" (somente válidos)
  const [orderViewMode, setOrderViewMode] = useState<"all" | "approved">("all");

  const [isPending, startTransition] = useTransition();

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/dashboard?days=${days}&channel=${channel}&status=${orderViewMode}`
      );
      if (!res.ok) {
        throw new Error(`Erro ${res.status}: não foi possível carregar a dashboard.`);
      }
      const json: DashboardResponse = await res.json();
      startTransition(() => {
        setData(json);
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido ao carregar dados.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [days, channel, orderViewMode]);

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adForm.amount_spent || Number(adForm.amount_spent) <= 0) {
      alert("Informe um valor válido investido em anúncio.");
      return;
    }

    setSavingAd(true);
    try {
      const res = await fetch("/api/admin/dashboard/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: adForm.platform,
          date: adForm.date,
          amount_spent: Number(adForm.amount_spent),
          impressions: Number(adForm.impressions || 0),
          clicks: Number(adForm.clicks || 0),
          conversions: Number(adForm.conversions || 0),
          campaign_name: adForm.campaign_name,
          notes: adForm.notes,
        }),
      });

      if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.message || "Erro ao salvar lançamento de anúncio.");
      }

      setModalOpen(false);
      setAdForm({
        platform: "shopee_ads",
        date: new Date().toISOString().split("T")[0],
        amount_spent: "",
        impressions: "",
        clicks: "",
        conversions: "",
        campaign_name: "",
        notes: "",
      });
      await loadDashboard();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao cadastrar anúncio.";
      alert(msg);
    } finally {
      setSavingAd(false);
    }
  };

  const kpis = data?.kpis;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-16 font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-stone-500 hover:text-stone-900 text-sm font-medium flex items-center gap-1 transition"
            >
              <span>←</span> Painel Catálogo
            </Link>
            <span className="text-stone-300">|</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-amber-950">
                Mesa &amp; Graça
              </span>
              <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                Financial Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleExportCsv}
              className="border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-medium px-3 py-2 rounded-lg transition flex items-center gap-1.5"
              title="Baixar planilha compatível com Excel"
            >
              <span>📥</span> Exportar CSV
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg shadow-xs transition flex items-center gap-1.5"
            >
              <span>+</span> Lançar Anúncio
            </button>
            <button
              onClick={loadDashboard}
              disabled={loading}
              className="border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-medium px-3 py-2 rounded-lg transition"
              title="Recarregar dados"
            >
              {loading ? "Atualizando..." : "↻ Atualizar"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Page Title & Subtitle */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              Dashboard de Vendas &amp; Lucratividade
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Visão unificada das vendas nos 4 canais (Site, Shopee, Mercado Livre, TikTok Shop) e retorno de anúncios.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-xl border border-stone-200 shadow-xs">
            <div className="flex items-center gap-1 pr-2 border-r border-stone-200">
              {[7, 15, 30, 60].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition ${
                    days === d
                      ? "bg-amber-950 text-white shadow-xs"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {d} dias
                </button>
              ))}
            </div>

            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="text-xs font-medium bg-transparent text-stone-700 border-none focus:ring-0 cursor-pointer pl-1 pr-6 py-1.5"
            >
              <option value="all">Todos os Canais</option>
              <option value="site">🛒 Loja Virtual</option>
              <option value="shopee">🟠 Shopee</option>
              <option value="mercadolivre">🟡 Mercado Livre</option>
              <option value="tiktok">⚫ TikTok Shop</option>
            </select>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 mb-6 gap-2">
          <button
            onClick={() => setActiveTab("vendas")}
            className={`pb-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "vendas"
                ? "border-amber-950 text-amber-950"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <span>📊 Vendas, Margens &amp; Lucro por Produto</span>
            {kpis && (
              <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-medium">
                {kpis.total_orders} pedidos
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("anuncios")}
            className={`pb-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === "anuncios"
                ? "border-amber-950 text-amber-950"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <span>📢 Investimento em Anúncios &amp; ROAS</span>
            {kpis && kpis.total_ad_spend > 0 && (
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                ROAS {kpis.overall_roas.toFixed(1)}x
              </span>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* TAB 1: VENDAS & MARGENS */}
        {activeTab === "vendas" && (
          <div className="space-y-6">
            {/* Bloco de Conferência Oficial com o Painel da Tray */}
            {data?.tray_kpis && (
              <div className="bg-gradient-to-br from-white via-sky-50/30 to-amber-50/20 rounded-2xl border border-sky-200/90 p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sky-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white text-lg shadow-xs flex-shrink-0">
                      🛒
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-bold text-stone-900 tracking-tight">
                          Conferência com o Painel da Tray (Últimos 30 Dias)
                        </h2>
                        <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                          100% Sincronizado com a Tray
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Valores oficiais informados diretamente no topo da lista de pedidos da sua loja Tray.
                      </p>
                    </div>
                  </div>

                  {/* Seletor Amigável de Visão */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 shadow-xs self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setOrderViewMode("all")}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                        orderViewMode === "all"
                          ? "bg-sky-600 text-white shadow-xs"
                          : "text-stone-600 hover:bg-stone-100"
                      }`}
                      title="Exibe todos os pedidos exatamente como no painel da Tray"
                    >
                      Todos ({data.tray_kpis.total_orders_count}) · Igual Tray
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderViewMode("approved")}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                        orderViewMode === "approved"
                          ? "bg-emerald-700 text-white shadow-xs"
                          : "text-stone-600 hover:bg-stone-100"
                      }`}
                      title="Exclui pedidos cancelados para apuração do caixa efetivado"
                    >
                      Aprovados ({data.tray_kpis.active_orders_count}) · Caixa Real
                    </button>
                  </div>
                </div>

                {/* Os 4 Cards Oficiais Idênticos à Tray */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
                  <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                        Pedidos
                      </span>
                      <span className="text-stone-400 text-xs">📦</span>
                    </div>
                    <p className="text-2xl font-bold text-stone-900 mt-1">
                      {data.tray_kpis.total_orders_count}
                    </p>
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      {data.tray_kpis.active_orders_count} válidos · {data.tray_kpis.cancelled_orders_count} cancelado
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                        Total dos Pedidos
                      </span>
                      <span className="text-sky-500 text-xs">💵</span>
                    </div>
                    <p className="text-2xl font-bold text-sky-950 mt-1">
                      {money(data.tray_kpis.total_orders_revenue)}
                    </p>
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      Faturamento total pago pelos clientes
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                        Produtos Vendidos
                      </span>
                      <span className="text-amber-500 text-xs">🏷️</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-950 mt-1">
                      {money(data.tray_kpis.products_sold_revenue)}
                    </p>
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      Subtotal de produtos (sem fretes/cupons)
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                        Ticket Médio
                      </span>
                      <span className="text-emerald-500 text-xs">🎯</span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-950 mt-1">
                      {money(data.tray_kpis.average_ticket)}
                    </p>
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      Gasto médio por pedido
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Régua Didática e Visual: "Como Funciona o Cálculo do Lucro" */}
            <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">💡</span>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    Como o Lucro é Calculado? (Passo a Passo Visual)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Todas as informações são calculadas de forma transparente sem fórmulas escondidas.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-stone-50/90 p-3 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-white font-bold text-[10px] flex items-center justify-center">
                      1
                    </span>
                    <span className="font-bold text-stone-900 text-sm">Venda do Cliente</span>
                  </div>
                  <p className="text-stone-500 leading-relaxed text-[11px]">
                    O total recebido no pedido na Shopee, Mercado Livre, TikTok Shop ou Site.
                  </p>
                </div>

                <div className="bg-stone-50/90 p-3 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-stone-700 text-white font-bold text-[10px] flex items-center justify-center">
                      2
                    </span>
                    <span className="font-bold text-stone-800 text-sm">− Custo da Peça</span>
                  </div>
                  <p className="text-stone-500 leading-relaxed text-[11px]">
                    Tecido, bordado, linha e costura com base direta na sua <strong>Planilha de Custos</strong>.
                  </p>
                </div>

                <div className="bg-stone-50/90 p-3 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-orange-700 text-white font-bold text-[10px] flex items-center justify-center">
                      3
                    </span>
                    <span className="font-bold text-orange-800 text-sm">− Taxa do Canal</span>
                  </div>
                  <p className="text-stone-500 leading-relaxed text-[11px]">
                    A comissão que o marketplace retém (Shopee 18%, ML 16%, TikTok 7%, Loja 3,5%).
                  </p>
                </div>

                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center">
                      4
                    </span>
                    <span className="font-bold text-emerald-900 text-sm">= Lucro no Bolso</span>
                  </div>
                  <p className="text-emerald-800 leading-relaxed text-[11px]">
                    O dinheiro limpo que realmente fica no caixa da Mesa &amp; Graça após pagar tudo.
                  </p>
                </div>
              </div>
            </div>

            {/* Cards Financeiros Principais com Linguagem Amigável */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Card 1: Faturamento Bruto */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                  Total Faturado
                </span>
                <p className="text-2xl font-bold text-stone-900 mt-2">
                  {loading ? "..." : money(kpis?.gross_revenue)}
                </p>
                <div className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                  <span>{kpis?.total_orders || 0} pedidos</span> ·{" "}
                  <span>Méd.: {money(kpis?.average_ticket)}</span>
                </div>
              </div>

              {/* Card 2: Custo das Peças */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                  Custo das Peças (Tecido &amp; Confecção)
                </span>
                <p className="text-2xl font-bold text-stone-800 mt-2">
                  {loading ? "..." : money(kpis?.product_cost_cmv)}
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  {kpis && kpis.gross_revenue > 0
                    ? `${percent((kpis.product_cost_cmv / kpis.gross_revenue) * 100)} do total vendido`
                    : "—"}
                </p>
              </div>

              {/* Card 3: Taxas dos Marketplaces */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                  Taxas dos Marketplaces
                </span>
                <p className="text-2xl font-bold text-orange-800 mt-2">
                  {loading ? "..." : money(kpis?.platform_commissions)}
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  {kpis && kpis.gross_revenue > 0
                    ? `${percent((kpis.platform_commissions / kpis.gross_revenue) * 100)} retido pelos canais`
                    : "—"}
                </p>
              </div>

              {/* Card 4: Lucro das Vendas */}
              <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 block">
                  Lucro das Vendas
                </span>
                <p className="text-2xl font-bold text-emerald-900 mt-2">
                  {loading ? "..." : money(kpis?.operational_profit)}
                </p>
                <div className="text-xs font-medium text-emerald-700 mt-1">
                  Margem: {percent(kpis?.operational_margin_percent)}
                </div>
              </div>

              {/* Card 5: Lucro Final Pós-Ads */}
              <div className="bg-amber-950 text-white p-5 rounded-2xl shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-200 block">
                  Lucro Líquido no Bolso
                </span>
                <p className="text-2xl font-bold text-white mt-2">
                  {loading ? "..." : money(kpis?.final_net_profit)}
                </p>
                <div className="text-xs text-amber-300 mt-1">
                  Margem Líquida Real: {percent(kpis?.final_net_margin_percent)}
                </div>
              </div>
            </div>

            {/* Alerta Inteligente de Ruptura de Estoque para Produtos com Alto Lucro */}
            {(() => {
              const lowStockProducts = (data?.products || []).filter(
                (p) => p.stock_quantity != null && p.stock_quantity <= 8 && p.units_sold >= 2
              );
              if (lowStockProducts.length === 0) return null;

              return (
                <div className="bg-amber-50/70 border border-amber-300/80 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">⚠️</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-amber-950">
                        Alerta de Estoque Crítico em Produtos de Alta Rentabilidade
                      </h3>
                      <p className="text-xs text-amber-900/80 mt-0.5 mb-3">
                        Estes produtos possuem alta saída e excelente margem, mas estão com estoque reduzido no catálogo. Reponha para evitar pausa nos marketplaces.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {lowStockProducts.slice(0, 3).map((lp) => (
                          <div
                            key={lp.sku}
                            className="bg-white rounded-xl border border-amber-200 p-2.5 flex items-center gap-2.5 text-xs shadow-2xs"
                          >
                            <div className="w-10 h-10 rounded-lg border border-stone-200 bg-stone-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                              {lp.image_url ? (
                                <img src={lp.image_url} alt={lp.name} className="w-full h-full object-cover" />
                              ) : (
                                <span>🖼️</span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-stone-900 line-clamp-1">{lp.name}</div>
                              <div className="text-[11px] text-amber-800 font-medium">
                                Restam apenas: <strong className="font-bold text-rose-700">{lp.stock_quantity} un</strong>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Barra de Participação de Mercado (Market Share dos Canais) */}
            {data?.channels && data.channels.length > 0 && kpis && kpis.gross_revenue > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      Participação por Canal de Venda (Market Share)
                    </h3>
                    <p className="text-xs text-stone-500">
                      Divisão percentual do faturamento total de {money(kpis.gross_revenue)}
                    </p>
                  </div>
                  <span className="text-xs text-stone-500 font-mono font-medium">
                    {kpis.total_orders} pedidos
                  </span>
                </div>

                <div className="h-4 rounded-full overflow-hidden flex bg-stone-100 shadow-inner">
                  {data.channels.map((ch) => {
                    const pct = (ch.gross_revenue / kpis.gross_revenue) * 100;
                    if (pct <= 0) return null;
                    const colors: Record<SalesChannel, string> = {
                      shopee: "bg-[#EE4D2D]",
                      mercadolivre: "bg-[#FFE600]",
                      tiktok: "bg-black",
                      site: "bg-[#00A3E0]",
                    };
                    return (
                      <div
                        key={ch.channel}
                        style={{ width: `${pct}%` }}
                        className={`${colors[ch.channel]} transition-all duration-300`}
                        title={`${ch.channel_name}: ${percent(pct)} (${money(ch.gross_revenue)})`}
                      />
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-stone-100 text-xs">
                  {data.channels.map((ch) => {
                    const cfg = CHANNEL_CONFIG[ch.channel];
                    const Icon = cfg.Icon;
                    const pct = kpis.gross_revenue > 0 ? (ch.gross_revenue / kpis.gross_revenue) * 100 : 0;
                    return (
                      <div key={ch.channel} className="flex items-center gap-2">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-semibold text-stone-900 flex items-center gap-1">
                            <span>{cfg.label}:</span>
                            <span className="text-stone-700">{percent(pct)}</span>
                          </div>
                          <div className="text-[11px] text-stone-400 font-mono">
                            {money(ch.gross_revenue)} · {ch.orders_count} ped.
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Gráfico Interativo de Evolução Diária (Faturamento vs Lucro Líquido) */}
            {data?.daily_timeline && data.daily_timeline.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">
                      Curva de Faturamento &amp; Lucro Diário
                    </h2>
                    <p className="text-xs text-stone-500">
                      Passe o mouse ou toque nos pontos para ver os valores e pedidos de cada data.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold self-start sm:self-auto">
                    <span className="flex items-center gap-1.5 text-stone-700">
                      <span className="w-3 h-3 rounded-full bg-amber-700 inline-block" />
                      Faturamento Bruto
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                      Lucro Líquido
                    </span>
                  </div>
                </div>

                <div className="relative w-full overflow-hidden">
                  {(() => {
                    const timeline = data.daily_timeline;
                    const maxVal = Math.max(100, ...timeline.map((d) => d.gross_revenue)) * 1.15;
                    const W = 720;
                    const H = 150;
                    const padX = 40;
                    const padY = 25;

                    const getX = (idx: number) =>
                      timeline.length === 1 ? padX + W / 2 : padX + (idx / (timeline.length - 1)) * W;
                    const getY = (val: number) => padY + H - (Math.max(0, val) / maxVal) * H;

                    const grossPoints = timeline.map((d, i) => `${getX(i)},${getY(d.gross_revenue)}`);
                    const netPoints = timeline.map((d, i) => `${getX(i)},${getY(d.net_profit)}`);

                    const grossArea = `${padX},${padY + H} ${grossPoints.join(" ")} ${getX(
                      timeline.length - 1
                    )},${padY + H}`;
                    const netArea = `${padX},${padY + H} ${netPoints.join(" ")} ${getX(
                      timeline.length - 1
                    )},${padY + H}`;

                    return (
                      <div className="flex flex-col">
                        <svg
                          viewBox="0 0 800 210"
                          className="w-full h-44 sm:h-52 overflow-visible select-none"
                        >
                          <defs>
                            <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#b45309" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#b45309" stopOpacity="0.0" />
                            </linearGradient>
                            <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#059669" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Linhas de Grade Horizontais */}
                          {[0, 0.33, 0.66, 1].map((pct, gIdx) => {
                            const y = padY + H * (1 - pct);
                            const val = maxVal * pct;
                            return (
                              <g key={gIdx}>
                                <line
                                  x1={padX}
                                  y1={y}
                                  x2={padX + W}
                                  y2={y}
                                  stroke="#e7e5e4"
                                  strokeDasharray="4 4"
                                />
                                <text
                                  x={padX - 8}
                                  y={y + 3}
                                  textAnchor="end"
                                  className="text-[9px] fill-stone-400 font-mono"
                                >
                                  {money(val)}
                                </text>
                              </g>
                            );
                          })}

                          {/* Áreas Preenchidas */}
                          <polygon points={grossArea} fill="url(#grossGrad)" />
                          <polygon points={netArea} fill="url(#netGrad)" />

                          {/* Linha Faturamento Bruto */}
                          <polyline
                            points={grossPoints.join(" ")}
                            fill="none"
                            stroke="#b45309"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Linha Lucro Líquido */}
                          <polyline
                            points={netPoints.join(" ")}
                            fill="none"
                            stroke="#059669"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Pontos Interativos */}
                          {timeline.map((d, i) => {
                            const cx = getX(i);
                            const cyGross = getY(d.gross_revenue);
                            const cyNet = getY(d.net_profit);
                            const isHovered = hoveredPointIndex === i;

                            return (
                              <g
                                key={i}
                                onMouseEnter={() => setHoveredPointIndex(i)}
                                onMouseLeave={() => setHoveredPointIndex(null)}
                                className="cursor-pointer"
                              >
                                {isHovered && (
                                  <line
                                    x1={cx}
                                    y1={padY}
                                    x2={cx}
                                    y2={padY + H}
                                    stroke="#78716c"
                                    strokeWidth="1"
                                    strokeDasharray="2 2"
                                  />
                                )}
                                <circle
                                  cx={cx}
                                  cy={cyGross}
                                  r={isHovered ? 5.5 : 3.5}
                                  fill="#b45309"
                                  stroke="#ffffff"
                                  strokeWidth="2"
                                />
                                <circle
                                  cx={cx}
                                  cy={cyNet}
                                  r={isHovered ? 5.5 : 3.5}
                                  fill="#059669"
                                  stroke="#ffffff"
                                  strokeWidth="2"
                                />
                                <text
                                  x={cx}
                                  y={padY + H + 18}
                                  textAnchor="middle"
                                  className={`text-[10px] font-mono ${
                                    isHovered ? "fill-stone-900 font-bold" : "fill-stone-400"
                                  }`}
                                >
                                  {d.date.slice(5).replace("-", "/")}
                                </text>
                              </g>
                            );
                          })}
                        </svg>

                        {/* Tooltip Dinâmico ao passar o mouse */}
                        {hoveredPointIndex != null && timeline[hoveredPointIndex] && (
                          <div className="mt-2 p-2.5 bg-stone-900 text-white rounded-xl shadow-lg flex items-center justify-between text-xs max-w-sm mx-auto">
                            <div>
                              <span className="text-[10px] text-stone-400 block font-mono">
                                Data: {timeline[hoveredPointIndex].date}
                              </span>
                              <span className="font-semibold text-amber-200">
                                {timeline[hoveredPointIndex].orders_count} pedidos registrados
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-stone-300 block">
                                Faturamento: <strong className="text-white">{money(timeline[hoveredPointIndex].gross_revenue)}</strong>
                              </span>
                              <span className="text-emerald-300 font-bold block">
                                Lucro Real: {money(timeline[hoveredPointIndex].net_profit)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Comparativo de Desempenho por Canal com Ícones Oficiais */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-stone-900 mb-4">
                Desempenho por Canal de Venda
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data?.channels.map((ch) => {
                  const cfg = CHANNEL_CONFIG[ch.channel];
                  const Icon = cfg.Icon;
                  return (
                    <div
                      key={ch.channel}
                      className="border border-stone-200 rounded-xl p-4 bg-stone-50/40 hover:bg-stone-50 transition"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${cfg.bg}`}
                        >
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{cfg.label}</span>
                        </span>
                        <span className="text-xs font-medium text-stone-500">
                          {ch.orders_count} {ch.orders_count === 1 ? "pedido" : "pedidos"}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-stone-600">
                        <div className="flex justify-between">
                          <span>Faturamento:</span>
                          <strong className="text-stone-900">{money(ch.gross_revenue)}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Custo (CMV):</span>
                          <span>{money(ch.product_cost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taxas do Canal:</span>
                          <span className="text-orange-700">-{money(ch.commissions)}</span>
                        </div>
                        <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-sm">
                          <span className="font-semibold text-stone-800">Lucro Líquido:</span>
                          <strong className="text-emerald-700 font-bold">
                            {money(ch.net_profit)}
                          </strong>
                        </div>
                        <div className="text-right text-[11px] text-stone-400">
                          Margem: {percent(ch.net_margin_percent)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tabela de Lucro por Produto com Miniaturas e Ícones */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">
                    Rentabilidade &amp; Lucro por Produto
                  </h2>
                  <p className="text-xs text-stone-500">
                    Calculado deduzindo custo de fabricação e comissão exata do canal onde o item foi vendido.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full sm:w-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar produto ou SKU..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="text-xs border border-stone-300 rounded-lg pl-8 pr-3 py-1.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-950 w-full sm:w-60"
                    />
                    <span className="absolute left-2.5 top-1.5 text-stone-400 text-xs">🔍</span>
                  </div>
                  <span className="text-xs bg-stone-100 text-stone-600 px-3 py-1 rounded-lg font-medium self-start sm:self-auto whitespace-nowrap">
                    {data?.products?.filter((p) => !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase().trim()) || p.sku.toLowerCase().includes(productSearch.toLowerCase().trim())).length || 0} de {data?.products.length || 0} produtos
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200 uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Produto &amp; SKU</th>
                      <th className="py-3 px-3">Canal</th>
                      <th className="py-3 px-3 text-center">Unidades</th>
                      <th className="py-3 px-3 text-right">Faturamento</th>
                      <th className="py-3 px-3 text-right">Custo da Peça</th>
                      <th className="py-3 px-3 text-right">Taxa Canal</th>
                      <th className="py-3 px-4 text-right">Lucro Líquido</th>
                      <th className="py-3 px-3 text-center hidden md:table-cell">Divisão Visual</th>
                      <th className="py-3 px-4 text-right">Margem</th>
                      <th className="py-3 px-3 text-center">Detalhes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {(() => {
                      const list = (data?.products || []).filter((p) => {
                        if (!productSearch) return true;
                        const q = productSearch.toLowerCase().trim();
                        return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
                      });

                      if (list.length === 0) {
                        return (
                          <tr>
                            <td colSpan={10} className="py-8 text-center text-stone-400 text-xs">
                              {productSearch
                                ? `Nenhum produto encontrado para "${productSearch}".`
                                : "Nenhum produto vendido no período selecionado."}
                            </td>
                          </tr>
                        );
                      }

                      return list.map((p, idx) => {
                        const channelKey = getChannelKey(p.main_channel);
                        const cfg = CHANNEL_CONFIG[channelKey];
                        const Icon = cfg.Icon;
                        const isExpanded = expandedProductSku === p.sku;
                        const unitAvgPrice = p.units_sold > 0 ? p.total_revenue / p.units_sold : 0;
                        const unitCost = p.units_sold > 0 ? p.total_cost / p.units_sold : 0;
                        const unitCommission = p.units_sold > 0 ? p.total_commissions / p.units_sold : 0;
                        const unitProfit = p.units_sold > 0 ? p.net_profit / p.units_sold : 0;

                        return (
                          <Fragment key={p.sku || idx}>
                            <tr
                              onClick={() => setExpandedProductSku(isExpanded ? null : p.sku)}
                              className={`transition cursor-pointer select-none ${
                                isExpanded ? "bg-amber-50/50" : "hover:bg-stone-50/80"
                              }`}
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  {/* Miniatura de Prévia do Produto */}
                                  <div className="w-11 h-11 rounded-lg border border-stone-200 bg-stone-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                    {p.image_url ? (
                                      <img
                                        src={p.image_url}
                                        alt={p.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        onError={(e) => {
                                          (e.target as HTMLElement).style.display = "none";
                                        }}
                                      />
                                    ) : (
                                      <span className="text-stone-300 text-lg">🖼️</span>
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="font-semibold text-stone-900 line-clamp-1">
                                      {p.name.replace(/<br\s*\/?>/gi, " - ")}
                                    </div>
                                    <div className="text-[11px] font-mono text-stone-400">
                                      REF: {p.sku}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span
                                  className={`text-xs font-semibold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${cfg.bg}`}
                                >
                                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span>{cfg.label}</span>
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center font-bold text-stone-900">
                                {p.units_sold} un
                              </td>
                              <td className="py-3 px-3 text-right font-medium text-stone-900">
                                {money(p.total_revenue)}
                              </td>
                              <td className="py-3 px-3 text-right text-stone-500">
                                {money(p.total_cost)}
                              </td>
                              <td className="py-3 px-3 text-right text-orange-700">
                                -{money(p.total_commissions)}
                              </td>
                              <td className="py-3 px-4 text-right font-bold text-emerald-700">
                                {money(p.net_profit)}
                              </td>
                              <td className="py-3 px-3 hidden md:table-cell">
                                {(() => {
                                  const profitPct = p.total_revenue > 0 ? Math.max(0, (p.net_profit / p.total_revenue) * 100) : 0;
                                  const costPct = p.total_revenue > 0 ? Math.max(0, (p.total_cost / p.total_revenue) * 100) : 0;
                                  const commPct = p.total_revenue > 0 ? Math.max(0, (p.total_commissions / p.total_revenue) * 100) : 0;
                                  return (
                                    <div className="flex flex-col items-center gap-1">
                                      <div
                                        className="w-24 bg-stone-100 rounded-full h-2 flex overflow-hidden border border-stone-200"
                                        title={`Lucro: ${profitPct.toFixed(0)}% | Custo: ${costPct.toFixed(0)}% | Taxa Canal: ${commPct.toFixed(0)}%`}
                                      >
                                        <div style={{ width: `${profitPct}%` }} className="bg-emerald-500 h-full" />
                                        <div style={{ width: `${costPct}%` }} className="bg-stone-400 h-full" />
                                        <div style={{ width: `${commPct}%` }} className="bg-orange-400 h-full" />
                                      </div>
                                      <span className="text-[10px] text-emerald-700 font-semibold">
                                        {profitPct.toFixed(0)}% lucro
                                      </span>
                                    </div>
                                  );
                                })()}
                              </td>
                              <td className="py-3 px-4 text-right font-semibold text-stone-800">
                                {percent(p.net_margin_percent)}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  className="text-stone-400 hover:text-stone-700 transition p-1"
                                  title={isExpanded ? "Recolher detalhes" : "Expandir detalhes"}
                                >
                                  <svg
                                    className={`w-4 h-4 transform transition-transform duration-200 ${
                                      isExpanded ? "rotate-180 text-amber-800" : ""
                                    }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>

                            {/* Sub-painel expansível com detalhes completos do produto */}
                            {isExpanded && (
                              <tr className="bg-amber-50/25 border-y border-amber-200/60">
                                <td colSpan={10} className="p-4 sm:p-5">
                                  <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                                    <div className="flex items-center gap-4 min-w-0">
                                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-stone-200 bg-stone-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                        {p.image_url ? (
                                          <img
                                            src={p.image_url}
                                            alt={p.name}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <span className="text-3xl">🖼️</span>
                                        )}
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                          <span
                                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${cfg.bg}`}
                                          >
                                            <Icon className="w-3.5 h-3.5" />
                                            <span>Canal Principal: {cfg.label}</span>
                                          </span>
                                          <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                                            ID Tray: #{p.product_id}
                                          </span>
                                          {p.stock_quantity != null && (
                                            <span
                                              className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                                                p.stock_quantity <= 8
                                                  ? "bg-rose-100 text-rose-800 border border-rose-200"
                                                  : "bg-emerald-100 text-emerald-800"
                                              }`}
                                            >
                                              Estoque: {p.stock_quantity} un
                                            </span>
                                          )}
                                        </div>
                                        <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                                          {p.name.replace(/<br\s*\/?>/gi, " - ")}
                                        </h4>
                                        <p className="text-xs text-stone-500 font-mono mt-0.5">
                                          SKU / Referência: {p.sku}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Métricas Unitárias de Rentabilidade */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto text-xs">
                                      <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                                        <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                                          Preço Médio
                                        </span>
                                        <strong className="text-stone-900 text-sm">
                                          {money(unitAvgPrice)}
                                        </strong>
                                        <span className="text-[10px] text-stone-400 block">
                                          por peça
                                        </span>
                                      </div>

                                      <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                                        <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                                          Custo (CMV)
                                        </span>
                                        <strong className="text-stone-700 text-sm">
                                          {money(unitCost)}
                                        </strong>
                                        <span className="text-[10px] text-stone-400 block">
                                          por peça
                                        </span>
                                      </div>

                                      <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                                        <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                                          Comissão Canal
                                        </span>
                                        <strong className="text-orange-700 text-sm">
                                          -{money(unitCommission)}
                                        </strong>
                                        <span className="text-[10px] text-stone-400 block">
                                          por peça
                                        </span>
                                      </div>

                                      <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                                        <span className="text-emerald-700 block text-[10px] uppercase font-semibold">
                                          Lucro por Peça
                                        </span>
                                        <strong className="text-emerald-800 text-sm">
                                          {money(unitProfit)}
                                        </strong>
                                        <span className="text-[10px] text-emerald-600 block">
                                          Margem {percent(p.net_margin_percent)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Feed de Últimos Pedidos com Fotos, Ícones Reais e Detalhamento Expansível */}
            {(() => {
              const filteredOrders = (data?.recent_orders || []).filter((o) => {
                if (orderStatusFilter === "a_enviar") {
                  const s = (o.status || "").toLowerCase();
                  if (!s.includes("a enviar") && !s.includes("aguardando") && !s.includes("pendente")) return false;
                } else if (orderStatusFilter === "enviados") {
                  const s = (o.status || "").toLowerCase();
                  if (!s.includes("enviado") && !s.includes("entregue") && !s.includes("finalizado")) return false;
                }
                if (!orderSearch) return true;
                const q = orderSearch.toLowerCase().trim();
                return (
                  o.id.toLowerCase().includes(q) ||
                  (o.customer_city || "").toLowerCase().includes(q) ||
                  (o.customer_state || "").toLowerCase().includes(q) ||
                  o.items?.some((it) => it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q))
                );
              });

              return (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
                    <div>
                      <h2 className="text-lg font-bold text-stone-900">
                        Últimos Pedidos Recebidos (Tray &amp; Marketplaces)
                      </h2>
                      <p className="text-xs text-stone-500">
                        Clique em qualquer pedido para expandir os produtos, fotos e conferência contábil completa.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Filtros rápidos de Status */}
                      <div className="flex items-center bg-stone-100 p-1 rounded-xl gap-1 text-xs font-semibold">
                        <button
                          onClick={() => setOrderStatusFilter("todos")}
                          className={`px-3 py-1 rounded-lg transition ${
                            orderStatusFilter === "todos"
                              ? "bg-white text-stone-900 shadow-2xs"
                              : "text-stone-500 hover:text-stone-800"
                          }`}
                        >
                          Todos ({data?.recent_orders?.length || 0})
                        </button>
                        <button
                          onClick={() => setOrderStatusFilter("a_enviar")}
                          className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 ${
                            orderStatusFilter === "a_enviar"
                              ? "bg-emerald-700 text-white shadow-2xs"
                              : "text-emerald-800 hover:bg-emerald-50"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                          A Enviar
                        </button>
                        <button
                          onClick={() => setOrderStatusFilter("enviados")}
                          className={`px-3 py-1 rounded-lg transition ${
                            orderStatusFilter === "enviados"
                              ? "bg-white text-stone-900 shadow-2xs"
                              : "text-stone-500 hover:text-stone-800"
                          }`}
                        >
                          Enviados
                        </button>
                      </div>

                      {/* Busca de Pedidos */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Buscar pedido, cidade, item..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          className="text-xs border border-stone-300 rounded-lg pl-7 pr-3 py-1.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-950 w-44 sm:w-56"
                        />
                        <span className="absolute left-2.5 top-1.5 text-stone-400 text-xs">🔍</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((o) => {
                    const cfg = CHANNEL_CONFIG[o.channel];
                    const Icon = cfg.Icon;
                    const isExpanded = expandedOrderId === o.id;

                    return (
                      <div
                        key={o.id}
                        onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                        className={`p-3.5 rounded-xl border transition cursor-pointer select-none flex flex-col justify-between gap-3 ${
                          isExpanded
                            ? "border-amber-400 bg-amber-50/20 shadow-xs ring-1 ring-amber-300"
                            : "border-stone-200 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300"
                        }`}
                      >
                        {/* Cabeçalho do Pedido */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border inline-flex items-center gap-1.5 ${cfg.bg}`}
                            >
                              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                              <span>{cfg.label}</span>
                            </span>
                            {o.status && (
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                  (o.status || "").toLowerCase().includes("a enviar") ||
                                  (o.status || "").toLowerCase().includes("aguardando")
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    : (o.status || "").toLowerCase().includes("cancel")
                                    ? "bg-rose-50 text-rose-800 border-rose-200"
                                    : "bg-stone-100 text-stone-700 border-stone-200"
                                }`}
                              >
                                {o.status}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-stone-600 font-mono font-bold">
                              Pedido #{o.id}
                            </span>
                            <svg
                              className={`w-3.5 h-3.5 text-stone-400 transform transition-transform duration-200 ${
                                isExpanded ? "rotate-180 text-amber-800" : ""
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Fotos e Miniaturas dos Produtos do Pedido */}
                        <div className="py-1">
                          {o.items && o.items.length > 0 ? (
                            o.items.length === 1 ? (
                              <div className="flex items-center gap-2.5">
                                <div className="w-12 h-12 rounded-lg border border-stone-200 bg-stone-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                  {o.items[0].image_url ? (
                                    <img
                                      src={o.items[0].image_url}
                                      alt={o.items[0].name}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = "none";
                                      }}
                                    />
                                  ) : (
                                    <span className="text-stone-300 text-sm">📦</span>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-semibold text-stone-900 line-clamp-1">
                                    {o.items[0].name.replace(/<br\s*\/?>/gi, " - ")}
                                  </div>
                                  <div className="text-[11px] text-stone-500 font-mono">
                                    Qtd: {o.items[0].quantity} {o.items[0].quantity === 1 ? "peça" : "peças"} · {o.items[0].sku}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                                  {o.items.slice(0, 3).map((it, iIdx) => (
                                    <div
                                      key={iIdx}
                                      className="relative w-10 h-10 rounded-lg border border-stone-200 bg-stone-100 flex-shrink-0 overflow-hidden flex items-center justify-center"
                                      title={`${it.name} (${it.quantity}x)`}
                                    >
                                      {it.image_url ? (
                                        <img
                                          src={it.image_url}
                                          alt={it.name}
                                          className="w-full h-full object-cover"
                                          loading="lazy"
                                          onError={(e) => {
                                            (e.target as HTMLElement).style.display = "none";
                                          }}
                                        />
                                      ) : (
                                        <span className="text-stone-300 text-xs">📦</span>
                                      )}
                                      {it.quantity > 1 && (
                                        <span className="absolute bottom-0 right-0 bg-stone-900/80 text-white text-[9px] font-bold px-1 rounded-tl-sm">
                                          {it.quantity}x
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                  {o.items.length > 3 && (
                                    <span className="text-[10px] font-semibold text-stone-500 bg-stone-200/80 px-1.5 py-1 rounded-md flex-shrink-0">
                                      +{o.items.length - 3} mais
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-stone-500 min-w-0 flex-1 pl-1 line-clamp-1">
                                  {o.items[0].name.replace(/<br\s*\/?>/gi, " - ")}
                                </div>
                              </div>
                            )
                          ) : (
                            <div className="text-xs text-stone-400 italic">
                              {o.items_count} {o.items_count === 1 ? "peça" : "peças"}
                            </div>
                          )}
                        </div>

                        {/* Metadados: Data, Hora, Localidade e Transportadora */}
                        <div className="text-xs text-stone-600 flex justify-between items-center gap-2 flex-wrap">
                          <span className="font-medium">
                            {o.date} {o.hour ? `às ${o.hour}` : ""} · {o.items_count} {o.items_count === 1 ? "peça" : "peças"}
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                            {o.customer_city && (
                              <span>
                                {o.customer_city}/{o.customer_state}
                              </span>
                            )}
                            {o.shipment_name && (
                              <span className="bg-stone-200/80 px-1.5 py-0.5 rounded text-[10px] font-medium text-stone-700">
                                📦 {o.shipment_name}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Valores Resumidos */}
                        <div className="pt-2 border-t border-stone-200 flex justify-between items-start text-xs">
                          <div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-stone-500 text-[11px]">Total: </span>
                              <strong className="text-stone-900 font-bold text-sm">
                                {money(o.total)}
                              </strong>
                            </div>
                            {o.shipment_value != null && o.shipment_value > 0 && o.products_subtotal != null && (
                              <span className="text-[10px] text-stone-400 block mt-0.5">
                                Prods: {money(o.products_subtotal)} · Frete: +{money(o.shipment_value)}
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="flex items-baseline justify-end gap-1">
                              <span className="text-stone-500 text-[11px]">Lucro est.: </span>
                              <strong className="text-emerald-700 font-bold text-sm">
                                {money(o.net_profit)}
                              </strong>
                            </div>
                            {o.net_margin_percent != null && (
                              <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">
                                Margem: {percent(o.net_margin_percent)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Detalhamento Expansível do Pedido */}
                        {isExpanded && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="mt-2 pt-3 border-t border-stone-200/80 space-y-3 cursor-default"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                                  Itens do Pedido ({o.items?.length || 0})
                                </span>
                                <span className="text-[10px] text-stone-400">
                                  Detalhamento Unitário & Total
                                </span>
                              </div>
                              <div className="space-y-2.5">
                                {o.items?.map((it, itemIdx) => {
                                  const itemQty = it.quantity || 1;
                                  const unitPrice = it.price || 0;
                                  const unitCost = it.unit_cost ?? it.cost ?? 0;
                                  const unitComm = it.unit_commission ?? 0;
                                  const unitProfit = it.unit_net_profit ?? (unitPrice - unitCost - unitComm);
                                  const marginPct = it.net_margin_percent ?? (unitPrice > 0 ? (unitProfit / unitPrice) * 100 : 0);

                                  const totalItemRevenue = unitPrice * itemQty;
                                  const totalItemCost = unitCost * itemQty;
                                  const totalItemComm = it.total_commission ?? (unitComm * itemQty);
                                  const totalItemProfit = it.total_net_profit ?? (unitProfit * itemQty);

                                  return (
                                    <div
                                      key={itemIdx}
                                      className="bg-white rounded-xl border border-stone-200 p-2.5 shadow-xs space-y-2 text-xs"
                                    >
                                      {/* Topo do Item: Miniatura, Título, SKU e Estoque */}
                                      <div className="flex items-start gap-2.5">
                                        <div className="relative w-12 h-12 rounded-lg border border-stone-200 bg-stone-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                          {it.image_url ? (
                                            <img
                                              src={it.image_url}
                                              alt={it.name}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <span className="text-stone-300 text-sm">📦</span>
                                          )}
                                          <span className="absolute bottom-0 right-0 bg-stone-900/85 text-white font-mono text-[9px] px-1 rounded-tl">
                                            {itemQty}x
                                          </span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                          <div className="font-semibold text-stone-900 leading-snug line-clamp-2">
                                            {it.name.replace(/<br\s*\/?>/gi, " - ")}
                                          </div>
                                          <div className="flex items-center gap-1.5 mt-1 flex-wrap text-[10px]">
                                            <span className="text-stone-500 font-mono font-medium bg-stone-100 px-1.5 py-0.5 rounded">
                                              REF: {it.sku}
                                            </span>
                                            {it.stock_quantity != null && (
                                              <span
                                                className={`px-1.5 py-0.5 rounded font-semibold ${
                                                  it.stock_quantity <= 8
                                                    ? "bg-rose-100 text-rose-800 border border-rose-200"
                                                    : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                                }`}
                                              >
                                                Estoque: {it.stock_quantity} un
                                              </span>
                                            )}
                                            {it.product_url && (
                                              <a
                                                href={it.product_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-amber-800 hover:text-amber-950 font-medium underline inline-flex items-center gap-0.5"
                                              >
                                                Ver no Site ↗
                                              </a>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Grade de Decomposição Financeira do Item: Unitário vs Total */}
                                      <div className="bg-stone-50/80 rounded-lg p-2 border border-stone-200/70 text-[11px] grid grid-cols-2 gap-2.5">
                                        {/* Coluna 1: Métricas Unitárias */}
                                        <div className="space-y-0.5 border-r border-stone-200/80 pr-2">
                                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
                                            Unitário ({money(unitPrice)})
                                          </span>
                                          <div className="flex justify-between text-stone-600">
                                            <span>Custo (CMV un.):</span>
                                            <span className="text-stone-800 font-medium">-{money(unitCost)}</span>
                                          </div>
                                          <div className="flex justify-between text-stone-600">
                                            <span>Comissão un.:</span>
                                            <span className="text-orange-700">-{money(unitComm)}</span>
                                          </div>
                                          <div className="flex justify-between pt-1 border-t border-stone-200/60 font-semibold">
                                            <span className="text-stone-700">Lucro Unit.:</span>
                                            <span className="text-emerald-700">{money(unitProfit)}</span>
                                          </div>
                                          <div className="flex justify-between text-[10px] text-stone-500">
                                            <span>Margem Unit.:</span>
                                            <span className="font-semibold text-emerald-800">{percent(marginPct)}</span>
                                          </div>
                                        </div>

                                        {/* Coluna 2: Totais do Item */}
                                        <div className="space-y-0.5 pl-1">
                                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
                                            Total Item ({itemQty} {itemQty === 1 ? "un" : "uns"})
                                          </span>
                                          <div className="flex justify-between text-stone-600">
                                            <span>Subtotal:</span>
                                            <span className="text-stone-900 font-semibold">{money(totalItemRevenue)}</span>
                                          </div>
                                          <div className="flex justify-between text-stone-600">
                                            <span>CMV Total:</span>
                                            <span className="text-stone-700">-{money(totalItemCost)}</span>
                                          </div>
                                          <div className="flex justify-between text-stone-600">
                                            <span>Comissão:</span>
                                            <span className="text-orange-700">-{money(totalItemComm)}</span>
                                          </div>
                                          <div className="flex justify-between pt-1 border-t border-stone-200/60 font-bold">
                                            <span className="text-stone-900">Lucro Item:</span>
                                            <span className="text-emerald-700">{money(totalItemProfit)}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Decomposição Financeira do Pedido */}
                            <div className="bg-white rounded-lg border border-stone-200 p-2.5 space-y-1.5 text-xs">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                                  Fechamento Financeiro Consolidado
                                </span>
                                {o.shipment_name && (
                                  <span className="text-[10px] text-stone-500 font-medium">
                                    Envio: {o.shipment_name}
                                  </span>
                                )}
                              </div>
                              {o.products_subtotal != null && o.products_subtotal > 0 && (
                                <div className="flex justify-between text-stone-600">
                                  <span>Subtotal dos Produtos:</span>
                                  <span className="text-stone-800 font-medium">{money(o.products_subtotal)}</span>
                                </div>
                              )}
                              {o.shipment_value != null && o.shipment_value > 0 && (
                                <div className="flex justify-between text-stone-600">
                                  <span>Frete Pago pelo Cliente:</span>
                                  <span className="text-stone-800 font-medium">+{money(o.shipment_value)}</span>
                                </div>
                              )}
                              {o.discount_value != null && o.discount_value > 0 && (
                                <div className="flex justify-between text-stone-600">
                                  <span>Desconto / Cupom da Plataforma:</span>
                                  <span className="text-rose-700 font-medium">-{money(o.discount_value)}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-stone-800 pt-1 border-t border-stone-100 font-semibold">
                                <span>Total do Pedido (Tray):</span>
                                <strong className="text-stone-900 font-bold">{money(o.total)}</strong>
                              </div>
                              <div className="flex justify-between text-stone-600">
                                <span>Comissão Canal ({cfg.label}):</span>
                                <span className="text-orange-700 font-medium">
                                  -{money(o.commission_amount || 0)}
                                </span>
                              </div>
                              <div className="flex justify-between text-stone-600">
                                <span>Custo dos Produtos (CMV Consolidado):</span>
                                <span className="text-stone-700 font-medium">
                                  -{money(o.cost_amount || 0)}
                                </span>
                              </div>
                              <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-xs">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-stone-900">Lucro Líquido Real:</span>
                                  {o.net_margin_percent != null && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                                      Margem: {percent(o.net_margin_percent)}
                                    </span>
                                  )}
                                </div>
                                <strong className="text-emerald-700 font-bold text-base">
                                  {money(o.net_profit)}
                                </strong>
                              </div>
                            </div>

                            {/* Ações e Status */}
                            <div className="flex items-center justify-between text-[11px] pt-1">
                              <span className="text-stone-500">
                                Status: <strong className="text-stone-800">{o.status || "Aprovado"}</strong>
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard?.writeText(o.id);
                                  setCopiedOrderId(o.id);
                                  setTimeout(() => setCopiedOrderId(null), 2000);
                                }}
                                className="text-amber-900 hover:text-amber-950 font-semibold underline"
                              >
                                {copiedOrderId === o.id ? "ID Copiado! ✓" : `Copiar ID #${o.id}`}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-stone-400 text-sm col-span-3 text-center py-8">
                    {orderSearch || orderStatusFilter !== "todos"
                      ? "Nenhum pedido encontrado com os filtros aplicados."
                      : "Nenhum pedido recente registrado."}
                  </p>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    )}

        {/* TAB 2: INVESTIMENTO EM ANÚNCIOS (ADS & ROAS) */}
        {activeTab === "anuncios" && (
          <div className="space-y-6">
            {/* KPI Cards Ads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Total Investido em Ads
                </span>
                <p className="text-2xl font-bold text-stone-900 mt-2">
                  {loading ? "..." : money(kpis?.total_ad_spend)}
                </p>
                <p className="text-xs text-stone-400 mt-1">Período de {days} dias</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  ROAS Geral (Retorno em Mídia)
                </span>
                <p className="text-2xl font-bold text-emerald-700 mt-2">
                  {kpis && kpis.overall_roas > 0 ? `${kpis.overall_roas.toFixed(2)}x` : "—"}
                </p>
                <p className="text-xs text-stone-400 mt-1">Faturamento ÷ Investimento</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  CAC Médio por Pedido
                </span>
                <p className="text-2xl font-bold text-stone-800 mt-2">
                  {kpis && kpis.total_orders > 0 && kpis.total_ad_spend > 0
                    ? money(kpis.total_ad_spend / kpis.total_orders)
                    : "—"}
                </p>
                <p className="text-xs text-stone-400 mt-1">Custo de Aquisição de Cliente</p>
              </div>

              <div className="bg-amber-950 text-white p-5 rounded-2xl shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                  Lucro Final após Ads
                </span>
                <p className="text-2xl font-bold text-white mt-2">
                  {loading ? "..." : money(kpis?.final_net_profit)}
                </p>
                <p className="text-xs text-amber-300 mt-1">
                  Margem: {percent(kpis?.final_net_margin_percent)}
                </p>
              </div>
            </div>

            {/* Plataformas de Anúncios */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">
                    Investimento por Plataforma Publicitária
                  </h2>
                  <p className="text-xs text-stone-500">
                    Distribuição dos gastos em Shopee Ads, Mercado Ads, TikTok Ads e redes sociais.
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(true)}
                  className="bg-amber-950 hover:bg-amber-900 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-xs self-start sm:self-auto"
                >
                  + Novo Lançamento de Anúncio
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.ads.by_platform.map((ad) => (
                  <div
                    key={ad.platform}
                    className="border border-stone-200 rounded-xl p-4 bg-stone-50/50 flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900 text-sm">
                        {ad.platform_name}
                      </span>
                      {ad.roas && (
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          ROAS {ad.roas.toFixed(1)}x
                        </span>
                      )}
                    </div>

                    <div className="text-xl font-bold text-stone-900">
                      {money(ad.total_spent)}
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200 text-center text-xs text-stone-500">
                      <div>
                        <div className="text-stone-800 font-semibold">{ad.impressions}</div>
                        <div className="text-[10px]">Impressões</div>
                      </div>
                      <div>
                        <div className="text-stone-800 font-semibold">{ad.clicks}</div>
                        <div className="text-[10px]">Cliques</div>
                      </div>
                      <div>
                        <div className="text-stone-800 font-semibold">{ad.conversions}</div>
                        <div className="text-[10px]">Conversões</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Histórico Recente de Lançamentos */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6">
              <h2 className="text-lg font-bold text-stone-900 mb-4">
                Histórico de Lançamentos de Anúncios no Período
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200 uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4">Data</th>
                      <th className="py-2.5 px-3">Plataforma</th>
                      <th className="py-2.5 px-3">Campanha</th>
                      <th className="py-2.5 px-3 text-right">Valor Gasto</th>
                      <th className="py-2.5 px-3 text-center">Cliques</th>
                      <th className="py-2.5 px-4 text-center">Conversões</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {data?.ads.recent_records && data.ads.recent_records.length > 0 ? (
                      data.ads.recent_records.map((r) => (
                        <tr key={r.id} className="hover:bg-stone-50 transition">
                          <td className="py-3 px-4 font-mono">{r.date}</td>
                          <td className="py-3 px-3 font-medium text-stone-900">
                            {PLATFORM_LABELS[r.platform] || r.platform}
                          </td>
                          <td className="py-3 px-3 text-stone-600">
                            {r.campaign_name || "—"}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-stone-900">
                            {money(r.amount_spent)}
                          </td>
                          <td className="py-3 px-3 text-center">{r.clicks || 0}</td>
                          <td className="py-3 px-4 text-center">{r.conversions || 0}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-400">
                          Nenhum investimento registrado neste período. Clique em &quot;+ Lançar Anúncio&quot; para registrar gastos de mídia.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Lançamento de Anúncio */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h3 className="font-bold text-stone-900 text-lg">
                Registrar Gasto de Anúncio
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAd} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Plataforma Publicitária
                </label>
                <select
                  value={adForm.platform}
                  onChange={(e) =>
                    setAdForm({ ...adForm, platform: e.target.value as AdPlatform })
                  }
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900 bg-white"
                >
                  <option value="shopee_ads">🟠 Shopee Ads</option>
                  <option value="mercado_ads">🟡 Mercado Ads (Mercado Livre)</option>
                  <option value="tiktok_ads">⚫ TikTok Ads</option>
                  <option value="meta_ads">🔵 Meta Ads (Instagram &amp; Facebook)</option>
                  <option value="google_ads">🔴 Google Ads (Shopping &amp; Search)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Data do Investimento
                  </label>
                  <input
                    type="date"
                    required
                    value={adForm.date}
                    onChange={(e) => setAdForm({ ...adForm, date: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Valor Gasto (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 150.00"
                    value={adForm.amount_spent}
                    onChange={(e) => setAdForm({ ...adForm, amount_spent: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nome da Campanha (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Campanha Ceia de Natal"
                  value={adForm.campaign_name}
                  onChange={(e) => setAdForm({ ...adForm, campaign_name: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Impressões
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={adForm.impressions}
                    onChange={(e) => setAdForm({ ...adForm, impressions: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2 text-stone-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Cliques
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={adForm.clicks}
                    onChange={(e) => setAdForm({ ...adForm, clicks: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2 text-stone-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Conversões
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={adForm.conversions}
                    onChange={(e) => setAdForm({ ...adForm, conversions: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2 text-stone-900 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingAd}
                  className="px-5 py-2 bg-amber-950 text-white rounded-lg hover:bg-amber-900 transition text-xs font-semibold shadow-xs"
                >
                  {savingAd ? "Salvando..." : "Salvar Lançamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
