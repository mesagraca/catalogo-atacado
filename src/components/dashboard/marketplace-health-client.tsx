"use client";

import React, { useState, useEffect } from "react";
import type {
  MarketplaceHealthDashboardResponse,
  ChannelHealthSummary,
  OfficialMarketplaceRule,
  ActivePenaltyRecord,
  SlaOrderMetrics,
  PerformanceDropHypothesis,
  StockoutLossItem,
  RecoveryActionPlanItem,
  HealthSeverity,
  ConfidenceLevel,
  BottleneckPriority,
} from "@/types/marketplace-health";
import type { SalesChannel } from "@/types/dashboard";

interface Props {
  className?: string;
}

// Helpers de formatação
function money(val?: number): string {
  if (val == null || isNaN(val)) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val);
}

function percent(val?: number): string {
  if (val == null || isNaN(val)) return "0,0%";
  return `${val.toFixed(1).replace(".", ",")}%`;
}

/**
 * Formata data ISO para padrão brasileiro DD/MM/AAAA.
 * Sanitiza valores nulos, vazios ou com zeros (0000-00-00, 00/00/0000).
 */
function formatFullDateBR(isoString?: string): string {
  if (!isoString) return "—";
  const clean = isoString.split(" ")[0].split("T")[0];
  if (
    clean === "0000-00-00" ||
    clean.startsWith("0000") ||
    clean.includes("00/00/00") ||
    clean === "00/00/0000"
  ) {
    return "—";
  }
  const parts = clean.split("-");
  if (parts.length === 3) {
    if (parts[0] === "0000" || parts[1] === "00" || parts[2] === "00") return "—";
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return isoString;
}

const SEVERITY_CONFIG: Record<
  HealthSeverity,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  healthy: {
    label: "Saudável",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  warning: {
    label: "Atenção",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dot: "bg-amber-500 animate-pulse",
  },
  critical: {
    label: "Crítica",
    bg: "bg-rose-50",
    text: "text-rose-800",
    border: "border-rose-200",
    dot: "bg-rose-600 animate-ping",
  },
};

const CONFIDENCE_CONFIG: Record<
  ConfidenceLevel,
  { label: string; badge: string }
> = {
  high: { label: "Evidência Forte", badge: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  medium: { label: "Correlação Provável", badge: "bg-amber-100 text-amber-800 border-amber-300" },
  hypothesis: { label: "Hipótese em Teste", badge: "bg-sky-100 text-sky-800 border-sky-300" },
};

const PRIORITY_CONFIG: Record<
  BottleneckPriority,
  { label: string; badge: string }
> = {
  high: { label: "Prioridade Alta", badge: "bg-rose-100 text-rose-800 border-rose-300" },
  medium: { label: "Prioridade Média", badge: "bg-amber-100 text-amber-800 border-amber-300" },
  low: { label: "Prioridade Baixa", badge: "bg-stone-100 text-stone-700 border-stone-300" },
};

/**
 * Badge oficial do Marketplace com logo em alta resolução e paleta visual canônica.
 */
function ChannelBadge({
  channel,
  pointSale,
  className = "",
}: {
  channel: SalesChannel;
  pointSale?: string;
  className?: string;
}) {
  const iconSrc =
    channel === "shopee"
      ? "/icons/shopee.png"
      : channel === "mercadolivre"
      ? "/icons/mercadolivre.png"
      : channel === "tiktok"
      ? "/icons/tiktok.ico"
      : "/icons/tray.png";

  const label =
    channel === "shopee"
      ? "Shopee"
      : channel === "mercadolivre"
      ? "Mercado Livre"
      : channel === "tiktok"
      ? "TikTok Shop"
      : "Loja Virtual";

  const colors =
    channel === "shopee"
      ? "bg-orange-50 text-orange-950 border-orange-200"
      : channel === "mercadolivre"
      ? "bg-amber-50 text-amber-950 border-amber-200"
      : channel === "tiktok"
      ? "bg-zinc-900 text-zinc-100 border-zinc-700"
      : "bg-emerald-50 text-emerald-950 border-emerald-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border shadow-2xs whitespace-nowrap ${colors} ${className}`}
      title={pointSale || label}
    >
      <img
        src={iconSrc}
        alt={label}
        className="w-3.5 h-3.5 object-contain rounded-xs shrink-0"
        onError={(e) => {
          (e.currentTarget as HTMLElement).style.display = "none";
        }}
      />
      <span>{label}</span>
    </span>
  );
}

export function MarketplaceHealthClient({ className = "" }: Props) {
  const [days, setDays] = useState<number>(30);
  const [data, setData] = useState<MarketplaceHealthDashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedChannel, setExpandedChannel] = useState<SalesChannel | null>(null);
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<SalesChannel | "all">("all");
  const [activePlanHorizon, setActivePlanHorizon] = useState<"all" | "immediate" | "short" | "recovery">("all");
  const [orderFilter, setOrderFilter] = useState<"all" | "delayed" | "at_risk" | "cancelled">("all");
  const [openOrderAccordions, setOpenOrderAccordions] = useState<Record<string, boolean>>({});
  const [orderSortCol, setOrderSortCol] = useState<"id" | "date" | "deadline" | "status" | "amount">("date");
  const [orderSortAsc, setOrderSortAsc] = useState<boolean>(false);

  const toggleOrderAccordion = (id: string) => {
    setOpenOrderAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSort = (col: "id" | "date" | "deadline" | "status" | "amount") => {
    if (orderSortCol === col) {
      setOrderSortAsc(!orderSortAsc);
    } else {
      setOrderSortCol(col);
      setOrderSortAsc(false); // Padrão descendente
    }
  };

  const fetchData = async (periodDays: number, forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/admin/dashboard/health?days=${periodDays}${forceRefresh ? "&refresh=1" : ""}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Falha ao obter diagnóstico de saúde (HTTP ${res.status})`);
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error("Erro na leitura de saúde dos marketplaces:", err);
      setError(err?.message || "Erro desconhecido ao carregar central de saúde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(days);
  }, [days]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. CABEÇALHO & FILTROS OPERACIONAIS */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-stone-900">
              Central de Saúde dos Marketplaces &amp; Diagnóstico de Performance
            </h2>
            {data && (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  SEVERITY_CONFIG[data.overall_health_status].bg
                } ${SEVERITY_CONFIG[data.overall_health_status].text} ${
                  SEVERITY_CONFIG[data.overall_health_status].border
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    SEVERITY_CONFIG[data.overall_health_status].dot
                  }`}
                />
                Operação {SEVERITY_CONFIG[data.overall_health_status].label}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Monitoramento de SLAs logísticos, riscos de penalidades e motor de investigação para recuperação de faturamento.
          </p>
        </div>

        {/* Controles de Período & Atualização */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <div className="flex items-center bg-stone-100 p-1 rounded-xl gap-1 text-xs font-semibold">
            {[7, 15, 30, 60].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 min-h-[36px] rounded-lg transition active:scale-[0.98] ${
                  days === d
                    ? "bg-white text-stone-900 shadow-2xs font-bold"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                {d === 7 ? "7d" : d === 15 ? "15d" : d === 30 ? "30d" : "60d"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchData(days, true)}
            disabled={loading}
            className="px-3.5 py-1.5 min-h-[38px] bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? "Sincronizando..." : "🔄 Atualizar"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs">
          <strong>Atenção:</strong> {error}
        </div>
      )}

      {/* 2. COCKPIT DOS 4 CANAIS (SHOPEE, MERCADO LIVRE, TIKTOK SHOP, LOJA VIRTUAL) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.channel_summaries.map((ch) => {
          const cfg = SEVERITY_CONFIG[ch.status];
          const isRulesExpanded = expandedChannel === ch.channel;
          const isFilterActive = selectedChannelFilter === ch.channel;
          const targetLimit = ch.channel === "shopee" ? 8.0 : ch.channel === "tiktok" ? 4.0 : 15.0;

          const channelIcon =
            ch.channel === "shopee"
              ? "/icons/shopee.png"
              : ch.channel === "mercadolivre"
              ? "/icons/mercadolivre.png"
              : ch.channel === "tiktok"
              ? "/icons/tiktok.ico"
              : "/icons/tray.png";

          return (
            <div
              key={ch.channel}
              onClick={() => {
                if (isFilterActive) {
                  setSelectedChannelFilter("all");
                  setExpandedChannel(null);
                } else {
                  setSelectedChannelFilter(ch.channel);
                  setExpandedChannel(ch.channel);
                }
              }}
              className={`rounded-2xl border p-5 transition cursor-pointer select-none flex flex-col justify-between gap-3 ${
                isFilterActive
                  ? "bg-amber-50/30 border-amber-900 ring-2 ring-amber-900/30 shadow-md"
                  : "bg-white border-stone-200 hover:border-stone-300 hover:shadow-2xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={channelIcon}
                      alt={ch.channel_label}
                      className="w-5 h-5 object-contain rounded-xs"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                    <span className="font-bold text-stone-900 text-sm">{ch.channel_label}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      Taxa de Atraso (TEA/LDR)
                    </span>
                    <strong
                      className={`text-xl font-extrabold tabular-nums whitespace-nowrap ${
                        ch.late_dispatch_rate_percent > targetLimit
                          ? "text-rose-700"
                          : ch.late_dispatch_rate_percent > 0
                          ? "text-amber-700"
                          : "text-emerald-700"
                      }`}
                    >
                      {percent(ch.late_dispatch_rate_percent)}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block font-mono">Meta Oficial</span>
                    <span className="text-xs font-semibold text-stone-600 font-mono">
                      &lt; {targetLimit}%
                    </span>
                  </div>
                </div>

                {/* Barra de Progresso do SLA */}
                <div className="w-full bg-stone-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ch.late_dispatch_rate_percent > targetLimit
                        ? "bg-rose-500"
                        : ch.late_dispatch_rate_percent > targetLimit * 0.5
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{
                      width: `${Math.min(100, (ch.late_dispatch_rate_percent / targetLimit) * 100)}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-stone-100 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Atrasados (TEA)</span>
                    <strong
                      className={`tabular-nums ${
                        ch.late_orders_count > 0 ? "text-rose-700 font-bold" : "text-stone-700"
                      }`}
                    >
                      {ch.late_orders_count} pedido(s)
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Em Risco</span>
                    <strong
                      className={`tabular-nums ${
                        ch.orders_at_risk_count > 0 ? "text-amber-700 font-bold" : "text-stone-700"
                      }`}
                    >
                      {ch.orders_at_risk_count} pedido(s)
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Cancelados</span>
                    <strong
                      className={`tabular-nums ${
                        (ch.cancelled_orders_count || 0) > 0 ? "text-stone-900 font-bold" : "text-stone-500"
                      }`}
                    >
                      {ch.cancelled_orders_count || 0} pedido(s)
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] flex flex-col gap-1 border-t border-stone-100">
                {isFilterActive && (
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md text-center">
                    ✓ Filtrando Tabela de Pedidos
                  </span>
                )}
                <div className="text-amber-950 font-semibold flex items-center justify-between">
                  <span>{isRulesExpanded ? "Ocultar regras oficiais" : "Ver regras e penalidades"}</span>
                  <span>{isRulesExpanded ? "▲" : "▼"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. REGRAS OFICIAIS EXPANDIDAS DO CANAL SELECIONADO */}
      {expandedChannel && (
        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 space-y-4">
          {(() => {
            const currentSummary = data?.channel_summaries.find((c) => c.channel === expandedChannel);
            if (!currentSummary) return null;

            return (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ChannelBadge channel={currentSummary.channel} />
                    <h3 className="font-bold text-stone-900 text-sm">
                      Regras Oficiais &amp; Catálogo de Penalidades: {currentSummary.channel_label}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandedChannel(null)}
                    className="text-xs text-stone-500 hover:text-stone-800 underline font-medium cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>

                {/* Avisos de Penalidades e Riscos Identificados */}
                {currentSummary.penalties.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {currentSummary.penalties.map((pen) => (
                      <div
                        key={pen.id}
                        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                          pen.severity === "critical"
                            ? "bg-rose-50 border-rose-200 text-rose-900"
                            : "bg-amber-50 border-amber-200 text-amber-900"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs">{pen.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-white/70">
                              Métrica Atual: {pen.current_metric_value}% (Teto: {pen.target_threshold}%)
                            </span>
                          </div>
                          <p className="text-xs mt-1 text-stone-700">{pen.notes}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-semibold block text-stone-600">
                            Ação imediata: despachar todos os pedidos com prazo SLA vencido.
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Grid de Regras Oficiais */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Regulamento Oficial Válido para a Conta (Base Sem Fake Claims):
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentSummary.rules.map((r) => (
                      <div
                        key={r.id}
                        className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col justify-between gap-2.5 shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-stone-900">{r.metric_name}</span>
                            <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                              {r.official_code}
                            </span>
                          </div>
                          <p className="text-stone-600 text-[11px]">{r.description}</p>
                        </div>

                        <div className="space-y-1 pt-2 border-t border-stone-100 text-[11px]">
                          <div>
                            <span className="text-stone-400">Limite Tolerado: </span>
                            <strong className="text-amber-900 font-bold">
                              {r.tolerance_limit_percent ? `${r.tolerance_limit_percent}%` : "—"}
                            </strong>
                          </div>
                          <div>
                            <span className="text-stone-400">Impacto no Negócio: </span>
                            <span className="text-stone-700">{r.business_impact}</span>
                          </div>
                          <div>
                            <span className="text-stone-400">Como Evitar: </span>
                            <span className="text-emerald-800 font-medium">{r.how_to_prevent}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                          <span>Vigência: {r.rules_version_date}</span>
                          <a
                            href={r.official_source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-800 font-semibold hover:underline inline-flex items-center gap-1"
                          >
                            <span>Documentação Oficial ↗</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 3.1 AUDITORIA DE PEDIDOS CRÍTICOS & SLAS DE ENVIO */}
      {(() => {
        const allCriticalOrders = data?.critical_orders || [];
        
        // 1. Filtrar por Canal selecionado (caso usuário tenha clicado no card)
        const channelFiltered = allCriticalOrders.filter((ord) => {
          if (selectedChannelFilter !== "all" && ord.channel !== selectedChannelFilter) {
            return false;
          }
          return true;
        });

        // 2. Filtrar por Status (Todos / Atrasados / Em Risco / Cancelados)
        const statusFiltered = channelFiltered.filter((ord) => {
          if (orderFilter === "delayed") return ord.is_delayed || ord.sla_status === "dispatched_late";
          if (orderFilter === "at_risk") return ord.is_at_risk_today || ord.is_at_risk_tomorrow || ord.sla_status === "at_risk";
          if (orderFilter === "cancelled") return ord.is_cancelled || ord.sla_status === "cancelled";
          return true;
        });

        // 3. Ordenação Interativa
        const sortedOrders = [...statusFiltered].sort((a, b) => {
          let comparison = 0;
          switch (orderSortCol) {
            case "id":
              comparison = Number(a.order_id) - Number(b.order_id);
              break;
            case "date":
              comparison = new Date(a.order_date).getTime() - new Date(b.order_date).getTime();
              break;
            case "deadline":
              comparison = (a.expected_dispatch_deadline || "").localeCompare(b.expected_dispatch_deadline || "");
              break;
            case "status":
              comparison = (a.delay_business_days || 0) - (b.delay_business_days || 0);
              break;
            case "amount":
              comparison = a.total_amount - b.total_amount;
              break;
          }
          return orderSortAsc ? comparison : -comparison;
        });

        const activeChannelLabel =
          selectedChannelFilter === "shopee"
            ? "Shopee"
            : selectedChannelFilter === "mercadolivre"
            ? "Mercado Livre"
            : selectedChannelFilter === "tiktok"
            ? "TikTok Shop"
            : selectedChannelFilter === "site"
            ? "Loja Virtual (Tray)"
            : null;

        return (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <span>📦 Auditoria de Pedidos Críticos &amp; SLAs de Envio</span>
                    <span className="text-xs bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full font-bold">
                      {statusFiltered.length} pedido(s)
                    </span>
                  </h3>
                  {activeChannelLabel && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300">
                      <span>Canal: {activeChannelLabel}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedChannelFilter("all")}
                        className="text-stone-500 hover:text-stone-900 cursor-pointer font-bold ml-0.5"
                        title="Limpar filtro de canal"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Clique na linha para expandir produtos, dados do cliente e diagnóstico completo de expedição.
                </p>
              </div>

              {/* Filtros Rápidos */}
              <div className="flex items-center gap-1.5 text-xs flex-wrap">
                <button
                  type="button"
                  onClick={() => setOrderFilter("all")}
                  className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    orderFilter === "all" ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  Todos ({channelFiltered.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter("delayed")}
                  className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    orderFilter === "delayed" ? "bg-rose-700 text-white" : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                  }`}
                >
                  Atrasados ({channelFiltered.filter(o => o.is_delayed || o.sla_status === "dispatched_late").length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter("at_risk")}
                  className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    orderFilter === "at_risk" ? "bg-amber-700 text-white" : "bg-amber-50 text-amber-800 hover:bg-amber-100"
                  }`}
                >
                  Em Risco ({channelFiltered.filter(o => o.is_at_risk_today || o.is_at_risk_tomorrow || o.sla_status === "at_risk").length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter("cancelled")}
                  className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    orderFilter === "cancelled" ? "bg-stone-700 text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  Cancelados ({channelFiltered.filter(o => o.is_cancelled || o.sla_status === "cancelled").length})
                </button>
              </div>
            </div>

            {sortedOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-400 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                Nenhum pedido encontrado para o filtro selecionado.
                {selectedChannelFilter !== "all" && (
                  <button
                    type="button"
                    onClick={() => setSelectedChannelFilter("all")}
                    className="block mx-auto mt-2 text-amber-900 font-bold underline cursor-pointer"
                  >
                    Exibir pedidos de todos os canais
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[780px]">
                  <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200 uppercase text-[10px] tracking-wider select-none">
                    <tr>
                      <th
                        onClick={() => handleSort("id")}
                        className="py-2.5 px-3 cursor-pointer hover:bg-stone-100 transition"
                      >
                        Pedido / Canal {orderSortCol === "id" && (orderSortAsc ? "▲" : "▼")}
                      </th>
                      <th
                        onClick={() => handleSort("date")}
                        className="py-2.5 px-3 cursor-pointer hover:bg-stone-100 transition"
                      >
                        Data Compra {orderSortCol === "date" && (orderSortAsc ? "▲" : "▼")}
                      </th>
                      <th
                        onClick={() => handleSort("deadline")}
                        className="py-2.5 px-3 cursor-pointer hover:bg-stone-100 transition"
                      >
                        Prazo Oficial Limite {orderSortCol === "deadline" && (orderSortAsc ? "▲" : "▼")}
                      </th>
                      <th className="py-2.5 px-3">Envio Efetivo</th>
                      <th
                        onClick={() => handleSort("status")}
                        className="py-2.5 px-3 text-center cursor-pointer hover:bg-stone-100 transition"
                      >
                        Status / SLA {orderSortCol === "status" && (orderSortAsc ? "▲" : "▼")}
                      </th>
                      <th
                        onClick={() => handleSort("amount")}
                        className="py-2.5 px-3 text-right cursor-pointer hover:bg-stone-100 transition"
                      >
                        Valor {orderSortCol === "amount" && (orderSortAsc ? "▲" : "▼")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {sortedOrders.map((ord) => {
                      const isLateDispatched = ord.sla_status === "dispatched_late";
                      const isLatePending = ord.sla_status === "delayed";
                      const isCancelled = ord.is_cancelled || ord.sla_status === "cancelled";
                      const isAtRisk = ord.sla_status === "at_risk";
                      const isOpen = !!openOrderAccordions[ord.order_id];

                      return (
                        <React.Fragment key={ord.order_id}>
                          <tr
                            onClick={() => {
                              if (typeof window !== "undefined" && window.getSelection()?.toString().trim().length) {
                                return;
                              }
                              toggleOrderAccordion(ord.order_id);
                            }}
                            className={`cursor-pointer transition select-none ${
                              isOpen ? "bg-amber-50/50" : "hover:bg-stone-50/80"
                            }`}
                          >
                            <td className="py-2.5 px-3">
                              <div className="font-semibold text-stone-900 flex items-center gap-2">
                                <span className="text-amber-950 font-bold flex items-center gap-1">
                                  <span>#{ord.order_id}</span>
                                  <span className="text-[10px] text-stone-400 font-normal">
                                    {isOpen ? "▲" : "▼"}
                                  </span>
                                </span>
                                <ChannelBadge channel={ord.channel} pointSale={ord.point_sale} />
                              </div>
                              <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                                {ord.customer_name} · {ord.items_summary}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-stone-600">
                              {formatFullDateBR(ord.order_date)} {ord.order_hour ? ord.order_hour.slice(0, 5) : ""}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px]">
                              {isCancelled ? (
                                <span className="text-stone-400 font-medium">— <span className="text-[10px]">(Cancelado)</span></span>
                              ) : (
                                <>
                                  <span className="font-semibold text-stone-800">
                                    {formatFullDateBR(ord.expected_dispatch_deadline)}
                                  </span>
                                  {ord.dispatch_cutoff_hour && (
                                    <span className="text-stone-400 block text-[10px]">limite {ord.dispatch_cutoff_hour.slice(0, 5)}</span>
                                  )}
                                </>
                              )}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px]">
                              {isCancelled ? (
                                <span className="text-stone-400 font-medium">— <span className="text-[10px]">(Cancelado)</span></span>
                              ) : ord.actual_dispatched_at && !ord.actual_dispatched_at.includes("0000-00-00") ? (
                                <span className={isLateDispatched ? "text-rose-700 font-bold" : "text-emerald-700 font-medium"}>
                                  {formatFullDateBR(ord.actual_dispatched_at)}
                                </span>
                              ) : (
                                <span className="text-amber-700 font-medium">Aguardando envio</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center whitespace-nowrap">
                              {isCancelled ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                                  Cancelado
                                </span>
                              ) : isLateDispatched ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                  Enviado com Atraso (+{ord.delay_business_days}d)
                                </span>
                              ) : isLatePending ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white animate-pulse">
                                  Atrasado em Aberto (+{ord.delay_business_days}d)
                                </span>
                              ) : isAtRisk ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                  Em Risco de Vencer
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  No Prazo
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right whitespace-nowrap font-bold text-stone-900 tabular-nums">
                              {money(ord.total_amount)}
                            </td>
                          </tr>

                          {/* Acordeão de Detalhes da Compra */}
                          {isOpen && (
                            <tr className="bg-stone-50/70 border-b border-stone-200">
                              <td colSpan={6} className="p-4 sm:p-5">
                                <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-4">
                                  {/* Cabeçalho do Detalhe */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-sm text-stone-900">
                                        Detalhes da Compra #{ord.order_id}
                                      </span>
                                      <ChannelBadge channel={ord.channel} pointSale={ord.point_sale} />
                                    </div>
                                    <div className="text-xs text-stone-500 font-mono">
                                      {ord.status} · Valor Total: <strong className="text-stone-900 font-bold">{money(ord.total_amount)}</strong>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* 1. Cliente & Expedição */}
                                    <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/80 space-y-2 text-xs">
                                      <h5 className="font-bold text-stone-800 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                                        <span>📍 Cliente &amp; Expedição</span>
                                      </h5>
                                      <div className="space-y-1 text-stone-700">
                                        <div className="flex justify-between">
                                          <span className="text-stone-400">Nome:</span>
                                          <strong className="font-semibold text-stone-900 truncate max-w-[170px]" title={ord.customer_name}>
                                            {ord.customer_name || "Cliente"}
                                          </strong>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-stone-400">Destino:</span>
                                          <span>
                                            {ord.customer_city ? `${ord.customer_city} / ${ord.customer_state || ""}` : "Não informado"}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-stone-400">Envio:</span>
                                          <span className="font-medium text-stone-800">{ord.shipment_name || "Padrão"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-stone-400">Rastreio:</span>
                                          <span className="font-mono text-[11px] font-semibold text-amber-950">
                                            {ord.tracking_code || "Aguardando etiqueta"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* 2. Diagnóstico & SLA */}
                                    <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/80 space-y-2 text-xs">
                                      <h5 className="font-bold text-stone-800 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                                        <span>⏱️ Linha do Tempo &amp; SLA</span>
                                      </h5>
                                      <div className="space-y-1 text-stone-700">
                                        <div className="flex justify-between">
                                          <span className="text-stone-400">Compra Realizada:</span>
                                          <span className="font-mono text-[11px]">
                                            {formatFullDateBR(ord.order_date)} {ord.order_hour ? ord.order_hour.slice(0, 5) : ""}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-stone-400">Limite de Despacho:</span>
                                          <span className="font-mono text-[11px] font-semibold text-stone-900">
                                            {isCancelled ? "Cancelado" : `${formatFullDateBR(ord.expected_dispatch_deadline)} ${ord.dispatch_cutoff_hour ? `(${ord.dispatch_cutoff_hour.slice(0, 5)})` : ""}`}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-stone-400">Despacho Real:</span>
                                          <span className="font-mono text-[11px]">
                                            {isCancelled ? "Cancelado" : ord.actual_dispatched_at ? formatFullDateBR(ord.actual_dispatched_at) : "Pendente"}
                                          </span>
                                        </div>
                                        <div className="flex justify-between pt-1 border-t border-stone-200/60 font-semibold">
                                          <span className="text-stone-500">Resultado:</span>
                                          <span className={isCancelled ? "text-stone-700" : isLateDispatched || isLatePending ? "text-rose-700" : "text-emerald-700"}>
                                            {isCancelled ? "Cancelado" : ord.delay_business_days > 0 ? `+${ord.delay_business_days} dias de atraso` : "Dentro do SLA"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* 3. Motivo da Inclusão Crítica */}
                                    <div className={`rounded-xl p-3 border text-xs flex flex-col justify-between ${
                                      isCancelled
                                        ? "bg-stone-100/70 border-stone-200 text-stone-800"
                                        : isLatePending || isLateDispatched
                                        ? "bg-rose-50/60 border-rose-200 text-rose-950"
                                        : "bg-amber-50/60 border-amber-200 text-amber-950"
                                    }`}>
                                      <div>
                                        <h5 className="font-bold uppercase text-[10px] tracking-wider mb-1">
                                          Diagnóstico Operacional
                                        </h5>
                                        <p className="text-[11px] leading-relaxed">
                                          {isCancelled
                                            ? "Pedido cancelado. Não há impacto de acúmulo na fila de postagem da expedição física."
                                            : isLatePending
                                            ? `Pedido pendente de envio com atraso de ${ord.delay_business_days} dias úteis em relação ao horário de corte do canal. Risco de penalidade no Seller Centre.`
                                            : isLateDispatched
                                            ? `Pedido foi postado ${ord.delay_business_days} dia(s) após o prazo estipulado pelo marketplace, impactando negativamente a taxa de TEA/LDR.`
                                            : "Pedido próximo do vencimento do SLA oficial de expedição (prazo limite hoje/amanhã)."}
                                        </p>
                                      </div>
                                      <div className="pt-2 text-[10px] text-stone-500 font-medium">
                                        Ponto de venda: {ord.point_sale}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Itens Comprados */}
                                  <div>
                                    <h5 className="text-xs font-bold text-stone-800 mb-2 flex items-center justify-between">
                                      <span>Itens do Pedido ({ord.items?.length || 1})</span>
                                      <span className="text-stone-400 font-normal">
                                        Total de {ord.units_sold} unidade(s) comprada(s)
                                      </span>
                                    </h5>
                                    <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden bg-stone-50/30">
                                      {ord.items && ord.items.length > 0 ? (
                                        ord.items.map((it, idx) => (
                                          <div key={`${it.product_id}-${idx}`} className="p-3 flex items-center justify-between gap-3 bg-white">
                                            <div className="flex items-center gap-3 min-w-0">
                                              <div className="w-10 h-10 rounded-lg border border-stone-200 bg-stone-100 overflow-hidden shrink-0 flex items-center justify-center">
                                                {it.image_url ? (
                                                  <img src={it.image_url} alt={it.name} className="w-full h-full object-cover" />
                                                ) : (
                                                  <span className="text-stone-400 text-xs">📷</span>
                                                )}
                                              </div>
                                              <div className="min-w-0">
                                                <div className="font-semibold text-stone-900 text-xs truncate" title={it.name}>
                                                  {it.name}
                                                </div>
                                                <div className="text-[10px] font-mono text-stone-400">
                                                  SKU: {it.reference || it.product_id}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="text-right shrink-0 text-xs">
                                              <div className="font-semibold text-stone-900 tabular-nums">
                                                {money(it.price * it.quantity)}
                                              </div>
                                              <div className="text-[10px] text-stone-400 font-mono">
                                                {it.quantity}x {money(it.price)}
                                              </div>
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="p-3 text-xs text-stone-500 bg-white">
                                          {ord.items_summary} ({ord.units_sold} unidades)
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })()}

      {/* 4. MOTOR DE DIAGNÓSTICO DE PERFORMANCE (INVESTIGAÇÃO: R$ 15.000 -> R$ 6.000) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>🔍 Diagnóstico de Queda de Faturamento</span>
                <span className="text-xs bg-stone-100 px-2.5 py-0.5 rounded-full text-stone-600 font-mono">
                  R$ 15k ➔ R$ 6k
                </span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Investigação multifatorial sem viés presuntivo: cruzamento de atrasos, estoque, Shopee Ads e ticket médio.
              </p>
            </div>
            {data?.historical_comparison && (
              <div className="text-right">
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Queda Observada</span>
                <strong className="text-rose-700 text-sm font-extrabold tabular-nums whitespace-nowrap">
                  {money(data.historical_comparison.revenue_delta_brl)} ({percent(data.historical_comparison.revenue_delta_percent)})
                </strong>
              </div>
            )}
          </div>
        </div>

        {/* Comparativo de Períodos */}
        {data?.historical_comparison && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                1. Período de Pico (Referência)
              </span>
              <div className="text-xl font-extrabold text-emerald-950 mt-1 tabular-nums">
                {money(data.historical_comparison.baseline_revenue_brl)}
              </div>
              <span className="text-[11px] text-emerald-700 block mt-0.5">
                {data.historical_comparison.baseline_orders_count} pedidos finalizados (alta tração Shopee)
              </span>
            </div>

            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                2. Período Recente (Atual)
              </span>
              <div className="text-xl font-extrabold text-rose-950 mt-1 tabular-nums">
                {money(data.historical_comparison.current_revenue_brl)}
              </div>
              <span className="text-[11px] text-rose-700 block mt-0.5">
                {data.historical_comparison.current_orders_count} pedidos finalizados (volume reduzido)
              </span>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  3. Decomposição do Déficit
                </span>
                <div className="text-xl font-extrabold text-stone-900 mt-1 tabular-nums">
                  -{money(Math.abs(data.historical_comparison.revenue_delta_brl))}
                </div>
              </div>
              <span className="text-[11px] text-stone-600 block mt-0.5">
                Investigação aponta perda combinada entre ruptura e visibilidade.
              </span>
            </div>
          </div>
        )}

        {/* Quadro das 4 Hipóteses Auditadas */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
            Quadro de Diagnóstico das 4 Hipóteses Levantadas:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.hypotheses.map((h) => {
              const conf = CONFIDENCE_CONFIG[h.confidence];
              return (
                <div
                  key={h.id}
                  className="rounded-xl p-5 border border-stone-200 bg-white flex flex-col justify-between gap-3 shadow-2xs hover:border-stone-300 transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${conf.badge}`}>
                        {conf.label}
                      </span>
                      {h.estimated_financial_loss_brl > 0 && (
                        <span className="text-xs font-bold text-rose-700 tabular-nums">
                          Perda est: -{money(h.estimated_financial_loss_brl)}
                        </span>
                      )}
                    </div>

                    <h5 className="font-bold text-stone-900 text-sm">{h.title}</h5>
                    <p className="text-stone-600 text-xs mt-1.5 leading-relaxed">{h.problem_identified}</p>

                    <div className="mt-3 bg-stone-50 rounded-lg p-2.5 border border-stone-100 text-[11px] space-y-1">
                      <div>
                        <strong className="text-stone-700">Evidência Factual: </strong>
                        <span className="text-stone-600">{h.evidence_summary}</span>
                      </div>
                      <div>
                        <strong className="text-stone-700">Causa Provável: </strong>
                        <span className="text-stone-600">{h.probable_cause}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                      Ação Recomendada:
                    </span>
                    <span className="text-stone-900 font-semibold mt-0.5 block">
                      {h.recommended_action}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabela de Ruptura de Estoque nos SKUs Campeões */}
        {data?.top_stockout_losses && data.top_stockout_losses.length > 0 && (
          <div className="pt-4 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center justify-between">
              <span>📦 SKUs Campeões com Estoque Esgotado ou Crítico (Impacto Direto nas Vendas)</span>
              <span className="text-stone-400 font-normal">Estoque ≤ 2 unidades</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200 uppercase text-[11px] whitespace-nowrap">
                  <tr>
                    <th className="py-2.5 px-4 min-w-[240px]">Produto / SKU</th>
                    <th className="py-2.5 px-3 text-center whitespace-nowrap">Estoque Atual</th>
                    <th className="py-2.5 px-3 text-center whitespace-nowrap">Queda de Vendas</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Preço de Venda</th>
                    <th className="py-2.5 px-4 text-right whitespace-nowrap">Perda Estimada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {data.top_stockout_losses.slice(0, 5).map((loss) => (
                    <tr key={loss.sku} className="hover:bg-stone-50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg border border-stone-200 bg-stone-100 overflow-hidden shrink-0 flex items-center justify-center">
                            {loss.image_url ? (
                              <img
                                src={loss.image_url}
                                alt={loss.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <span className="text-stone-400 text-xs">📷</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-stone-900 truncate" title={loss.name}>
                              {loss.name}
                            </div>
                            <span className="text-[10px] font-mono text-stone-400">SKU: {loss.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                            loss.current_stock <= 0
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {loss.current_stock} un
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap tabular-nums">
                        <span className="text-stone-500">
                          {loss.peak_period_units_sold} un ➔{" "}
                          <strong className="text-rose-700 font-bold">{loss.recent_period_units_sold} un</strong>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap tabular-nums font-medium text-stone-900">
                        {money(loss.unit_price)}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap tabular-nums font-bold text-rose-700">
                        ~{money(loss.estimated_revenue_lost_brl)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 5. PLANO ESTRUTURADO DE RECUPERAÇÃO DE VENDAS (0 A 30 DIAS) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <span>🚀 Plano Estruturado de Recuperação de Vendas</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Meta: R$ 15.000 / Mês
              </span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Ações priorizadas com responsáveis, prazos e métricas de sucesso para recuperar a relevância nos canais.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setActivePlanHorizon("all")}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                activePlanHorizon === "all" ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setActivePlanHorizon("immediate")}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                activePlanHorizon === "immediate" ? "bg-rose-700 text-white" : "bg-rose-50 text-rose-700 hover:bg-rose-100"
              }`}
            >
              0 a 7d (Urgente)
            </button>
            <button
              type="button"
              onClick={() => setActivePlanHorizon("short")}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                activePlanHorizon === "short" ? "bg-amber-700 text-white" : "bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              8 a 15d (Estabilização)
            </button>
            <button
              type="button"
              onClick={() => setActivePlanHorizon("recovery")}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                activePlanHorizon === "recovery" ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              16 a 30d (Retomada)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {data?.action_plan
            .filter((act) => {
              if (activePlanHorizon === "immediate") return act.horizon === "immediate_0_7d";
              if (activePlanHorizon === "short") return act.horizon === "short_term_8_15d";
              if (activePlanHorizon === "recovery") return act.horizon === "recovery_16_30d";
              return true;
            })
            .map((act) => {
              const prio = PRIORITY_CONFIG[act.priority];
              const isImmediate = act.horizon === "immediate_0_7d";
              const isShort = act.horizon === "short_term_8_15d";

              return (
                <div
                  key={act.id}
                  className={`rounded-xl p-4 border flex flex-col justify-between gap-3 shadow-2xs ${
                    isImmediate
                      ? "bg-rose-50/40 border-rose-200"
                      : isShort
                      ? "bg-amber-50/40 border-amber-200"
                      : "bg-emerald-50/40 border-emerald-200"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                        {isImmediate ? "⚡ 0 a 7 dias" : isShort ? "⏱️ 8 a 15 dias" : "📈 16 a 30 dias"}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${prio.badge}`}>
                        {prio.label}
                      </span>
                    </div>

                    <h5 className="font-bold text-stone-900 text-sm">{act.title}</h5>
                    <p className="text-stone-600 mt-1 leading-relaxed text-[11px]">{act.description}</p>
                  </div>

                  <div className="pt-2 border-t border-stone-200/60 space-y-1 text-[11px]">
                    <div>
                      <span className="text-stone-400">Responsável: </span>
                      <strong className="text-stone-800">{act.responsible}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400">Meta / Sucesso: </span>
                      <strong className="text-emerald-800">{act.success_metric}</strong>
                    </div>
                    {act.expected_financial_impact_brl && (
                      <div>
                        <span className="text-stone-400">Retorno Estimado: </span>
                        <strong className="text-stone-900 tabular-nums">
                          +{money(act.expected_financial_impact_brl)}
                        </strong>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
