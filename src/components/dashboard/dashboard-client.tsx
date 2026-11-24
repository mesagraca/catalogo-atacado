"use client";

import { MarketplaceHealthClient } from "./marketplace-health-client";
import { getOrderStatusBadge } from "@/lib/order-status-badge";

import { useEffect, useState, useTransition, useRef, Fragment } from "react";
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

function ShieldCheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function ChevronDownIcon({ open, className = "w-4 h-4" }: { open?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""} ${className}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ClockIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SearchIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ArrowLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function DownloadIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function PlusIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function RefreshIcon({ loading, className = "w-4 h-4" }: { loading?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`${loading ? "animate-spin" : ""} ${className}`}>
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21h5v-5" />
    </svg>
  );
}

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CopyIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function InfoIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function PackageIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function TruckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect width="16" height="13" x="1" y="3" rx="2" />
      <polygon points="17 8 20 8 23 11 23 16 17 16 17 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function TrophyIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
      <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function LightbulbIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}

function SparklesIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </svg>
  );
}

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function BarChartIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

function TagIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  );
}

function MegaphoneIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

/**
 * Ícone oficial de canal de vendas usando os arquivos oficiais em /icons/.
 */
function ChannelBadgeIcon({ channel, className = "w-4 h-4" }: { channel: SalesChannel | string; className?: string }) {
  const ch = typeof channel === "string" ? getChannelKey(channel) : channel;
  const iconSrc =
    ch === "shopee"
      ? "/icons/shopee.png"
      : ch === "mercadolivre"
      ? "/icons/mercadolivre.png"
      : ch === "tiktok"
      ? "/icons/tiktok.ico"
      : "/icons/tray.png";

  return (
    <img
      src={iconSrc}
      alt={ch}
      className={`inline-block object-contain rounded-xs ${className}`}
      loading="lazy"
    />
  );
}

/**
 * Logo oficial de alta resolução para cada plataforma de anúncios.
 */
function PlatformLogoIcon({
  platform,
  className = "w-4 h-4",
}: {
  platform: AdPlatform | string;
  className?: string;
}) {
  if (platform === "shopee_ads" || platform === "shopee") {
    return (
      <img
        src="/icons/shopee.png"
        alt="Shopee Ads"
        className={`inline-block object-contain rounded-xs ${className}`}
        loading="lazy"
      />
    );
  }
  if (platform === "mercado_ads" || platform === "mercadolivre") {
    return (
      <img
        src="/icons/mercadolivre.png"
        alt="Mercado Ads"
        className={`inline-block object-contain rounded-xs ${className}`}
        loading="lazy"
      />
    );
  }
  if (platform === "tiktok_ads" || platform === "tiktok") {
    return (
      <img
        src="/icons/tiktok.ico"
        alt="TikTok Ads"
        className={`inline-block object-contain rounded-xs ${className}`}
        loading="lazy"
      />
    );
  }
  if (platform === "meta_ads" || platform === "facebook" || platform === "instagram") {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-md bg-[#0081FB]/10 text-[#0081FB] p-0.5 border border-[#0081FB]/20 flex-shrink-0 ${className}`}
        title="Meta Ads (Instagram & Facebook)"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      </span>
    );
  }
  return <span className={className}>📢</span>;
}

const PLATFORM_CHANNEL_MAP: Record<string, SalesChannel> = {
  shopee_ads: "shopee",
  mercado_ads: "mercadolivre",
  tiktok_ads: "tiktok",
  meta_ads: "site",
  google_ads: "site",
};

function ShopeeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return <ChannelBadgeIcon channel="shopee" className={className} />;
}

/**
 * Formata data para formato curto brasileiro DD/MM (usado no eixo X do gráfico).
 */
function formatShortDateBR(dateStr?: string | null): string {
  if (!dateStr) return "";
  const clean = dateStr.split(" ")[0];
  const parts = clean.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  const slashParts = clean.split("/");
  if (slashParts.length === 3) {
    if (slashParts[0].length === 4) return `${slashParts[2]}/${slashParts[1]}`;
    return `${slashParts[0]}/${slashParts[1]}`;
  }
  return dateStr;
}

/**
 * Formata data para formato completo brasileiro DD/MM/AAAA.
 */
function formatFullDateBR(dateStr?: string | null): string {
  if (!dateStr) return "";
  const clean = dateStr.split(" ")[0];
  const parts = clean.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  const slashParts = clean.split("/");
  if (slashParts.length === 3) {
    if (slashParts[0].length === 4) return `${slashParts[2]}/${slashParts[1]}/${slashParts[0]}`;
    return clean;
  }
  return dateStr;
}

function MercadoLivreIcon({ className = "w-4 h-4" }: { className?: string }) {
  return <ChannelBadgeIcon channel="mercadolivre" className={className} />;
}

function TrayStoreIcon({ className = "w-4 h-4" }: { className?: string }) {
  return <ChannelBadgeIcon channel="site" className={className} />;
}

function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return <ChannelBadgeIcon channel="tiktok" className={className} />;
}

/**
 * Converte array de coordenadas [x, y] em caminho SVG Bézier cúbico suave.
 */
function getBezierCurvePath(points: [number, number][], closeBottomY?: number): string {
  if (!points || points.length === 0) return "";
  if (points.length === 1) return `M ${points[0][0]},${points[0][1]}`;

  let d = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;

    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }

  if (closeBottomY != null) {
    const last = points[points.length - 1];
    const first = points[0];
    d += ` L ${last[0]},${closeBottomY} L ${first[0]},${closeBottomY} Z`;
  }
  return d;
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

function getChannelKey(channelName: string): SalesChannel {
  const norm = channelName.toLowerCase();
  if (norm.includes("shopee")) return "shopee";
  if (norm.includes("mercado")) return "mercadolivre";
  if (norm.includes("tiktok")) return "tiktok";
  return "site";
}

type DashboardTab = "caixa" | "produtos" | "pedidos" | "anuncios" | "saude";

/**
 * Dashboard Financeira Operacional da Mesa & Graça — Versão Ultra-Simples e Transparente.
 *
 * @description
 * Apresenta a verdade única do caixa financeiro sincronizado com o relatório oficial da Tray Commerce:
 * - Faturamento Oficial Canônico (R$ 6.043,46 nos 30 dias de pedidos aprovados)
 * - Esteira Transparente do Dinheiro: Recebido ➔ Frete ➔ Fábrica ➔ Taxas ➔ Lucro Limpo
 * - 4 Abas Especializadas: Caixa & Canais, Produtos Mais Lucrativos, Pedidos & Clientes, Anúncios & ROAS
 * - Navegação simples, rápida e autoexplicativa até para uma criança.
 *
 * @since v4.0.0
 * @category Dashboard
 */
export function DashboardClient() {
  const [days, setDays] = useState<number>(30);
  const [channel, setChannel] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<DashboardTab>("caixa");
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modos de Período & Filtros Avançados
  type PeriodMode = "7d" | "15d" | "30d" | "mtd" | "custom";
  const [periodMode, setPeriodMode] = useState<PeriodMode>("30d");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [tempCustomStart, setTempCustomStart] = useState<string>("");
  const [tempCustomEnd, setTempCustomEnd] = useState<string>("");
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState<boolean>(false);
  const filterPopoverRef = useRef<HTMLDivElement>(null);

  // Fecha o popover ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterPopoverRef.current &&
        !filterPopoverRef.current.contains(event.target as Node)
      ) {
        setIsFilterPopoverOpen(false);
      }
    }
    if (isFilterPopoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterPopoverOpen]);

  const getMtdDates = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return {
      startDate: `${year}-${month}-01`,
      endDate: `${year}-${month}-${day}`,
      label: `01 a ${day}/${month}`,
    };
  };

  const formatDateBR = (dateStr?: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  };

  const isToday = (dateStr?: string) => {
    if (!dateStr) return false;
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    return dateStr === todayStr;
  };

  // Estados expansíveis
  const [expandedOrderIds, setExpandedOrderIds] = useState<Record<string, boolean>>({});
  const [expandedProductSkus, setExpandedProductSkus] = useState<Record<string, boolean>>({});
  const [showAllTimeProducts, setShowAllTimeProducts] = useState<boolean>(false);

  type ProductSortField = "name" | "channel" | "units" | "revenue" | "cost" | "commissions" | "profit" | "margin";
  const [productSortField, setProductSortField] = useState<ProductSortField>("units");
  const [productSortAsc, setProductSortAsc] = useState<boolean>(false);

  const handleProductSort = (field: ProductSortField) => {
    if (productSortField === field) {
      setProductSortAsc((prev) => !prev);
    } else {
      setProductSortField(field);
      setProductSortAsc(field === "name" || field === "channel");
    }
  };

  type AdSortField = "date" | "platform" | "campaign" | "amount_spent" | "clicks" | "conversions";
  const [adSortField, setAdSortField] = useState<AdSortField>("date");
  const [adSortAsc, setAdSortAsc] = useState<boolean>(false);
  const [showZeroSpendDays, setShowZeroSpendDays] = useState<boolean>(true);
  const [showAdsAttributionGuide, setShowAdsAttributionGuide] = useState<boolean>(false);
  type MonthlyChannelFilter = "all" | "shopee" | "mercado_livre" | "site" | "tiktok";
  const [selectedMonthlyChannel, setSelectedMonthlyChannel] = useState<MonthlyChannelFilter>("all");
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(null);
  const [pinnedMonthIndex, setPinnedMonthIndex] = useState<number | null>(null);

  const handleAdSort = (field: AdSortField) => {
    if (adSortField === field) {
      setAdSortAsc((prev) => !prev);
    } else {
      setAdSortField(field);
      setAdSortAsc(field === "platform" || field === "campaign");
    }
  };

  const toggleOrderExpanded = (id: string) => {
    setExpandedOrderIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleProductExpanded = (sku: string) => {
    setExpandedProductSkus((prev) => ({ ...prev, [sku]: !prev[sku] }));
  };
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [expandedFeeSku, setExpandedFeeSku] = useState<string | null>(null);
  const [expandedOrderFeeId, setExpandedOrderFeeId] = useState<string | null>(null);
  const [expandedOrderSection, setExpandedOrderSection] = useState<string | null>(null);
  const [expandedProductMetric, setExpandedProductMetric] = useState<string | null>(null);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});
  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAllProductDetails = (sku: string) => {
    setOpenAccordions((prev) => {
      const current = !!prev[`prod-details-${sku}`];
      const next = !current;
      return {
        ...prev,
        [`prod-details-${sku}`]: next,
        [`prod-rev-${sku}`]: next,
        [`prod-cost-${sku}`]: next,
        [`prod-tax-${sku}`]: next,
        [`prod-profit-${sku}`]: next,
      };
    });
  };

  // Filtros operacionais
  const [productSearch, setProductSearch] = useState<string>("");
  const [orderSearch, setOrderSearch] = useState<string>("");
  type OrderStatusFilter = "todos" | "a_enviar" | "enviados" | "finalizados" | "cancelados" | "aguardando_pgto";
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatusFilter>("todos");
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [pinnedPointIndex, setPinnedPointIndex] = useState<number | null>(null);

  // Modo de visualização de pedidos: "approved" (padrão - caixa real) ou "all"
  const [orderViewMode, setOrderViewMode] = useState<"approved" | "all" | "pending" | "cancelled">("approved");

  // Filtro de escopo: "all" (todos os produtos) ou "textil" (apenas fabricação própria)
  const [scope, setScope] = useState<"all" | "textil">("all");

  const [isPending, startTransition] = useTransition();

  // Exportação CSV
  const handleExportCsv = () => {
    if (!data?.products || data.products.length === 0) {
      alert("Nenhum dado disponível para exportar.");
      return;
    }

    const headers = [
      "Produto",
      "SKU",
      "Canal Principal",
      "Unidades Vendidas",
      "Faturamento (R$)",
      "Custo Tecido/Fabrica (R$)",
      "Taxas Marketplace (R$)",
      "Lucro Limpo (R$)",
      "Margem (%)",
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

  // Modal de Anúncios
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

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      let queryUrl = `/api/admin/dashboard?channel=${channel}&status=${orderViewMode}&scope=${scope}`;
      if (periodMode === "mtd") {
        const mtd = getMtdDates();
        queryUrl += `&start_date=${mtd.startDate}&end_date=${mtd.endDate}`;
      } else if (periodMode === "custom" && customStartDate && customEndDate) {
        queryUrl += `&start_date=${customStartDate}&end_date=${customEndDate}`;
      } else {
        queryUrl += `&days=${days}`;
      }

      const res = await fetch(queryUrl);
      const json: DashboardResponse = await res.json().catch(() => null as any);
      if (!res.ok) {
        const errorDetail =
          (json as any)?.error ||
          (json as any)?.message ||
          (res.status === 500
            ? "O servidor encontrou uma instabilidade temporária ao consultar os marketplaces."
            : `Código HTTP ${res.status}`);
        throw new Error(`Falha na sincronização (HTTP ${res.status}): ${errorDetail}`);
      }
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
  }, [days, channel, orderViewMode, scope, periodMode, customStartDate, customEndDate]);

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

  const [isSyncingAds, setIsSyncingAds] = useState<boolean>(false);
  const [selectedAdPlatform, setSelectedAdPlatform] = useState<"all" | AdPlatform>("all");
  const [expandedAdRecordId, setExpandedAdRecordId] = useState<string | null>(null);
  const [syncAdsResult, setSyncAdsResult] = useState<string | null>(null);

  const handleSyncAds = async () => {
    setIsSyncingAds(true);
    setSyncAdsResult(null);
    try {
      const res = await fetch("/api/admin/dashboard/ads/sync", {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Falha na sincronização de anúncios.");
      }
      setSyncAdsResult(json.message || "Sincronização executada com sucesso.");
      await loadDashboard();
      setTimeout(() => setSyncAdsResult(null), 6000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao sincronizar anúncios.";
      alert(msg);
    } finally {
      setIsSyncingAds(false);
    }
  };

  const kpis = data?.kpis;
  const grossRevenue = kpis?.gross_revenue || 0;
  const shippingCost = kpis?.shipping_cost || 0;
  const productCost = kpis?.product_cost_cmv || 0;
  const commissions = kpis?.platform_commissions || 0;
  const netProfit = kpis?.operational_profit || 0;

  // Cálculo percentual para a esteira
  const shippingPct = grossRevenue > 0 ? (shippingCost / grossRevenue) * 100 : 0;
  const productCostPct = grossRevenue > 0 ? (productCost / grossRevenue) * 100 : 0;
  const commissionsPct = grossRevenue > 0 ? (commissions / grossRevenue) * 100 : 0;
  const netProfitPct = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

  let activeFiltersCount = 0;
  if (channel !== "all") activeFiltersCount++;
  if (scope !== "all") activeFiltersCount++;
  if (periodMode === "custom") activeFiltersCount++;

  const renderOrderCard = (o: DashboardResponse["recent_orders"][number]) => {
    const cfg = CHANNEL_CONFIG[o.channel];
                        const Icon = cfg.Icon;
                        const isExpanded = !!expandedOrderIds[o.id];

                        return (
                          <div
                            key={o.id}
                            onClick={() => {
                                if (typeof window !== "undefined" && window.getSelection()?.toString().trim().length) return;
                                toggleOrderExpanded(o.id);
                              }}
                            className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
                              isExpanded
                                ? "border-amber-400 bg-amber-50/20 shadow-xs ring-1 ring-amber-300"
                                : "border-stone-200 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300"
                            }`}
                          >
                            {/* Cabeçalho */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border inline-flex items-center gap-1.5 ${cfg.bg}`}
                                >
                                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span>{cfg.label}</span>
                                </span>
                                {o.status && (() => {
                                  const statusCfg = getOrderStatusBadge(o.status);
                                  return (
                                    <span
                                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${statusCfg.badgeClass}`}
                                      title={statusCfg.description}
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotClass}`} />
                                      <span>{statusCfg.label}</span>
                                    </span>
                                  );
                                })()}
                              </div>
                              <span className="text-xs text-stone-600 font-mono font-bold">
                                #{o.id}
                              </span>
                            </div>

                            {/* Miniaturas dos Produtos */}
                            <div className="py-1">
                              {o.items && o.items.length > 0 ? (
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
                                      Qtd: {o.items[0].quantity}x {o.items.length > 1 ? `(+${o.items.length - 1} outros)` : ""}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs text-stone-400 italic">
                                  {o.items_count} {o.items_count === 1 ? "peça" : "peças"}
                                </div>
                              )}
                            </div>

                            {/* Metadados: Data, Localidade, Frete */}
                            <div className="text-xs text-stone-600 flex justify-between items-center gap-2 flex-wrap">
                              <span className="font-medium whitespace-nowrap">
                                {formatFullDateBR(o.date)} {o.hour ? `às ${o.hour}` : ""}
                              </span>
                              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 flex-wrap">
                                {o.customer_city && (
                                  <span className="whitespace-nowrap">
                                    {o.customer_city}/{o.customer_state}
                                  </span>
                                )}
                                {o.shipment_name && (
                                  <span className="bg-stone-200/80 px-1.5 py-0.5 rounded text-[10px] font-medium text-stone-700 whitespace-nowrap">
                                    📦 {o.shipment_name}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Valores do Pedido */}
                            <div className="pt-2 border-t border-stone-200 flex justify-between items-start text-xs">
                              <div>
                                <span className="text-stone-500 text-[11px] block">Pago pelo Cliente</span>
                                <strong className="text-stone-900 font-bold text-sm tabular-nums">
                                  {money(o.total)}
                                </strong>
                              </div>
                              <div className="text-right">
                                <span className="text-stone-500 text-[11px] block">Lucro Limpo</span>
                                <strong className={`${o.net_profit < 0 ? "text-rose-700" : "text-emerald-700"} font-bold text-sm tabular-nums`}>
                                  {money(o.net_profit)}
                                </strong>
                                <div className="mt-1">
                                  {(() => {
                                    const marginPct =
                                      o.net_margin_percent != null
                                        ? o.net_margin_percent
                                        : o.total > 0
                                        ? (o.net_profit / o.total) * 100
                                        : 0;
                                    const isNeg = o.net_profit < 0 || marginPct < 0;
                                    const badgeClass = isNeg
                                      ? "bg-rose-50 text-rose-800 border-rose-200"
                                      : marginPct >= 30
                                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                      : marginPct >= 15
                                      ? "bg-amber-50 text-amber-900 border-amber-200"
                                      : "bg-rose-50 text-rose-800 border-rose-200";

                                    return (
                                      <span
                                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border tabular-nums ${badgeClass}`}
                                        title={`Margem líquida da compra: ${percent(marginPct)}`}
                                      >
                                        Margem {percent(marginPct)}
                                      </span>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>

                            {/* Detalhamento Expansível Estilo Shopee com Sanfonas */}
                            {isExpanded && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="mt-3 pt-3 border-t border-stone-200 space-y-2 cursor-default text-xs"
                              >
                                {(() => {
                                  const isShopee = o.channel === "shopee" || cfg.label.toLowerCase().includes("shopee");
                                  const isML = o.channel === "mercadolivre" || cfg.label.toLowerCase().includes("mercado");
                                  const isTikTok = o.channel === "tiktok" || cfg.label.toLowerCase().includes("tiktok");
                                  const isMarketplace = isShopee || isML || isTikTok;

                                  let orderKitsCount = 0;
                                  let orderPiecesCount = 0;
                                  let orderHasKits = false;
                                  let dominantPack = 1;

                                  (o.items || []).forEach((it) => {
                                    const name = it.name || "";
                                    const match = name.match(/kit\s*(\d+)/i) || name.match(/(\d+)\s*(?:peças|unidades|un|pcs)/i);
                                    const pack = match ? parseInt(match[1], 10) : (name.toLowerCase().includes("par") ? 2 : 1);
                                    const qty = it.quantity || 1;
                                    if (pack > 1 || name.toLowerCase().includes("kit")) {
                                      orderHasKits = true;
                                      if (pack > dominantPack) dominantPack = pack;
                                    }
                                    orderKitsCount += qty;
                                    orderPiecesCount += qty * pack;
                                  });

                                  const totalUnits = o.items_count || (o.items || []).reduce((acc, it) => acc + (it.quantity || 1), 0) || 1;
                                  if (orderPiecesCount === 0) {
                                    orderPiecesCount = totalUnits;
                                    orderKitsCount = totalUnits;
                                  }

                                  const unitCost = totalUnits > 0 ? (o.cost_amount || 0) / totalUnits : 0;
                                  const unitPieceCost = orderPiecesCount > 0 ? (o.cost_amount || 0) / orderPiecesCount : unitCost;
                                  const unitProfit = totalUnits > 0 ? (o.net_profit || 0) / totalUnits : 0;
                                  const unitPieceProfit = orderPiecesCount > 0 ? (o.net_profit || 0) / orderPiecesCount : unitProfit;
                                  const baseForPct = (o.products_subtotal ?? 0) > 0 ? o.products_subtotal! : (o.total || 0);

                                  // Regra Mercado Livre: Se o valor dos produtos for >= 79, o frete é obrigatório grátis para o comprador e custeado pelo vendedor (Mesa & Graça)
                                  const isMLFreeShippingSeller = isML && ((o.products_subtotal || o.total) >= 79) && ((o.shipment_value || 0) > 0 || (o.discount_value || 0) > 0);
                                  const shippingSellerCost = isMLFreeShippingSeller ? (o.shipment_value || o.discount_value || 0) : 0;

                                  // Decomposição Shopee oficial (18,60% comissão líquida + 1,40% taxa de transação + R$ 4,50 fixa por item)
                                  const shopeeCommLiquid = isShopee ? baseForPct * 0.186 : (o.commission_percentage_amount ?? ((o.commission_amount || 0) - (o.commission_fixed_fee || 0)));
                                  const shopeeTransFee = isShopee ? baseForPct * 0.014 : 0;
                                  const fixedFeeTotal = isShopee ? (totalUnits * 4.5) : (o.commission_fixed_fee ?? 0);
                                  const totalCommission = isShopee ? (shopeeCommLiquid + shopeeTransFee + fixedFeeTotal) : (o.commission_amount || 0);
                                  const netEstimatedRevenue = baseForPct - totalCommission - shippingSellerCost;

                                  const commPctAmount = isShopee ? (shopeeCommLiquid + shopeeTransFee) : (o.commission_percentage_amount ?? ((o.commission_amount || 0) - (o.commission_fixed_fee || 0)));
                                  const calculatedRate = baseForPct > 0 && commPctAmount > 0 ? Math.round((commPctAmount / baseForPct) * 100) : 0;
                                  const fallbackRate = isShopee ? 20 : isML ? 16 : isTikTok ? 7 : 3.5;
                                  const orderCommRate = calculatedRate > 0 ? calculatedRate : fallbackRate;
                                  const effectiveTotalPct = baseForPct > 0 ? Math.round((totalCommission / baseForPct) * 100) : orderCommRate;

                                  const isShippingOpen = !!openAccordions[`ord-ship-${o.id}`];
                                  const isFeesOpen = !!openAccordions[`ord-tax-${o.id}`] || expandedOrderFeeId === o.id;
                                  const isCostOpen = !!openAccordions[`ord-cost-${o.id}`];
                                  const isProfitOpen = !!openAccordions[`ord-profit-${o.id}`];

                                  return (
                                    <div className="space-y-2">
                                      {/* Container Unificado: Itens do Pedido & Detalhamento Interativo */}
                                      <div className="bg-white rounded-lg border border-stone-200 overflow-hidden text-[11px] shadow-2xs">
                                        {/* Cabeçalho Unificado */}
                                        <div className="bg-stone-50 px-3 py-2 border-b border-stone-200 flex justify-between items-center">
                                          <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                                            <span>Itens do Pedido</span>
                                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700 font-mono">
                                              {o.items?.length || 0}
                                            </span>
                                          </span>
                                          <div className="text-right">
                                            <span className="text-[10px] text-stone-500 mr-1.5 font-normal">Subtotal:</span>
                                            <strong className="text-stone-900 tabular-nums text-xs">
                                              {money(o.products_subtotal || o.total)}
                                            </strong>
                                          </div>
                                        </div>

                                        {/* Lista de Itens com Expansão por Clique */}
                                        <div className="divide-y divide-stone-100">
                                          {o.items && o.items.length > 0 ? (
                                            o.items.map((it, idx) => {
                                              const itemKey = `ord-item-${o.id}-${idx}`;
                                              const isItemExpanded = !!openAccordions[itemKey];
                                              const itNameLower = (it.name || "").toLowerCase();
                                              const itMatch = itNameLower.match(/kit\s*(\d+)/i) || itNameLower.match(/(\d+)\s*(?:peças|unidades|un|pcs)/i);
                                              let itPackSize = itMatch ? parseInt(itMatch[1], 10) : (itNameLower.includes("par") ? 2 : 1);
                                              const itHasLA = itNameLower.includes("lugar americano") || itNameLower.includes("jogo americano") || (it.sku || "").toUpperCase().includes("LAM");
                                              const itHasGUA = itNameLower.includes("guardanapo") || (it.sku || "").toUpperCase().includes("GUA");
                                              const itHasPGU = itNameLower.includes("porta") || (it.sku || "").toUpperCase().includes("PGU");
                                              if (itHasLA && itHasGUA && itHasPGU && itPackSize === 1) {
                                                if (itNameLower.includes("2 lugares") || itNameLower.includes("2lugares") || itNameLower.includes("6 peças")) {
                                                  itPackSize = 6;
                                                } else {
                                                  itPackSize = 3;
                                                }
                                              }
                                              const isItKit = itPackSize > 1 || itNameLower.includes("kit");

                                              return (
                                                <div key={it.sku || idx} className="transition-colors">
                                                  {/* Linha Principal do Produto (Clicável) */}
                                                  <div
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      toggleAccordion(itemKey);
                                                    }}
                                                    className="p-2.5 flex items-center gap-2.5 hover:bg-stone-50/80 cursor-pointer transition"
                                                    title="Clique para ver o detalhamento deste produto"
                                                  >
                                                    {/* Foto do Produto */}
                                                    <div className="w-10 h-10 rounded border border-stone-200 bg-stone-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                                      {it.image_url ? (
                                                        <img src={it.image_url} alt={it.name} className="w-full h-full object-cover" />
                                                      ) : (
                                                        <span className="text-xs">📦</span>
                                                      )}
                                                    </div>

                                                    {/* Conteúdo Central e Lateral em 2 Linhas Exatas */}
                                                    <div className="min-w-0 flex-1 space-y-1">
                                                      {/* 1ª Linha: Quantidade + Nome do Produto (esq) e Total (dir) */}
                                                      <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-stone-100 border border-stone-300 font-bold text-stone-800 text-[10px] tabular-nums shadow-2xs flex-shrink-0">
                                                            {it.quantity}x
                                                          </span>
                                                          <span className="font-semibold text-stone-900 truncate text-[11px]" title={it.name}>
                                                            {it.name.replace(/<br\s*\/?>/gi, " - ")}
                                                          </span>
                                                        </div>
                                                        <strong className="text-stone-900 tabular-nums font-bold text-xs flex-shrink-0">
                                                          {money(it.price * it.quantity)}
                                                        </strong>
                                                      </div>

                                                      {/* 2ª Linha: SKU (esq) e Ver detalhes com Chevron (dir) */}
                                                      <div className="flex items-center justify-between gap-2 text-[10px]">
                                                        <span className="text-stone-500 font-mono">
                                                          SKU: {it.sku}
                                                        </span>
                                                        <span className="text-stone-500 hover:text-stone-800 flex items-center gap-1 font-medium transition-colors flex-shrink-0">
                                                          <span>{isItemExpanded ? "recolher" : "ver detalhes"}</span>
                                                          <ChevronDownIcon
                                                            className={`w-3 h-3 transition-transform duration-200 ${
                                                              isItemExpanded ? "rotate-180 text-stone-700" : "text-stone-400"
                                                            }`}
                                                          />
                                                        </span>
                                                      </div>
                                                    </div>
                                                  </div>

                                                  {/* Detalhes Unitários Expandidos */}
                                                  {isItemExpanded && (
                                                    <div className="bg-stone-50/70 px-3 py-2 border-t border-stone-100 text-[10px] space-y-1.5 text-stone-600">
                                                      <div className="flex justify-between">
                                                        <span>Preço unitário:</span>
                                                        <span className="tabular-nums font-medium text-stone-900">
                                                          {money(it.price)} / {isItKit ? "kit" : "un"}
                                                          {isItKit && itPackSize > 1 && (
                                                            <span className="text-stone-400 font-normal"> ({money(it.price / itPackSize)} / peça)</span>
                                                          )}
                                                        </span>
                                                      </div>
                                                      <div className="flex justify-between">
                                                        <span>Quantidade comprada:</span>
                                                        <span className="tabular-nums font-medium text-stone-900">
                                                          {it.quantity} {isItKit ? `kits (${it.quantity * itPackSize} peças)` : "unidades"}
                                                        </span>
                                                      </div>
                                                      <div className="flex justify-between pt-1 border-t border-stone-200/50 font-semibold text-stone-800">
                                                        <span>Subtotal:</span>
                                                        <strong className="text-stone-900 tabular-nums">{money(it.price * it.quantity)}</strong>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })
                                          ) : (
                                            <div className="p-3 text-stone-500 italic text-[11px]">Itens não discriminados</div>
                                          )}
                                        </div>

                                        {/* Rodapé: Desconto do vendedor */}
                                        {o.discount_value != null && o.discount_value > 0 && (
                                          <div className="bg-stone-50/60 px-3 py-1.5 border-t border-stone-200 flex justify-between text-[10px] text-rose-700 font-medium">
                                            <span>Descontos concedidos pelo Vendedor:</span>
                                            <strong className="tabular-nums">-{money(o.discount_value)}</strong>
                                          </div>
                                        )}
                                      </div>

                                      {/* Sanfona 2: Subtotal estimado do frete com regra inteligente por canal */}
                                      <div
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (typeof window !== "undefined" && window.getSelection()?.toString().trim().length) return;
                                            toggleAccordion(`ord-ship-${o.id}`);
                                        }}
                                        className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100/70 border border-stone-200 cursor-pointer transition"
                                        title="Clique para ver os detalhes da operação de frete"
                                      >
                                        <div className="flex justify-between items-center gap-2 text-stone-700 min-w-0">
                                          <span className="flex items-center gap-1.5 font-medium whitespace-nowrap shrink-0 text-[11px]">
                                            <span>Frete / Logística:</span>
                                            <ChevronDownIcon
                                              className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                                                isShippingOpen ? "rotate-180 text-stone-700" : "text-stone-400"
                                              }`}
                                            />
                                          </span>
                                          <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                            {isMLFreeShippingSeller ? (
                                              <>
                                                <strong className="text-amber-800 tabular-nums whitespace-nowrap font-bold text-xs">
                                                  ⚠️ -{money(shippingSellerCost)}
                                                </strong>
                                                <span className="text-[9px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded whitespace-nowrap">
                                                  Pago pela Loja
                                                </span>
                                              </>
                                            ) : isMarketplace ? (
                                              <>
                                                <strong className="text-emerald-700 tabular-nums whitespace-nowrap font-bold text-xs">
                                                  R$ 0,00
                                                </strong>
                                                <span className="text-[9px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.2 rounded whitespace-nowrap">
                                                  Custeado
                                                </span>
                                              </>
                                            ) : (
                                              <>
                                                <strong className="text-sky-800 tabular-nums whitespace-nowrap font-bold text-xs">
                                                  +{money(o.shipment_value || 0)}
                                                </strong>
                                                <span className="text-[9px] font-semibold bg-sky-100 text-sky-900 border border-sky-300 px-1.5 py-0.2 rounded whitespace-nowrap">
                                                  Pago pelo Cliente
                                                </span>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                        {isShippingOpen && (
                                          <div className="mt-1.5 pt-1.5 border-t border-stone-200 text-[10px] space-y-1 text-stone-600">
                                            {isMLFreeShippingSeller ? (
                                              <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[10px] space-y-1">
                                                <div className="font-bold flex items-center gap-1 text-amber-950">
                                                  <span>⚠️ Frete Grátis Mercado Envios (Custeado pelo Vendedor):</span>
                                                </div>
                                                <p className="text-amber-900/90 leading-relaxed">
                                                  Em compras a partir de R$ 79,00 no Mercado Livre, o frete grátis ao comprador é obrigatório e custeado pela Mesa &amp; Graça via Mercado Envios ({o.shipment_name || "Encomenda Normal"}). O valor de {money(shippingSellerCost)} foi debitado do repasse da venda.
                                                </p>
                                                <div className="flex justify-between pt-1 border-t border-amber-200/80 font-bold text-amber-950">
                                                  <span>Custo de frete suportado pela loja:</span>
                                                  <span className="tabular-nums">-{money(shippingSellerCost)}</span>
                                                </div>
                                              </div>
                                            ) : isShopee ? (
                                              <>
                                                <div className="flex justify-between text-stone-700">
                                                  <span>Valor do frete pago pelo comprador / Shopee:</span>
                                                  <strong className="tabular-nums">+{money(o.shipment_value || 0)}</strong>
                                                </div>
                                                <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10px] space-y-0.5">
                                                  <div className="font-bold flex items-center gap-1">
                                                    <span>✅ Frete 100% Custeado pela Shopee:</span>
                                                  </div>
                                                  <p className="text-emerald-800">
                                                    Os cupons de frete grátis e envios regulares são subsidiados integralmente pela Shopee. O valor de {money(o.shipment_value || 0)} é repassado à transportadora ({o.shipment_name || "Shopee Xpress"}). Custo R$ 0,00 para a sua loja.
                                                  </p>
                                                </div>
                                                <div className="flex justify-between pt-0.5 border-t border-stone-200/80 font-semibold text-stone-700">
                                                  <span>Saldo de frete repassado à loja:</span>
                                                  <span className="tabular-nums font-semibold text-emerald-700">R$ 0,00 (100% Custeado pela Plataforma)</span>
                                                </div>
                                              </>
                                            ) : isTikTok ? (
                                              <>
                                                <div className="flex justify-between text-stone-700">
                                                  <span>Valor do frete pago pelo comprador / TikTok:</span>
                                                  <strong className="tabular-nums">+{money(o.shipment_value || 0)}</strong>
                                                </div>
                                                <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10px] space-y-0.5">
                                                  <div className="font-bold flex items-center gap-1">
                                                    <span>✅ Frete 100% Gerenciado pelo TikTok Shop:</span>
                                                  </div>
                                                  <p className="text-emerald-800">
                                                    Envio operado pela transportadora oficial ({o.shipment_name || "J&T Express Brazil"}). Custo R$ 0,00 para a sua loja.
                                                  </p>
                                                </div>
                                                <div className="flex justify-between pt-0.5 border-t border-stone-200/80 font-semibold text-stone-700">
                                                  <span>Saldo de frete repassado à loja:</span>
                                                  <span className="tabular-nums font-semibold text-emerald-700">R$ 0,00 (100% Custeado pela Plataforma)</span>
                                                </div>
                                              </>
                                            ) : isML ? (
                                              <>
                                                <div className="flex justify-between text-stone-700">
                                                  <span>Taxa de frete paga pelo comprador:</span>
                                                  <strong className="tabular-nums">+{money(o.shipment_value || 0)}</strong>
                                                </div>
                                                <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10px] space-y-0.5">
                                                  <div className="font-bold flex items-center gap-1">
                                                    <span>✅ Frete Pago pelo Comprador:</span>
                                                  </div>
                                                  <p className="text-emerald-800">
                                                    Como o pedido é inferior a R$ 79,00 no Mercado Livre, o frete de {money(o.shipment_value || 0)} foi pago pelo comprador ({o.shipment_name || "Mercado Envios"}). Custo R$ 0,00 para a sua loja.
                                                  </p>
                                                </div>
                                                <div className="flex justify-between pt-0.5 border-t border-stone-200/80 font-semibold text-stone-700">
                                                  <span>Saldo de frete repassado à loja:</span>
                                                  <span className="tabular-nums font-semibold text-emerald-700">R$ 0,00 (Custeado pelo Comprador)</span>
                                                </div>
                                              </>
                                            ) : (
                                              <>
                                                <div className="flex justify-between text-sky-800">
                                                  <span>Taxa de frete paga pelo cliente no checkout:</span>
                                                  <strong className="tabular-nums">+{money(o.shipment_value || 0)}</strong>
                                                </div>
                                                <div className="p-2 rounded bg-sky-50 border border-sky-200 text-sky-900 text-[10px] space-y-0.5">
                                                  <div className="font-bold flex items-center gap-1">
                                                    <span>📦 Frete Próprio da Loja Virtual:</span>
                                                  </div>
                                                  <p className="text-sky-800">
                                                    O valor pago pelo cliente entra no caixa da loja e é repassado para a compra da etiqueta junto à transportadora ({o.shipment_name || "Correios / Melhor Envio"}).
                                                  </p>
                                                </div>
                                                <div className="flex justify-between pt-0.5 border-t border-stone-200/80 font-semibold text-stone-700">
                                                  <span>Saldo de frete repassado à loja:</span>
                                                  <span className="tabular-nums font-semibold text-sky-800">+{money(o.shipment_value || 0)}</span>
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        )}
                                      </div>

                                      {/* Sanfona 3: Taxas e Encargos da Plataforma */}
                                      <div
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (typeof window !== "undefined" && window.getSelection()?.toString().trim().length) return;
                                            toggleAccordion(`ord-tax-${o.id}`);
                                          setExpandedOrderFeeId(isFeesOpen ? null : o.id);
                                        }}
                                        className="p-2 rounded-lg bg-orange-50/70 hover:bg-orange-50 border border-orange-200 cursor-pointer transition"
                                        title="Clique para ver a decomposição centavo a centavo das taxas"
                                      >
                                        <div className="flex justify-between items-center text-orange-900 font-semibold">
                                          <span className="flex items-center gap-1.5">
                                            <span>Taxas e Encargos ({cfg.label} - {effectiveTotalPct}%):</span>
                                            <ChevronDownIcon
                                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                                isFeesOpen ? "rotate-180 text-orange-800" : "text-orange-600"
                                              }`}
                                            />
                                          </span>
                                          <strong className="text-orange-700 tabular-nums">-{money(totalCommission)}</strong>
                                        </div>

                                        {isFeesOpen && (
                                          <div className="mt-2 pt-2 border-t border-orange-200 text-[10px] space-y-1 text-orange-950">
                                            <div className="flex justify-between">
                                              <span
                                                className="flex items-center gap-1 cursor-help"
                                                title={isShopee ? "A Shopee cobra 18.60% do valor do seu produto como comissão" : undefined}
                                              >
                                                <span>Taxa de comissão líquida ({isShopee ? "18,60%" : `${orderCommRate}%`}):</span>
                                                {isShopee && <InfoIcon className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />}
                                              </span>
                                              <strong className="text-orange-900 tabular-nums">-{money(shopeeCommLiquid)}</strong>
                                            </div>
                                            {isShopee && (
                                              <div className="flex justify-between pl-1 text-stone-600">
                                                <span>Taxa de transação (1,40%):</span>
                                                <strong className="text-orange-900 tabular-nums">-{money(shopeeTransFee)}</strong>
                                              </div>
                                            )}
                                            <div className="flex justify-between">
                                              <span className="flex items-center gap-1 flex-wrap"><span>Taxa por item vendido:</span> <span className="tabular-nums text-orange-900 font-normal whitespace-nowrap">({totalUnits} un × R$ {isShopee ? "4,50" : (fixedFeeTotal / totalUnits).toFixed(2)})</span></span>
                                              <strong className="text-orange-900 tabular-nums">-{money(fixedFeeTotal)}</strong>
                                            </div>
                                            <div className="flex justify-between pt-1 border-t border-orange-200/80 font-bold text-orange-950">
                                              <span>Total Retido pelo Canal:</span>
                                              <span className="tabular-nums">-{money(totalCommission)}</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Destaque Estilo Shopee: Renda Estimada do Pedido */}
                                      <div className="p-2.5 rounded-lg bg-orange-50 border border-orange-200 flex justify-between items-center shadow-2xs">
                                        <div>
                                          <span className="font-bold text-stone-800 text-xs block">Renda estimada do pedido</span>
                                          <span className="text-[10px] text-stone-500">Valor líquido repassado no caixa</span>
                                        </div>
                                        <strong className="text-orange-600 font-extrabold text-base tabular-nums">
                                          {money(netEstimatedRevenue)}
                                        </strong>
                                      </div>

                                      {/* Sanfona 4: Custo Fábrica / CMV */}
                                      <div
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (typeof window !== "undefined" && window.getSelection()?.toString().trim().length) return;
                                            toggleAccordion(`ord-cost-${o.id}`);
                                        }}
                                        className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100/70 border border-stone-200 cursor-pointer transition"
                                        title="Clique para ver o custo de fábrica unitário e origem"
                                      >
                                        <div className="flex justify-between items-center text-stone-700">
                                          <span className="flex items-center gap-1.5 font-medium">
                                            <span>Custo Fábrica:</span>
                                            <ChevronDownIcon
                                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                                isCostOpen ? "rotate-180 text-stone-700" : "text-stone-400"
                                              }`}
                                            />
                                          </span>
                                          <strong className="text-stone-800 tabular-nums">-{money(o.cost_amount || 0)}</strong>
                                        </div>
                                        {isCostOpen && (
                                          <div className="mt-1.5 pt-1.5 border-t border-stone-200 text-[10px] space-y-1 text-stone-600">
                                            <div className="flex justify-between text-stone-500 pb-0.5 border-b border-stone-100">
                                              <span>Cálculo Base:</span>
                                              <span className="tabular-nums font-mono text-stone-700">
                                                {orderHasKits && orderPiecesCount > orderKitsCount
                                                  ? `${orderKitsCount} kits (${orderPiecesCount} peças) × -${money(unitCost)}`
                                                  : `${totalUnits} un × -${money(unitCost)}`}
                                              </span>
                                            </div>
                                            {orderHasKits && orderPiecesCount > orderKitsCount ? (
                                              <>
                                                <div className="flex justify-between">
                                                  <span>Custo por Kit Anunciado:</span>
                                                  <strong className="text-stone-900 tabular-nums">-{money(unitCost)} / kit</strong>
                                                </div>
                                                <div className="flex justify-between text-stone-600">
                                                  <span>Custo Unitário por Peça:</span>
                                                  <strong className="text-stone-900 tabular-nums">-{money(unitPieceCost)} / peça</strong>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span>Total de Peças Produzidas:</span>
                                                  <strong className="text-stone-900 tabular-nums">{orderKitsCount} kits ({orderPiecesCount} peças)</strong>
                                                </div>
                                              </>
                                            ) : (
                                              <>
                                                <div className="flex justify-between">
                                                  <span>Custo Unitário de Confecção:</span>
                                                  <strong className="text-stone-900 tabular-nums">-{money(unitCost)} / un</strong>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span>Quantidade de Peças Produzidas:</span>
                                                  <strong className="text-stone-900 tabular-nums">{totalUnits} peças</strong>
                                                </div>
                                              </>
                                            )}
                                            <div className="flex justify-between pt-0.5 border-t border-stone-200/50">
                                              <span>Origem:</span>
                                              <strong className="text-stone-900">
                                                {(o.items || []).some((it) => it.is_own_production) ? "Confecção Própria Mesa & Graça" : "Revenda / Insumos"}
                                              </strong>
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Sanfona 5: Lucro Limpo no Bolso */}
                                      {(() => {
                                        const marginPct =
                                          o.net_margin_percent != null
                                            ? o.net_margin_percent
                                            : o.total > 0
                                            ? (o.net_profit / o.total) * 100
                                            : 0;
                                        const isNeg = o.net_profit < 0 || marginPct < 0;
                                        const marginBadgeClass = isNeg
                                          ? "bg-rose-100 text-rose-900 border-rose-300"
                                          : marginPct >= 30
                                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                          : marginPct >= 15
                                          ? "bg-amber-100 text-amber-950 border-amber-300"
                                          : "bg-rose-100 text-rose-900 border-rose-300";

                                        const accordionBgClass = isNeg
                                          ? "bg-rose-50 border-rose-200"
                                          : marginPct >= 30
                                          ? "bg-emerald-50 border-emerald-200"
                                          : marginPct >= 15
                                          ? "bg-amber-50 border-amber-200"
                                          : "bg-rose-50 border-rose-200";

                                        const titleTextClass = isNeg
                                          ? "text-rose-800"
                                          : marginPct >= 30
                                          ? "text-emerald-800"
                                          : marginPct >= 15
                                          ? "text-amber-900"
                                          : "text-rose-800";

                                        const valTextClass = isNeg
                                          ? "text-rose-700"
                                          : marginPct >= 30
                                          ? "text-emerald-700"
                                          : marginPct >= 15
                                          ? "text-amber-800"
                                          : "text-rose-700";

                                        return (
                                          <div
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (typeof window !== "undefined" && window.getSelection()?.toString().trim().length) return;
                                              toggleAccordion(`ord-profit-${o.id}`);
                                            }}
                                            className={`p-2.5 rounded-lg border cursor-pointer transition ${accordionBgClass}`}
                                            title="Clique para ver o cálculo do lucro limpo"
                                          >
                                            <div className="flex justify-between items-center">
                                              <span className={`font-bold flex items-center gap-1.5 ${titleTextClass}`}>
                                                <span>Lucro Limpo no Bolso:</span>
                                                <ChevronDownIcon
                                                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                                    isProfitOpen ? "rotate-180" : ""
                                                  }`}
                                                />
                                              </span>
                                              <strong className={`text-sm font-extrabold tabular-nums ${valTextClass}`}>
                                                {money(o.net_profit)}
                                              </strong>
                                            </div>

                                            {isProfitOpen && (
                                              <div className={`mt-2 pt-2 border-t text-[10px] space-y-1 ${
                                                isNeg ? "border-rose-200 text-rose-950" : marginPct >= 30 ? "border-emerald-200 text-emerald-950" : marginPct >= 15 ? "border-amber-200 text-amber-950" : "border-rose-200 text-rose-950"
                                              }`}>
                                                {orderHasKits && orderPiecesCount > orderKitsCount ? (
                                                  <>
                                                    <div className="flex justify-between">
                                                      <span>Lucro por Kit Anunciado:</span>
                                                      <strong className="tabular-nums font-semibold">{money(unitProfit)} / kit</strong>
                                                    </div>
                                                    <div className="flex justify-between text-stone-600">
                                                      <span>Lucro Unitário por Peça:</span>
                                                      <strong className="tabular-nums font-semibold">{money(unitPieceProfit)} / peça</strong>
                                                    </div>
                                                  </>
                                                ) : (
                                                  <div className="flex justify-between">
                                                    <span>Lucro Unitário:</span>
                                                    <strong className="tabular-nums">{money(unitProfit)} / peça</strong>
                                                  </div>
                                                )}
                                                <div className="flex justify-between items-center pt-0.5">
                                                  <span className="font-semibold">Margem Líquida Real:</span>
                                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border tabular-nums ${marginBadgeClass}`}>
                                                    {percent(marginPct)}
                                                  </span>
                                                </div>
                                                {shippingSellerCost > 0 && (
                                                  <div className="flex justify-between text-amber-900 pb-0.5 border-b border-amber-200/50">
                                                    <span>Frete Mercado Envios (Custeado pela Loja):</span>
                                                    <strong className="tabular-nums font-semibold">- {money(shippingSellerCost)}</strong>
                                                  </div>
                                                )}
                                                <div className="pt-1 border-t border-current/20 text-[9px] opacity-80 tabular-nums">
                                                  {shippingSellerCost > 0
                                                    ? `Renda Repassada (${money(netEstimatedRevenue)}) [Venda - Taxas - Frete Mercado Envios] - Custo Fábrica (${money(o.cost_amount || 0)}) = ${money(o.net_profit)}`
                                                    : `Renda Repassada (${money(netEstimatedRevenue)}) - Custo Fábrica (${money(o.cost_amount || 0)}) = ${money(o.net_profit)}`}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  );
                                })()}

                                <div className="flex justify-end pt-1">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard?.writeText(o.id);
                                      setCopiedOrderId(o.id);
                                      setTimeout(() => setCopiedOrderId(null), 2000);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 active:scale-[0.98] transition border border-stone-200"
                                  >
                                    {copiedOrderId === o.id ? (
                                      <>
                                        <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                                        <span className="text-emerald-700">ID Copiado!</span>
                                      </>
                                    ) : (
                                      <>
                                        <CopyIcon className="w-3.5 h-3.5 text-stone-500" />
                                        <span>Copiar ID #{o.id}</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-16 font-sans">
      {/* Overlay Global de Carregamento com Fundo Escurecido e Animação Central */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 sm:p-8 max-w-sm w-full text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin" />
              <span className="text-2xl animate-pulse">📊</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 tracking-tight">
                Atualizando Métricas em Tempo Real
              </h3>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                Consultando pedidos, taxas oficiais, estoques e preços na Tray Commerce e marketplaces...
              </p>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-600 h-1.5 rounded-full w-2/3 animate-[pulse_1.5s_ease-in-out_infinite]" />
            </div>
            <span className="text-[10px] text-stone-400 font-medium block">
              Mesa &amp; Graça · Inteligência de Vendas
            </span>
          </div>
        </div>
      )}
      {/* Top Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-stone-500 hover:text-stone-900 text-sm font-medium inline-flex items-center gap-1.5 transition min-h-[44px] sm:min-h-[38px] px-2 py-1 -ml-2 rounded-lg hover:bg-stone-50"
            >
              <ArrowLeftIcon className="w-4 h-4 text-stone-500" />
              <span>Painel Catálogo</span>
            </Link>
            <span className="text-stone-300">|</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-amber-950">
                Mesa &amp; Graça
              </span>
              <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                Painel do Caixa
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={handleExportCsv}
              className="border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-medium px-3 py-2 rounded-lg transition inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-[38px] active:scale-[0.98]"
              title="Baixar planilha para Excel"
            >
              <DownloadIcon className="w-4 h-4 text-stone-600" />
              <span>Exportar</span>
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg shadow-xs transition inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-[38px] active:scale-[0.98]"
            >
              <PlusIcon className="w-4 h-4 text-white" />
              <span>Lançar Anúncio</span>
            </button>
            <button
              onClick={loadDashboard}
              disabled={loading}
              className="border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-medium px-3 py-2 rounded-lg transition inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-[38px] active:scale-[0.98]"
              title="Recarregar dados"
            >
              <RefreshIcon className={`w-4 h-4 text-stone-600 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Atualizando..." : "Atualizar"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Título & Filtros de Período e Canal */}
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              O Caixa Real da Sua Loja
            </h1>
            <p className="text-sm text-stone-600 mt-1 flex items-center gap-2 flex-wrap">
              <span>
                Entenda exatamente quanto entrou, quanto foi para tecido e fábrica, as taxas dos canais e o que sobrou limpo no seu bolso.
              </span>
              {data?.start_date && data?.end_date && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-800 text-[11px] font-semibold border border-stone-300">
                  <span>📅</span>
                  <span>
                    Período: <strong>{formatDateBR(data.start_date)}</strong> até <strong>{formatDateBR(data.end_date)}</strong>
                    {isToday(data.end_date) ? " (Hoje)" : ""}
                  </span>
                </span>
              )}
            </p>
          </div>

          {/* Controles de Topo: Datas Rápidas + Painel Flutuante de Filtros */}
          <div className="flex items-center gap-2 flex-shrink-0 relative" ref={filterPopoverRef}>
            {/* Pílulas de Datas Rápidas */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 shadow-2xs">
              {[7, 15, 30].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setPeriodMode(`${d}d` as PeriodMode);
                    setDays(d);
                    setCustomStartDate("");
                    setCustomEndDate("");
                  }}
                  className={`text-xs font-semibold px-2.5 py-1.5 min-h-[36px] rounded-lg transition active:scale-[0.98] inline-flex items-center justify-center ${
                    periodMode === `${d}d`
                      ? "bg-amber-950 text-white shadow-xs font-bold"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {d}d
                </button>
              ))}

              {/* Botão Este Mês */}
              <button
                type="button"
                onClick={() => {
                  const mtd = getMtdDates();
                  setPeriodMode("mtd");
                  setCustomStartDate(mtd.startDate);
                  setCustomEndDate(mtd.endDate);
                }}
                className={`text-xs font-semibold px-3 py-1.5 min-h-[36px] rounded-lg transition active:scale-[0.98] inline-flex items-center justify-center ${
                  periodMode === "mtd"
                    ? "bg-amber-950 text-white shadow-xs font-bold"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
                title={`Do dia 1º até o dia de hoje (${getMtdDates().label})`}
              >
                Este Mês
              </button>
            </div>

            {/* Botão Gatilho do Painel Flutuante de Filtros */}
            <button
              type="button"
              onClick={() => setIsFilterPopoverOpen((prev) => !prev)}
              className={`text-xs font-semibold px-3.5 py-1.5 min-h-[38px] rounded-xl border transition flex items-center gap-2 active:scale-[0.98] cursor-pointer shadow-2xs ${
                activeFiltersCount > 0 || isFilterPopoverOpen
                  ? "bg-amber-50 text-amber-950 border-amber-300 ring-2 ring-amber-300/30"
                  : "bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              <span>⚙️ Filtros</span>
              {periodMode === "custom" && customStartDate ? (
                <span className="text-[10px] bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded font-mono font-bold">
                  📅 {customStartDate.slice(5).replace("-", "/")} a {customEndDate.slice(5).replace("-", "/")}
                </span>
              ) : activeFiltersCount > 0 ? (
                <span className="text-[10px] bg-amber-900 text-white w-4 h-4 rounded-full inline-flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              ) : null}
              <span className="text-[10px] text-stone-400">{isFilterPopoverOpen ? "▲" : "▼"}</span>
            </button>

            {/* Painel Flutuante (Popover) de Filtros e Datas Personalizadas */}
            {isFilterPopoverOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 p-5 z-50 space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚙️</span>
                    <h3 className="font-bold text-sm text-stone-900">Filtros Avançados &amp; Período</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFilterPopoverOpen(false)}
                    className="w-6 h-6 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 inline-flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>

                {/* 1. Data Personalizada */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                      📅 Período Livre (Personalizado)
                    </label>
                    {periodMode === "custom" && (
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Ativo
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 block mb-0.5">De:</span>
                      <input
                        type="date"
                        value={tempCustomStart || customStartDate}
                        onChange={(e) => setTempCustomStart(e.target.value)}
                        className="w-full text-xs border border-stone-200 rounded-lg p-2 text-stone-800 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-950 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block mb-0.5">Até:</span>
                      <input
                        type="date"
                        value={tempCustomEnd || customEndDate}
                        onChange={(e) => setTempCustomEnd(e.target.value)}
                        className="w-full text-xs border border-stone-200 rounded-lg p-2 text-stone-800 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-950 font-mono"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const start = tempCustomStart || customStartDate;
                      const end = tempCustomEnd || customEndDate;
                      if (!start || !end) {
                        alert("Selecione a data inicial e final.");
                        return;
                      }
                      if (start > end) {
                        alert("A data inicial não pode ser maior que a final.");
                        return;
                      }
                      setCustomStartDate(start);
                      setCustomEndDate(end);
                      setPeriodMode("custom");
                      setIsFilterPopoverOpen(false);
                    }}
                    className="w-full py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition active:scale-[0.98]"
                  >
                    Aplicar Datas Personalizadas
                  </button>
                </div>

                {/* 2. Escopo do Catálogo */}
                <div className="space-y-1.5 pt-3 border-t border-stone-100">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    🧵 Escopo de Produção
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setScope("all")}
                      className={`text-xs font-semibold py-2 px-3 rounded-lg border transition text-center ${
                        scope === "all"
                          ? "bg-stone-900 text-white border-stone-900 shadow-2xs"
                          : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                      }`}
                    >
                      Todos os Produtos
                    </button>
                    <button
                      type="button"
                      onClick={() => setScope("textil")}
                      className={`text-xs font-semibold py-2 px-3 rounded-lg border transition text-center flex items-center justify-center gap-1.5 ${
                        scope === "textil"
                          ? "bg-emerald-800 text-white border-emerald-800 shadow-2xs"
                          : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-emerald-50 hover:text-emerald-900"
                      }`}
                      title="Apenas peças produzidas na sua confecção têxtil"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${scope === "textil" ? "bg-emerald-300" : "bg-emerald-600"}`} />
                      Só Confecção
                    </button>
                  </div>
                </div>

                {/* 3. Canal de Venda */}
                <div className="space-y-1.5 pt-3 border-t border-stone-100">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    🛍️ Canal de Vendas
                  </label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full text-xs font-medium bg-stone-50 text-stone-800 border border-stone-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-amber-950 cursor-pointer"
                  >
                    <option value="all">🌐 Todos os Canais</option>
                    <option value="site">🛒 Loja Virtual (Tray)</option>
                    <option value="shopee">🟠 Shopee</option>
                    <option value="mercadolivre">🟡 Mercado Livre</option>
                    <option value="tiktok">⚫ TikTok Shop</option>
                  </select>
                </div>

                {/* Rodapé: Limpar e Concluir */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setPeriodMode("30d");
                      setDays(30);
                      setCustomStartDate("");
                      setCustomEndDate("");
                      setTempCustomStart("");
                      setTempCustomEnd("");
                      setScope("all");
                      setChannel("all");
                      setIsFilterPopoverOpen(false);
                    }}
                    className="text-stone-500 hover:text-rose-700 underline text-xs font-medium"
                  >
                    Limpar todos os filtros
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFilterPopoverOpen(false)}
                    className="px-4 py-1.5 bg-amber-950 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold shadow-2xs"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HERO CARD MESTRE: A ESTEIRA TRANSPARENTE DO DINHEIRO                      */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-5 sm:p-6 mb-8">
          {/* Topo do Hero: Faturamento Oficial Canônico e Status da Sincronização */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Total Recebido das Vendas
                </span>
                {data?.start_date && data?.end_date && (
                  <span
                    className="text-[11px] font-semibold bg-amber-50 text-amber-950 border border-amber-300/80 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 shadow-2xs"
                    title={`Intervalo exato analisado: de ${formatDateBR(data.start_date)} até ${formatDateBR(data.end_date)} (${data.period_days || days} dias)`}
                  >
                    <span>📅</span>
                    <span>
                      {formatDateBR(data.start_date)} até {formatDateBR(data.end_date)}
                      {isToday(data.end_date) ? " (Hoje)" : ""}
                    </span>
                    <span className="text-[10px] text-amber-800/80 font-normal">
                      · {data.period_days || days} dias
                    </span>
                  </span>
                )}
                <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Conferência Oficial Tray: 100% Sincronizado
                </span>
              </div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                  {loading ? "..." : money(grossRevenue)}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {kpis?.total_orders || 0} pedidos pagos e aprovados
                  {data?.start_date && data?.end_date && (
                    <span className="text-stone-700 font-semibold">
                      {" "}(de {formatDateBR(data.start_date).slice(0, 5)} a {formatDateBR(data.end_date).slice(0, 5)})
                    </span>
                  )}
                  {" "}· Ticket Médio: {money(kpis?.average_ticket)}
                </span>
              </div>
            </div>

            {/* Alternador de Visualização de Pedidos da Tray */}
            <div className="flex items-center gap-1.5 bg-stone-50 p-1 rounded-xl border border-stone-200 text-xs self-start lg:self-auto flex-wrap">
              <button
                type="button"
                onClick={() => setOrderViewMode("approved")}
                className={`font-semibold px-3 py-1.5 min-h-[38px] rounded-lg transition active:scale-[0.98] inline-flex items-center gap-1.5 ${
                  orderViewMode === "approved"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-stone-600 hover:bg-stone-200/70"
                }`}
                title="Apenas pedidos com pagamentos concluídos e aprovados (caixa real)"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Aprovados ({data?.tray_kpis?.active_orders_count || kpis?.total_orders || 0})
              </button>
              <button
                type="button"
                onClick={() => setOrderViewMode("all")}
                className={`font-semibold px-3 py-1.5 min-h-[38px] rounded-lg transition active:scale-[0.98] inline-flex items-center gap-1.5 ${
                  orderViewMode === "all"
                    ? "bg-sky-600 text-white shadow-xs"
                    : "text-stone-600 hover:bg-stone-200/70"
                }`}
                title="Todos os pedidos registrados na Tray incluindo pendentes e cancelados"
              >
                Todos ({data?.tray_kpis?.total_orders_count || 0})
              </button>
            </div>
          </div>

          {/* A ESTEIRA VISUAL: Fluxo de Entrada até o Bolso */}
          <div className="pt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
              <span>Para onde foi cada real recebido? (Esteira do Caixa)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Etapa 1: Venda do Cliente */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-stone-200/30 rounded-bl-full pointer-events-none" />
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    1. Entrou na Loja
                  </span>
                  <div className="text-xl font-extrabold text-stone-900 mt-1 tabular-nums whitespace-nowrap">
                    {loading ? "..." : money(grossRevenue)}
                  </div>
                  <span className="text-[11px] text-stone-500 block mt-0.5 whitespace-nowrap">
                    100% do total pago pelos clientes
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-200/80 text-[11px] text-stone-600 whitespace-nowrap">
                  {kpis?.total_orders || 0} compras finalizadas
                </div>
              </div>

              {/* Etapa 2: Frete Repassado */}
              <div className="bg-sky-50/60 rounded-xl p-4 border border-sky-200 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-900 block">
                    2. Frete Suportado pela Loja
                  </span>
                  <div className="text-xl font-extrabold text-sky-950 mt-1 tabular-nums whitespace-nowrap">
                    -{loading ? "..." : money(shippingCost)}
                  </div>
                  <span className="text-[11px] text-sky-700 font-medium block mt-0.5 whitespace-nowrap tabular-nums">
                    {percent(shippingPct)} das vendas brutas
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-sky-200/80 text-[10px] text-sky-800 space-y-0.5 leading-tight">
                  <div className="font-semibold text-sky-950">
                    Mercado Envios (pedidos ≥ R$ 79)
                  </div>
                  <div className="text-sky-700">
                    +R$ {money(data?.kpis?.third_party_shipping || 0)} custeado por compradores / plataformas (custo R$ 0)
                  </div>
                </div>
              </div>

              {/* Etapa 3: Tecido & Fábrica */}
              <div className="bg-stone-100/70 rounded-xl p-4 border border-stone-300 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block">
                    3. Tecido &amp; Fábrica
                  </span>
                  <div className="text-xl font-extrabold text-stone-800 mt-1 tabular-nums whitespace-nowrap">
                    -{loading ? "..." : money(productCost)}
                  </div>
                  <span className="text-[11px] text-stone-600 font-medium block mt-0.5 whitespace-nowrap tabular-nums">
                    {percent(productCostPct)} custo de produção (CMV)
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-200/80 text-[11px] text-stone-600">
                  Tecido, bordado, linha e costura
                </div>
              </div>

              {/* Etapa 4: Taxas dos Marketplaces */}
              <div className="bg-orange-50/70 rounded-xl p-4 border border-orange-200 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-orange-900 block">
                    4. Taxas dos Canais
                  </span>
                  <div className="text-xl font-extrabold text-orange-900 mt-1 tabular-nums whitespace-nowrap">
                    -{loading ? "..." : money(commissions)}
                  </div>
                  <span className="text-[11px] text-orange-700 font-medium block mt-0.5 whitespace-nowrap tabular-nums">
                    {percent(commissionsPct)} retido pelas plataformas
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-orange-200/80 text-[11px] text-orange-800">
                  Comissões da Shopee, ML e TikTok
                </div>
              </div>

              {/* Etapa 5: Lucro Limpo no Bolso */}
              <div className="bg-emerald-700 text-white rounded-xl p-4 shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-1">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 block">
                    5. Lucro no Bolso
                  </span>
                  <div className="text-2xl font-black text-white mt-1 tabular-nums whitespace-nowrap">
                    {loading ? "..." : money(netProfit)}
                  </div>
                  <span className="text-[11px] text-emerald-100 font-semibold block mt-0.5 tabular-nums whitespace-nowrap">
                    {percent(netProfitPct)} margem líquida real
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-emerald-600/80 text-[11px] text-emerald-100">
                  Lucro operacional líquido das vendas
                </div>
              </div>
            </div>

            {/* O Cartão Didático: Tradução do Caixa em R$ 100 */}
            <div className="mt-4 bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 sm:p-4 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-800">
                  <LightbulbIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold">Em termos simples:</span> A cada{" "}
                  <strong className="tabular-nums">R$ 100,00</strong> que entram na loja:
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-amber-900">
                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                      <TruckIcon className="w-3.5 h-3.5 text-sky-700 flex-shrink-0" />
                      <span><strong className="tabular-nums">{money(shippingPct)}</strong> vão para frete</span>
                    </span>
                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                      <PackageIcon className="w-3.5 h-3.5 text-stone-700 flex-shrink-0" />
                      <span><strong className="tabular-nums">{money(productCostPct)}</strong> pagam tecido e costura</span>
                    </span>
                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                      <TagIcon className="w-3.5 h-3.5 text-orange-700 flex-shrink-0" />
                      <span><strong className="tabular-nums">{money(commissionsPct)}</strong> ficam com os canais</span>
                    </span>
                    <span className="text-emerald-900 font-bold bg-emerald-100 px-2 py-0.5 rounded inline-flex items-center gap-1 whitespace-nowrap">
                      <SparklesIcon className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                      <span><strong className="tabular-nums">{money(netProfitPct)}</strong> sobram limpos no bolso!</span>
                    </span>
                  </div>
                </div>
              </div>

              {data?.missing_costs_count != null && data.missing_costs_count > 0 && scope === "all" && (
                <button
                  type="button"
                  onClick={() => setScope("textil")}
                  className="px-3 py-1.5 min-h-[38px] bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg text-xs whitespace-nowrap shadow-xs transition active:scale-[0.98] inline-flex items-center gap-1.5 self-start sm:self-auto flex-shrink-0"
                >
                  <SparklesIcon className="w-3.5 h-3.5" />
                  <span>Ver Apenas Produção Própria</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ALERTA DE ESTOQUE CRÍTICO (Apenas produtos ativos e com alto giro)         */}
        {/* ========================================================================= */}
        {(() => {
          const lowStockProducts = (data?.products || []).filter(
            (p) =>
              p.is_active !== false && // Apenas produtos ATIVOS e VISÍVEIS na loja
              p.stock_quantity != null &&
              p.stock_quantity <= 8 &&
              p.units_sold >= 2
          );
          if (lowStockProducts.length === 0) return null;

          return (
            <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs mb-8">
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

        {/* ========================================================================= */}
        {/* AS 4 ABAS ESPECIALIZADAS                                                  */}
        {/* ========================================================================= */}
        <nav className="flex border-b border-stone-200 mb-6 gap-1 sm:gap-2 md:gap-3 lg:gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-stone-300 pb-px">
          <button
            onClick={() => setActiveTab("caixa")}
            className={`min-h-[44px] py-2.5 px-2.5 sm:px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition inline-flex items-center gap-1.5 sm:gap-2 active:scale-[0.98] ${
              activeTab === "caixa"
                ? "border-amber-950 text-amber-950 font-bold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <BarChartIcon className="w-4 h-4 flex-shrink-0" />
            <span>Caixa &amp; Canais</span>
          </button>
          <button
            onClick={() => setActiveTab("produtos")}
            className={`min-h-[44px] py-2.5 px-2.5 sm:px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition inline-flex items-center gap-1.5 sm:gap-2 active:scale-[0.98] ${
              activeTab === "produtos"
                ? "border-amber-950 text-amber-950 font-bold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <TagIcon className="w-4 h-4 flex-shrink-0" />
            <span>Produtos</span>
            {data?.products && (
              <span className="text-[11px] sm:text-xs bg-stone-100 text-stone-700 px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
                {data.products.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("pedidos")}
            className={`min-h-[44px] py-2.5 px-2.5 sm:px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition inline-flex items-center gap-1.5 sm:gap-2 active:scale-[0.98] ${
              activeTab === "pedidos"
                ? "border-amber-950 text-amber-950 font-bold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <PackageIcon className="w-4 h-4 flex-shrink-0" />
            <span>Pedidos</span>
            {kpis && (
              <span className="text-[11px] sm:text-xs bg-stone-100 text-stone-700 px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
                {kpis.total_orders}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("anuncios")}
            className={`min-h-[44px] py-2.5 px-2.5 sm:px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition inline-flex items-center gap-1.5 sm:gap-2 active:scale-[0.98] ${
              activeTab === "anuncios"
                ? "border-amber-950 text-amber-950 font-bold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <MegaphoneIcon className="w-4 h-4 flex-shrink-0" />
            <span>Anúncios (Ads)</span>
            {kpis && kpis.total_ad_spend > 0 && (
              <span className="text-[11px] sm:text-xs bg-emerald-100 text-emerald-800 px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
                ROAS {kpis.overall_roas.toFixed(1)}x
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("saude")}
            className={`min-h-[44px] py-2.5 px-2.5 sm:px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition inline-flex items-center gap-1.5 sm:gap-2 active:scale-[0.98] ${
              activeTab === "saude"
                ? "border-amber-950 text-amber-950 font-bold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <ShieldCheckIcon className="w-4 h-4 flex-shrink-0 text-emerald-700" />
            <span>Saúde dos Marketplaces</span>
            <span className="text-[11px] sm:text-xs bg-amber-100 text-amber-900 border border-amber-300 px-1.5 sm:px-2 py-0.5 rounded-full font-bold">
              Diagnóstico
            </span>
          </button>
        </nav>

        {error && (
          <div className="bg-rose-50 border border-rose-300 text-rose-950 p-4 sm:p-5 rounded-2xl mb-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-start gap-3.5">
              <span className="text-2xl flex-shrink-0">⚠️</span>
              <div>
                <h4 className="font-bold text-sm text-rose-950">
                  Instabilidade Temporária na Conexão de Dados
                </h4>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                  {error}
                </p>
                <p className="text-[11px] text-rose-700/80 mt-1">
                  Se o problema persistir, a sincronização será restabelecida automaticamente no próximo ciclo de renovação das credenciais da plataforma.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={loadDashboard}
              className="bg-rose-900 hover:bg-rose-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer self-start sm:self-auto flex-shrink-0 active:scale-[0.98] inline-flex items-center gap-1.5"
            >
              <RefreshIcon className="w-3.5 h-3.5" />
              <span>Tentar Novamente</span>
            </button>
          </div>
        )}

        {data?.tray_warning && (
          <div className="bg-amber-50 border border-amber-300 text-amber-950 p-4 rounded-2xl mb-6 shadow-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-start sm:items-center gap-3 text-xs">
              <span className="text-xl flex-shrink-0">ℹ️</span>
              <div>
                <strong className="font-bold text-amber-950">Aviso da Conexão Tray Commerce:</strong>{" "}
                <span className="text-amber-900">{data.tray_warning}</span>
                <span className="block text-[11px] text-amber-800/80 mt-0.5">
                  Os dados de Catálogo, Produtos e Anúncios (Shopee &amp; Meta Ads) continuam operacionais.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* ABA 1: CAIXA & CANAIS DE VENDA                                            */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === "caixa" && (
          <div className="space-y-6">
            {/* Gráfico de Evolução Diária */}
            {data?.daily_timeline && data.daily_timeline.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h2 className="text-base font-bold text-stone-900">
                      Curva de Faturamento &amp; Lucro Diário
                    </h2>
                    <p className="text-xs text-stone-500">
                      Passe o mouse ou toque nos pontos para ver os valores e pedidos de cada dia (datas no padrão brasileiro DD/MM).
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold self-start sm:self-auto">
                    <span className="flex items-center gap-1.5 text-stone-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-700 inline-block flex-shrink-0" />
                      Faturamento Bruto
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block flex-shrink-0" />
                      Lucro Líquido
                    </span>
                  </div>
                </div>

                <div className="relative w-full overflow-hidden">
                  {(() => {
                    const timeline = data.daily_timeline;
                    const maxVal = Math.max(100, ...timeline.map((d) => d.gross_revenue)) * 1.15;
                    const W = 690;
                    const H = 150;
                    const padX = 75;
                    const padY = 25;

                    const getX = (idx: number) =>
                      timeline.length === 1 ? padX + W / 2 : padX + (idx / (timeline.length - 1)) * W;
                    const getY = (val: number) => padY + H - (Math.max(0, val) / maxVal) * H;

                    const grossCoords: [number, number][] = timeline.map((d, i) => [getX(i), getY(d.gross_revenue)]);
                    const netCoords: [number, number][] = timeline.map((d, i) => [getX(i), getY(d.net_profit)]);

                    const grossLinePath = getBezierCurvePath(grossCoords);
                    const netLinePath = getBezierCurvePath(netCoords);
                    const grossAreaPath = getBezierCurvePath(grossCoords, padY + H);
                    const netAreaPath = getBezierCurvePath(netCoords, padY + H);

                    const activePointIndex = pinnedPointIndex !== null ? pinnedPointIndex : hoveredPointIndex;
                    const isPinned = pinnedPointIndex !== null;

                    return (
                      <div className="relative w-full">
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

                          {/* Linhas de Grade */}
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
                                  className="text-[10px] fill-stone-500 font-mono tabular-nums"
                                >
                                  {money(val)}
                                </text>
                              </g>
                            );
                          })}

                          {/* Áreas Bézier Suaves */}
                          <path d={grossAreaPath} fill="url(#grossGrad)" />
                          <path d={netAreaPath} fill="url(#netGrad)" />

                          {/* Linhas Bézier Suaves (Linear / Stripe Style) */}
                          <path
                            d={grossLinePath}
                            fill="none"
                            stroke="#b45309"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d={netLinePath}
                            fill="none"
                            stroke="#059669"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Pontos */}
                          {timeline.map((d, i) => {
                            const cx = getX(i);
                            const cyGross = getY(d.gross_revenue);
                            const cyNet = getY(d.net_profit);
                            const isPointActive = activePointIndex === i;

                            return (
                              <g
                                key={i}
                                onMouseEnter={() => setHoveredPointIndex(i)}
                                onMouseLeave={() => setHoveredPointIndex(null)}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPinnedPointIndex((prev) => (prev === i ? null : i));
                                }}
                                className="cursor-pointer"
                              >
                                {isPointActive && (
                                  <>
                                    <line
                                      x1={cx}
                                      y1={padY}
                                      x2={cx}
                                      y2={padY + H}
                                      stroke="#78716c"
                                      strokeWidth="1.2"
                                      strokeDasharray="3 3"
                                    />
                                    {/* Halos de Destaque Pulsante */}
                                    <circle
                                      cx={cx}
                                      cy={cyGross}
                                      r={9}
                                      fill="none"
                                      stroke="#b45309"
                                      strokeWidth="2"
                                      opacity="0.45"
                                    />
                                    <circle
                                      cx={cx}
                                      cy={cyNet}
                                      r={9}
                                      fill="none"
                                      stroke="#059669"
                                      strokeWidth="2"
                                      opacity="0.45"
                                    />
                                  </>
                                )}
                                <circle
                                  cx={cx}
                                  cy={cyGross}
                                  r={isPointActive ? 6 : 3.5}
                                  fill="#b45309"
                                  stroke="#ffffff"
                                  strokeWidth="2"
                                />
                                <circle
                                  cx={cx}
                                  cy={cyNet}
                                  r={isPointActive ? 6 : 3.5}
                                  fill="#059669"
                                  stroke="#ffffff"
                                  strokeWidth="2"
                                />
                                <text
                                  x={cx}
                                  y={padY + H + 18}
                                  textAnchor="middle"
                                  className={`text-[10px] font-mono transition-colors ${
                                    isPointActive ? "fill-stone-900 font-bold" : "fill-stone-400"
                                  }`}
                                >
                                  {formatShortDateBR(d.date)}
                                </text>
                              </g>
                            );
                          })}
                        </svg>

                        {/* Tooltip Dinâmico Flutuante (Não Empurra o Layout) */}
                        {activePointIndex != null && timeline[activePointIndex] && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute top-2 sm:top-3 right-2 sm:right-4 z-20 p-3 bg-stone-900/95 backdrop-blur-md text-white rounded-xl shadow-2xl border border-stone-700/70 text-xs max-w-[280px] sm:max-w-xs select-none pointer-events-auto transition-all"
                          >
                            <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-stone-800">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-stone-400 font-mono">
                                  {formatFullDateBR(timeline[activePointIndex].date)}
                                </span>
                                {isPinned ? (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    📌 Fixado
                                  </span>
                                ) : (
                                  <span className="text-[9px] text-stone-500">
                                    (clique p/ fixar)
                                  </span>
                                )}
                              </div>
                              {isPinned && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPinnedPointIndex(null);
                                  }}
                                  className="text-stone-400 hover:text-white p-0.5 rounded hover:bg-stone-800 transition text-[11px] leading-none"
                                  title="Desafixar"
                                >
                                  ✕
                                </button>
                              )}
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-stone-400 text-[11px]">Pedidos:</span>
                                <span className="font-semibold text-amber-200 tabular-nums">
                                  {timeline[activePointIndex].orders_count} {timeline[activePointIndex].orders_count === 1 ? "pedido" : "pedidos"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-stone-400 text-[11px]">Faturamento:</span>
                                <strong className="text-white tabular-nums">
                                  {money(timeline[activePointIndex].gross_revenue)}
                                </strong>
                              </div>
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-stone-400 text-[11px]">Lucro Real:</span>
                                <strong className="text-emerald-300 font-bold tabular-nums">
                                  {money(timeline[activePointIndex].net_profit)}
                                </strong>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Gráfico de Barras Unificado: Evolução Mensal de Faturamento & Vendas */}
            {data?.monthly_history && data.monthly_history.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs relative">
                {(() => {
                  const rawHistory = data.monthly_history;
                  const now = new Date();
                  const currentDay = now.getDate();
                  const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

                  // Recalcular métricas de acordo com o canal selecionado
                  const history = rawHistory.map((m, idx) => {
                    const channelKey = selectedMonthlyChannel;
                    const rev = channelKey === "all" ? m.gross_revenue : (m.by_channel[channelKey] || 0);

                    // MoM baseado no canal selecionado
                    let mom: number | null = null;
                    if (idx > 0) {
                      const prevM = rawHistory[idx - 1];
                      const prevRev = channelKey === "all" ? prevM.gross_revenue : (prevM.by_channel[channelKey] || 0);
                      if (prevRev > 0) {
                        mom = ((rev - prevRev) / prevRev) * 100;
                      } else if (rev > 0) {
                        mom = 100;
                      }
                    }

                    // Projeção do mês atual baseada no canal selecionado
                    let proj: number | undefined = undefined;
                    if (m.is_current_month && currentDay > 0 && rev > 0) {
                      proj = (rev / currentDay) * daysInCurrentMonth;
                    }

                    return {
                      ...m,
                      displayRevenue: rev,
                      displayMoM: mom,
                      displayProj: proj,
                    };
                  });

                  const maxRevenue = Math.max(
                    100,
                    ...history.map((m) => Math.max(m.displayRevenue, m.displayProj || 0))
                  ) * 1.12;

                  const totalFilteredRevenue = history.reduce((acc, m) => acc + m.displayRevenue, 0);
                  const totalFilteredOrders = rawHistory.reduce((acc, m) => acc + m.orders_count, 0);
                  const recordMonth = [...history].sort((a, b) => b.displayRevenue - a.displayRevenue)[0];

                  const activeMonthIdx = pinnedMonthIndex !== null ? pinnedMonthIndex : hoveredMonthIndex;
                  const activeMonth = activeMonthIdx !== null ? history[activeMonthIdx] : null;

                  // Cores e rótulos para cada canal
                  const channelPills: Array<{ key: MonthlyChannelFilter; label: string; activeCls: string; dotCls: string }> = [
                    { key: "all", label: "Todos os Canais", activeCls: "bg-amber-950 text-white border-amber-950 shadow-xs", dotCls: "bg-amber-400" },
                    { key: "shopee", label: "Shopee", activeCls: "bg-orange-600 text-white border-orange-600 shadow-xs", dotCls: "bg-white" },
                    { key: "mercado_livre", label: "Mercado Livre", activeCls: "bg-amber-400 text-stone-900 border-amber-400 font-bold shadow-xs", dotCls: "bg-stone-900" },
                    { key: "site", label: "Loja Virtual", activeCls: "bg-sky-600 text-white border-sky-600 shadow-xs", dotCls: "bg-white" },
                    { key: "tiktok", label: "TikTok Shop", activeCls: "bg-zinc-900 text-white border-zinc-900 shadow-xs", dotCls: "bg-cyan-400" },
                  ];

                  return (
                    <div>
                      {/* Cabeçalho da Seção */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                              <span>Evolução Mensal de Faturamento &amp; Vendas</span>
                            </h2>
                            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wide">
                              Série Histórica
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 mt-1">
                            Acompanhe o faturamento consolidado mês a mês (MoM), ritmo de crescimento e ticket médio em todos os canais de venda.
                          </p>
                        </div>

                        {/* Totais do Topo */}
                        <div className="flex items-center gap-3 flex-wrap self-start lg:self-auto text-xs">
                          <div className="bg-stone-50 border border-stone-200/90 px-3.5 py-2 rounded-xl shadow-2xs">
                            <span className="text-[10px] text-stone-500 uppercase font-bold block tracking-wider">Total Acumulado</span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                              <strong className="text-stone-900 font-extrabold text-sm tabular-nums">{money(totalFilteredRevenue)}</strong>
                              <span className="text-[10px] text-stone-500 font-medium">({totalFilteredOrders} pedidos)</span>
                            </div>
                          </div>

                          {recordMonth && recordMonth.displayRevenue > 0 && (
                            <div className="bg-amber-50/70 border border-amber-300/80 px-3.5 py-2 rounded-xl shadow-2xs">
                              <span className="text-[10px] text-amber-900 uppercase font-bold block tracking-wider flex items-center gap-1">
                                <span>👑</span>
                                <span>Mês Recorde</span>
                              </span>
                              <div className="flex items-baseline gap-1.5 mt-0.5">
                                <strong className="text-amber-950 font-extrabold text-sm tabular-nums">
                                  {recordMonth.label}: {money(recordMonth.displayRevenue)}
                                </strong>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Seletor de Filtro de Canais */}
                      <div className="flex items-center gap-2 mb-6 flex-wrap pb-3 border-b border-stone-100">
                        <span className="text-xs font-bold text-stone-700 mr-1 flex items-center gap-1">
                          <span>Filtrar Canal:</span>
                        </span>
                        {channelPills.map((pill) => (
                          <button
                            key={pill.key}
                            type="button"
                            onClick={() => setSelectedMonthlyChannel(pill.key)}
                            className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium flex items-center gap-1.5 select-none active:scale-[0.98] ${
                              selectedMonthlyChannel === pill.key
                                ? pill.activeCls
                                : "bg-stone-50/70 hover:bg-stone-100 text-stone-600 border-stone-200 hover:border-stone-300"
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedMonthlyChannel === pill.key ? pill.dotCls : "bg-stone-300"}`} />
                            <span>{pill.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Área do Gráfico Unificado com Eixo Y e Linhas de Grade */}
                      <div className="relative pt-6 pb-2">
                        {/* Linhas de Grade e Eixo Y */}
                        <div className="absolute inset-0 top-6 bottom-14 flex flex-col justify-between pointer-events-none z-0">
                          {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
                            <div key={ratio} className="w-full flex items-center gap-2">
                              <span className="text-[10px] text-stone-400 font-mono w-16 text-right tabular-nums flex-shrink-0 select-none">
                                {money(maxRevenue * ratio)}
                              </span>
                              <div className={`w-full border-b ${ratio === 0 ? "border-stone-300 border-b-2" : "border-stone-100 border-dashed"}`} />
                            </div>
                          ))}
                        </div>

                        {/* Colunas dos Meses (Container com Scroll Horizontal Suave para infinitos meses futuros) */}
                        <div className="relative z-10 pl-20 overflow-x-auto pb-4 scrollbar-thin">
                          <div className="flex items-end justify-around gap-6 sm:gap-10 min-w-[540px] h-64 pt-8">
                            {history.map((m, idx) => {
                              const rev = m.displayRevenue;
                              const heightPct = Math.max(8, Math.min(100, Math.round((rev / maxRevenue) * 100)));
                              const projHeightPct = m.displayProj
                                ? Math.max(8, Math.min(100, Math.round((m.displayProj / maxRevenue) * 100)))
                                : 0;

                              const isRecord = recordMonth?.month === m.month && rev > 0;
                              const isHovered = activeMonthIdx === idx;

                              // Percentuais de canais
                              const shopeeVal = m.by_channel.shopee || 0;
                              const mlVal = m.by_channel.mercado_livre || 0;
                              const siteVal = m.by_channel.site || 0;
                              const tiktokVal = m.by_channel.tiktok || 0;

                              const shopeePct = rev > 0 ? (shopeeVal / rev) * 100 : 0;
                              const mlPct = rev > 0 ? (mlVal / rev) * 100 : 0;
                              const sitePct = rev > 0 ? (siteVal / rev) * 100 : 0;
                              const tiktokPct = rev > 0 ? (tiktokVal / rev) * 100 : 0;

                              return (
                                <div
                                  key={m.month}
                                  onMouseEnter={() => setHoveredMonthIndex(idx)}
                                  onMouseLeave={() => setHoveredMonthIndex(null)}
                                  onClick={() => setPinnedMonthIndex((prev) => (prev === idx ? null : idx))}
                                  className={`flex-1 max-w-[110px] min-w-[76px] flex flex-col items-center justify-end h-full cursor-pointer group transition-all duration-150 select-none ${
                                    isHovered ? "scale-[1.03]" : ""
                                  }`}
                                >
                                  {/* Badge de Destaque / Variação MoM no topo da barra */}
                                  <div className="flex flex-col items-center gap-1 mb-2 text-center pointer-events-none">
                                    {isRecord && (
                                      <span className="text-[10px] font-black text-amber-900 bg-amber-200/90 border border-amber-300 px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                                        <span>👑</span>
                                        <span>Recorde</span>
                                      </span>
                                    )}

                                    {m.displayMoM !== null && m.displayMoM !== undefined ? (
                                      <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs ${
                                          m.displayMoM >= 0
                                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                            : "bg-rose-100 text-rose-800 border border-rose-200"
                                        }`}
                                      >
                                        <span>{m.displayMoM >= 0 ? "▲" : "▼"}</span>
                                        <span>{Math.abs(m.displayMoM).toFixed(1)}%</span>
                                        <span className="text-[8px] opacity-75 font-normal">MoM</span>
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-stone-400 font-medium px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200">
                                        Base
                                      </span>
                                    )}

                                    <div className={`text-xs font-black tabular-nums transition-colors ${
                                      isHovered ? "text-amber-950 scale-105" : "text-stone-800"
                                    }`}>
                                      {money(rev)}
                                    </div>
                                  </div>

                                  {/* Barra com Altura Proporcional */}
                                  <div className="w-full flex justify-center items-end relative h-44">
                                    {/* Projeção tracejada se for o mês corrente */}
                                    {m.is_current_month && m.displayProj && m.displayProj > rev && (
                                      <div
                                        style={{ height: `${projHeightPct}%` }}
                                        className="absolute w-12 sm:w-16 rounded-t-xl border-2 border-dashed border-amber-500 bg-amber-100/30 transition-all pointer-events-none"
                                        title={`Projeção linear de fechamento: ${money(m.displayProj)}`}
                                      />
                                    )}

                                    {/* Barra Principal */}
                                    <div
                                      style={{ height: `${heightPct}%` }}
                                      className={`w-12 sm:w-16 rounded-t-xl overflow-hidden flex flex-col justify-end transition-all duration-200 relative shadow-sm ${
                                        isHovered
                                          ? "ring-3 ring-amber-500 shadow-md brightness-105"
                                          : m.is_current_month
                                          ? "ring-2 ring-amber-400/80"
                                          : "hover:brightness-105"
                                      }`}
                                    >
                                      {selectedMonthlyChannel === "all" ? (
                                        <>
                                          {/* Segmento Loja Virtual (Azul) */}
                                          {sitePct > 0 && (
                                            <div
                                              style={{ height: `${sitePct}%` }}
                                              className="w-full bg-sky-600 transition-all"
                                              title={`Loja Virtual: ${money(siteVal)}`}
                                            />
                                          )}
                                          {/* Segmento Mercado Livre (Amarelo) */}
                                          {mlPct > 0 && (
                                            <div
                                              style={{ height: `${mlPct}%` }}
                                              className="w-full bg-amber-400 transition-all"
                                              title={`Mercado Livre: ${money(mlVal)}`}
                                            />
                                          )}
                                          {/* Segmento TikTok Shop (Preto) */}
                                          {tiktokPct > 0 && (
                                            <div
                                              style={{ height: `${tiktokPct}%` }}
                                              className="w-full bg-zinc-950 transition-all"
                                              title={`TikTok Shop: ${money(tiktokVal)}`}
                                            />
                                          )}
                                          {/* Segmento Shopee (Laranja) */}
                                          {shopeePct > 0 && (
                                            <div
                                              style={{ height: `${shopeePct}%` }}
                                              className="w-full bg-orange-600 transition-all"
                                              title={`Shopee: ${money(shopeeVal)}`}
                                            />
                                          )}
                                        </>
                                      ) : (
                                        <div
                                          className={`w-full h-full transition-all ${
                                            selectedMonthlyChannel === "shopee"
                                              ? "bg-gradient-to-t from-orange-700 to-orange-500"
                                              : selectedMonthlyChannel === "mercado_livre"
                                              ? "bg-gradient-to-t from-amber-500 to-amber-300"
                                              : selectedMonthlyChannel === "site"
                                              ? "bg-gradient-to-t from-sky-700 to-sky-500"
                                              : "bg-gradient-to-t from-zinc-950 to-zinc-800"
                                          }`}
                                        />
                                      )}
                                    </div>
                                  </div>

                                  {/* Rótulo Inferior do Mês e Métricas */}
                                  <div className="text-center mt-3 pt-2 border-t border-stone-200/80 w-full">
                                    <div className="flex items-center justify-center gap-1">
                                      <strong className={`text-xs font-bold transition-colors ${
                                        isHovered ? "text-amber-950" : "text-stone-800"
                                      }`}>
                                        {m.label}
                                      </strong>
                                      {m.is_current_month && (
                                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" title="Mês em andamento" />
                                      )}
                                    </div>
                                    <div className="text-[10px] text-stone-500 mt-0.5 tabular-nums">
                                      {m.orders_count} ped.
                                    </div>
                                    <div className="text-[10px] text-stone-400 tabular-nums">
                                      Méd: {money(m.average_ticket)}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Tooltip / Janela Flutuante Flutuando sobre o Gráfico */}
                        {activeMonth && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute top-2 right-4 sm:right-8 z-30 p-4 bg-stone-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-stone-700/80 text-xs w-72 max-w-[90vw] animate-in fade-in duration-150 select-none pointer-events-auto"
                          >
                            <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">📅</span>
                                <div>
                                  <strong className="text-stone-100 font-bold block leading-tight">
                                    {activeMonth.full_label}
                                  </strong>
                                  <span className="text-[10px] text-stone-400">
                                    {activeMonth.is_current_month ? "Mês Atual (Em andamento)" : "Mês Fechado / Consolidado"}
                                  </span>
                                </div>
                              </div>
                              {pinnedMonthIndex !== null && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPinnedMonthIndex(null);
                                  }}
                                  className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 text-[11px]"
                                  title="Desafixar"
                                >
                                  ✕
                                </button>
                              )}
                            </div>

                            {/* Faturamento e Comparativo */}
                            <div className="space-y-1.5 pb-2.5 mb-2.5 border-b border-stone-800/80">
                              <div className="flex items-center justify-between">
                                <span className="text-stone-400 text-[11px]">Faturamento Bruto:</span>
                                <strong className="text-amber-300 text-sm font-extrabold tabular-nums">
                                  {money(activeMonth.gross_revenue)}
                                </strong>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-stone-400 text-[11px]">Variação MoM:</span>
                                <span className={`font-bold text-[11px] tabular-nums ${
                                  (activeMonth.growth_percent || 0) >= 0 ? "text-emerald-400" : "text-rose-400"
                                }`}>
                                  {activeMonth.growth_percent !== null && activeMonth.growth_percent !== undefined
                                    ? `${activeMonth.growth_percent >= 0 ? "+" : ""}${activeMonth.growth_percent.toFixed(1)}% vs anterior`
                                    : "Mês inicial"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-stone-400">Volume de Pedidos:</span>
                                <span className="text-stone-200 font-medium tabular-nums">
                                  {activeMonth.orders_count} pedidos ({money(activeMonth.average_ticket)}/médio)
                                </span>
                              </div>
                              {activeMonth.is_current_month && activeMonth.projected_revenue && (
                                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-800/60 text-amber-300">
                                  <span>Projeção (Ritmo Atual):</span>
                                  <strong className="font-extrabold tabular-nums">
                                    {money(activeMonth.projected_revenue)}
                                  </strong>
                                </div>
                              )}
                            </div>

                            {/* Decomposição Exata por Canal (4 Canais) */}
                            <div>
                              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-1.5">
                                Participação por Canal:
                              </span>
                              <div className="space-y-1 text-[11px]">
                                {[
                                  { label: "Shopee", val: activeMonth.by_channel.shopee || 0, color: "bg-orange-600", dot: "bg-orange-500" },
                                  { label: "Loja Virtual", val: activeMonth.by_channel.site || 0, color: "bg-sky-600", dot: "bg-sky-400" },
                                  { label: "Mercado Livre", val: activeMonth.by_channel.mercado_livre || 0, color: "bg-amber-400", dot: "bg-amber-400" },
                                  { label: "TikTok Shop", val: activeMonth.by_channel.tiktok || 0, color: "bg-zinc-700", dot: "bg-zinc-400" },
                                ].map((item) => {
                                  const pct = activeMonth.gross_revenue > 0 ? (item.val / activeMonth.gross_revenue) * 100 : 0;
                                  return (
                                    <div key={item.label} className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dot}`} />
                                        <span className="text-stone-300 truncate">{item.label}:</span>
                                      </div>
                                      <div className="text-right tabular-nums whitespace-nowrap flex-shrink-0">
                                        <strong className="text-stone-100">{money(item.val)}</strong>
                                        <span className="text-[10px] text-stone-400 ml-1">({pct.toFixed(1)}%)</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Legenda dos 4 Canais da Barra */}
                      <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-500">
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="font-semibold text-stone-700">Composição da Barra:</span>
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm bg-orange-600 flex-shrink-0" />
                            <span>Shopee</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 flex-shrink-0" />
                            <span>Mercado Livre</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm bg-sky-600 flex-shrink-0" />
                            <span>Loja Virtual</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm bg-zinc-950 flex-shrink-0" />
                            <span>TikTok Shop</span>
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-400 italic">
                          * Passe o mouse ou toque nas barras para abrir o detalhamento. Novembro exibe projeção linear tracejada.
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Comparativo dos 4 Canais de Venda */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
              <h2 className="text-base font-bold text-stone-900 mb-1">
                Desempenho por Canal de Venda
              </h2>
              <p className="text-xs text-stone-500 mb-4">
                Veja onde você mais vendeu, quanto cada canal cobrou de taxa e qual foi o mais rentável.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data?.channels.map((ch) => {
                  const cfg = CHANNEL_CONFIG[ch.channel];
                  const Icon = cfg.Icon;
                  return (
                    <div
                      key={ch.channel}
                      className="border border-stone-200 rounded-xl p-4 bg-stone-50/50 hover:bg-stone-50 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${cfg.bg}`}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span>{cfg.label}</span>
                          </span>
                          <span className="text-xs font-medium text-stone-500">
                            {ch.orders_count} {ch.orders_count === 1 ? "pedido" : "pedidos"}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs text-stone-600">
                          <div className="flex justify-between items-center">
                            <span>Vendido:</span>
                            <strong className="text-stone-900 tabular-nums whitespace-nowrap">{money(ch.gross_revenue)}</strong>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Tecido &amp; Fábrica:</span>
                            <span className="tabular-nums whitespace-nowrap text-stone-700 font-medium">-{money(ch.product_cost)}</span>
                          </div>
                          {(() => {
                            const chRate = ch.gross_revenue > 0 ? (ch.commissions / ch.gross_revenue) * 100 : 0;
                            return (
                              <div className="flex justify-between items-center text-orange-700 font-medium">
                                <span className="whitespace-nowrap">Taxa do Canal ({percent(chRate)}):</span>
                                <span className="tabular-nums whitespace-nowrap">-{money(ch.commissions)}</span>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-stone-200 flex justify-between items-center text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-stone-400 block whitespace-nowrap">
                            Lucro Líquido
                          </span>
                          <strong className={`${ch.net_profit < 0 ? "text-rose-700" : "text-emerald-700"} font-bold text-sm tabular-nums whitespace-nowrap`}>
                            {money(ch.net_profit)}
                          </strong>
                        </div>
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[11px] tabular-nums whitespace-nowrap ${
                            ch.net_margin_percent >= 30
                              ? "bg-emerald-100 text-emerald-800"
                              : ch.net_margin_percent >= 15
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {percent(ch.net_margin_percent)} margem
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Barra de Participação de Mercado */}
            {data?.channels && data.channels.length > 0 && (() => {
              const totalChannelsRevenue = data.channels.reduce((sum, ch) => sum + (ch.gross_revenue || 0), 0);
              if (totalChannelsRevenue <= 0) return null;
              return (
                <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                        Participação das Vendas por Canal (Market Share)
                      </h3>
                    </div>
                    <span className="text-xs text-stone-500 font-mono font-medium">
                      {kpis?.total_orders || 0} pedidos
                    </span>
                  </div>

                  <div className="h-4 rounded-full overflow-hidden flex bg-stone-100 shadow-inner w-full">
                    {data.channels.map((ch) => {
                      const pct = (ch.gross_revenue / totalChannelsRevenue) * 100;
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
                      const pct = (ch.gross_revenue / totalChannelsRevenue) * 100;
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
              );
            })()}
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* ABA 2: PRODUTOS MAIS LUCRATIVOS                                           */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === "produtos" && (
          <div className="space-y-6">
            {/* Top 3 Campeões de Lucro (Sincronizado dinamicamente com Toda Série Histórica e ordenado por lucro limpo) */}
            {(() => {
              const baseList = showAllTimeProducts
                ? (data?.all_time_products || [])
                : (data?.products || []);

              const validProfitProducts = baseList
                .filter((p) => !p.has_missing_cost && p.total_cost > 0)
                .sort((a, b) => b.net_profit - a.net_profit);

              const champions = validProfitProducts.slice(0, 3);
              if (champions.length === 0) return null;

              return (
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">🏆</span>
                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-wider text-amber-900">
                        Campeões de Lucro Limpo no Bolso
                      </h3>
                      <p className="text-xs text-stone-500">
                        {showAllTimeProducts
                          ? "Os 3 produtos que mais colocaram dinheiro líquido no caixa da loja em toda a série histórica."
                          : "Os 3 produtos que mais colocaram dinheiro líquido no caixa da loja no período."}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {champions.map((p, pIdx) => (
                      <div
                        key={p.sku || pIdx}
                        className="bg-stone-50 hover:bg-stone-100/80 rounded-xl p-3 border border-stone-200/80 flex items-center gap-3 transition"
                      >
                        <div className="w-12 h-12 rounded-lg bg-white border border-stone-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>🖼️</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-stone-900 line-clamp-1">
                            {p.name.replace(/<br\s*\/?>/gi, " - ")}
                          </div>
                          <div className="text-[11px] text-stone-500 mt-0.5">
                            {p.units_sold} {p.name.toLowerCase().includes("kit") ? "kits vendidos" : "un vendidas"}
                          </div>
                          <div className={`text-xs font-extrabold ${p.net_profit < 0 ? "text-rose-700" : "text-emerald-700"} mt-1`}>
                            Lucro: {money(p.net_profit)} ({percent(p.net_margin_percent)})
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Tabela de Produtos */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-stone-900">
                      Todos os Produtos Vendidos &amp; Lucratividade
                    </h2>
                    {showAllTimeProducts && (
                      <span className="text-[10px] bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                        <ClockIcon className="w-3 h-3 text-amber-900" />
                        Histórico Completo (Desde Ago/2026)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500">
                    {showAllTimeProducts
                      ? "Exibindo o ranking acumulado de todos os produtos vendidos em toda a série histórica da loja."
                      : "Clique em qualquer produto para ver o detalhamento unitário de custo, taxa e lucro por peça."}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {/* Botão Discreto: Toda Série Histórica */}
                  <button
                    type="button"
                    onClick={() => setShowAllTimeProducts((prev) => !prev)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition cursor-pointer select-none shrink-0 ${
                      showAllTimeProducts
                        ? "bg-amber-950 text-white border-amber-950 shadow-xs"
                        : "bg-stone-50 text-stone-700 hover:text-stone-900 hover:bg-stone-100/80 border-stone-300"
                    }`}
                    title={
                      showAllTimeProducts
                        ? "Mostrando toda a série histórica da loja. Clique para voltar ao período selecionado."
                        : "Clique para mostrar os produtos mais vendidos em toda a série histórica da empresa (desde Ago/2026)"
                    }
                  >
                    <ClockIcon className="w-3.5 h-3.5" />
                    <span>{showAllTimeProducts ? "Toda Série Histórica" : "Série Histórica"}</span>
                    {showAllTimeProducts && (
                      <span className="text-[10px] bg-amber-800 text-amber-100 px-1.5 py-0.2 rounded-full font-mono ml-0.5">
                        All
                      </span>
                    )}
                  </button>

                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Buscar produto ou SKU..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="text-xs border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-950 w-full min-h-[38px]"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none flex items-center justify-center">
                      <SearchIcon className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm min-w-[980px]">
                  <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200 uppercase text-[11px] tracking-wider whitespace-nowrap">
                    <tr>
                      <th
                        onClick={() => handleProductSort("name")}
                        className="py-3 px-3.5 min-w-[200px] cursor-pointer hover:bg-stone-100 transition select-none"
                        title="Clique para ordenar por Nome do Produto"
                      >
                        <div className="inline-flex items-center gap-1">
                          <span>Produto</span>
                          <span className="text-[10px] text-stone-400">
                            {productSortField === "name" ? (productSortAsc ? "▲" : "▼") : "↕"}
                          </span>
                        </div>
                      </th>
                      <th
                        onClick={() => handleProductSort("channel")}
                        className="py-3 px-2.5 whitespace-nowrap min-w-[85px] cursor-pointer hover:bg-stone-100 transition select-none"
                        title="Clique para ordenar por Canal de Venda"
                      >
                        <div className="inline-flex items-center gap-1">
                          <span>Canal</span>
                          <span className="text-[10px] text-stone-400">
                            {productSortField === "channel" ? (productSortAsc ? "▲" : "▼") : "↕"}
                          </span>
                        </div>
                      </th>
                      <th
                        onClick={() => handleProductSort("units")}
                        className="py-3 px-2.5 text-center whitespace-nowrap min-w-[70px] cursor-pointer hover:bg-stone-100 transition select-none"
                        title="Clique para ordenar por Quantidade Vendida"
                      >
                        <div className="inline-flex items-center gap-1 justify-center">
                          <span>Qtd</span>
                          <span className="text-[10px] text-stone-400">
                            {productSortField === "units" ? (productSortAsc ? "▲" : "▼") : "↕"}
                          </span>
                        </div>
                      </th>
                      <th
                        onClick={() => handleProductSort("revenue")}
                        className="py-3 px-3 text-right whitespace-nowrap min-w-[95px] cursor-pointer hover:bg-stone-100 transition select-none"
                        title="Clique para ordenar por Faturamento Bruto"
                      >
                        <div className="inline-flex items-center gap-1 justify-end">
                          <span>Faturamento</span>
                          <span className="text-[10px] text-stone-400">
                            {productSortField === "revenue" ? (productSortAsc ? "▲" : "▼") : "↕"}
                          </span>
                        </div>
                      </th>
                      <th
                        onClick={() => handleProductSort("cost")}
                        className="py-3 px-3 text-right whitespace-nowrap min-w-[105px] cursor-pointer hover:bg-stone-100 transition select-none"
                        title="Clique para ordenar por Custo de Fábrica (CMV)"
                      >
                        <div className="inline-flex items-center gap-1 justify-end">
                          <span>Fábrica (CMV)</span>
                          <span className="text-[10px] text-stone-400">
                            {productSortField === "cost" ? (productSortAsc ? "▲" : "▼") : "↕"}
                          </span>
                        </div>
                      </th>
                      <th
                        onClick={() => handleProductSort("commissions")}
                        className="py-3 px-3 text-right whitespace-nowrap min-w-[95px] cursor-pointer hover:bg-stone-100 transition select-none"
                        title="Clique para ordenar por Taxas do Canal"
                      >
                        <div className="inline-flex items-center gap-1 justify-end">
                          <span>Taxa Canal</span>
                          <span className="text-[10px] text-stone-400">
                            {productSortField === "commissions" ? (productSortAsc ? "▲" : "▼") : "↕"}
                          </span>
                        </div>
                      </th>
                      <th
                        onClick={() => handleProductSort("profit")}
                        className="py-3 px-3.5 text-right whitespace-nowrap min-w-[95px] cursor-pointer hover:bg-stone-100 transition select-none"
                        title="Clique para ordenar por Lucro Limpo"
                      >
                        <div className="inline-flex items-center gap-1 justify-end">
                          <span>Lucro Limpo</span>
                          <span className="text-[10px] text-stone-400">
                            {productSortField === "profit" ? (productSortAsc ? "▲" : "▼") : "↕"}
                          </span>
                        </div>
                      </th>
                      <th
                        onClick={() => handleProductSort("margin")}
                        className="py-3 px-3 text-right whitespace-nowrap min-w-[65px] cursor-pointer hover:bg-stone-100 transition select-none"
                        title="Clique para ordenar por Margem Líquida"
                      >
                        <div className="inline-flex items-center gap-1 justify-end">
                          <span>Margem</span>
                          <span className="text-[10px] text-stone-400">
                            {productSortField === "margin" ? (productSortAsc ? "▲" : "▼") : "↕"}
                          </span>
                        </div>
                      </th>
                      <th className="py-3 px-2.5 text-center whitespace-nowrap min-w-[44px]">Detalhes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {(() => {
                      const baseList = showAllTimeProducts
                        ? (data?.all_time_products || [])
                        : (data?.products || []);

                      const list = baseList.filter((p) => {
                        if (!productSearch) return true;
                        const q = productSearch.toLowerCase().trim();
                        return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
                      });

                      const sortedList = [...list].sort((a, b) => {
                        let comparison = 0;
                        switch (productSortField) {
                          case "name":
                            comparison = a.name.localeCompare(b.name, "pt-BR");
                            break;
                          case "channel":
                            comparison = a.main_channel.localeCompare(b.main_channel, "pt-BR");
                            break;
                          case "units":
                            comparison = a.units_sold - b.units_sold;
                            break;
                          case "revenue":
                            comparison = a.total_revenue - b.total_revenue;
                            break;
                          case "cost":
                            comparison = a.total_cost - b.total_cost;
                            break;
                          case "commissions":
                            comparison = a.total_commissions - b.total_commissions;
                            break;
                          case "profit":
                            if (a.has_missing_cost && !b.has_missing_cost) return 1;
                            if (!a.has_missing_cost && b.has_missing_cost) return -1;
                            comparison = a.net_profit - b.net_profit;
                            break;
                          case "margin":
                            if (a.has_missing_cost && !b.has_missing_cost) return 1;
                            if (!a.has_missing_cost && b.has_missing_cost) return -1;
                            comparison = a.net_margin_percent - b.net_margin_percent;
                            break;
                        }
                        return productSortAsc ? comparison : -comparison;
                      });

                      if (sortedList.length === 0) {
                        return (
                          <tr>
                            <td colSpan={9} className="py-8 text-center text-stone-400 text-xs">
                              {productSearch
                                ? `Nenhum produto encontrado para "${productSearch}".`
                                : showAllTimeProducts
                                ? "Nenhum produto encontrado na série histórica."
                                : "Nenhum produto vendido no período selecionado."}
                            </td>
                          </tr>
                        );
                      }

                      return sortedList.map((p, idx) => {
                        const channelKey = getChannelKey(p.main_channel);
                        const cfg = CHANNEL_CONFIG[channelKey];
                        const Icon = cfg.Icon;
                        const isExpanded = !!expandedProductSkus[p.sku];
                        const unitAvgPrice = p.units_sold > 0 ? p.total_revenue / p.units_sold : 0;
                        const unitCost = p.units_sold > 0 ? p.total_cost / p.units_sold : 0;
                        const unitCommission = p.units_sold > 0 ? p.total_commissions / p.units_sold : 0;
                        const unitProfit = p.units_sold > 0 ? p.net_profit / p.units_sold : 0;
                        const nameLower = (p.name || "").toLowerCase();
                        const isKit = nameLower.includes("kit");
                        const packMatch = nameLower.match(/kit\s*(\d+)/i) || nameLower.match(/(\d+)\s*(?:peças|unidades|un|pcs)/i);
                        let packSize = packMatch ? Number(packMatch[1]) : (nameLower.includes("par") ? 2 : 1);
                        const hasLA = nameLower.includes("lugar americano") || nameLower.includes("jogo americano") || (p.sku || "").toUpperCase().includes("LAM");
                        const hasGUA = nameLower.includes("guardanapo") || (p.sku || "").toUpperCase().includes("GUA");
                        const hasPGU = nameLower.includes("porta") || (p.sku || "").toUpperCase().includes("PGU");
                        if (hasLA && hasGUA && hasPGU && packSize === 1) {
                          if (nameLower.includes("2 lugares") || nameLower.includes("2lugares") || nameLower.includes("6 peças")) {
                            packSize = 6;
                          } else {
                            packSize = 3;
                          }
                        }

                        return (
                          <Fragment key={p.sku || idx}>
                            <tr
                              onClick={() => {
                                if (typeof window !== "undefined" && window.getSelection()?.toString().trim().length) return;
                                toggleProductExpanded(p.sku);
                              }}
                              className={`transition cursor-pointer ${
                                isExpanded ? "bg-amber-50/50" : "hover:bg-stone-50/80"
                              }`}
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
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
                                      REF: {p.sku} {p.is_own_production ? "· Confecção Própria" : "· Revenda"}
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
                              <td className="py-3 px-2.5 text-center whitespace-nowrap min-w-[70px]">
                                <div className="whitespace-nowrap">
                                  <span className="font-bold text-stone-900 block whitespace-nowrap">
                                    {isKit ? `${p.units_sold} kits` : `${p.units_sold} un`}
                                  </span>
                                  {isKit && packSize > 1 && (
                                    <span className="text-[10px] text-stone-400 block whitespace-nowrap">
                                      ({p.units_sold * packSize} peças)
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-3 text-right font-medium text-stone-900 whitespace-nowrap tabular-nums min-w-[95px]">
                                {money(p.total_revenue)}
                              </td>
                              <td className="py-3 px-3 text-right text-stone-500 font-medium whitespace-nowrap min-w-[105px]">
                                {p.has_missing_cost || (unitCost === 0 && !p.is_own_production) ? (
                                  <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                                    Sem custo
                                  </span>
                                ) : (
                                  <>
                                    <div className="tabular-nums whitespace-nowrap font-semibold text-stone-700">-{money(p.total_cost)}</div>
                                    {p.units_sold > 0 && unitCost > 0 && (
                                      <div className="text-[10px] text-stone-500 font-mono tabular-nums whitespace-nowrap">
                                        {isKit && packSize > 1 ? (
                                          <>
                                            <span className="font-medium text-stone-600">(-{money(unitCost)}/kit</span>
                                            <span className="text-stone-400"> · {money(unitCost / packSize)}/peça)</span>
                                          </>
                                        ) : (
                                          <span>(-{money(unitCost)}/un)</span>
                                        )}
                                      </div>
                                    )}
                                  </>
                                )}
                              </td>
                              <td className="py-3 px-3 text-right font-medium text-orange-700 whitespace-nowrap min-w-[95px]">
                                <div className="tabular-nums whitespace-nowrap font-semibold">-{money(p.total_commissions)}</div>
                                {p.total_revenue > 0 && (
                                  <div className="text-[10px] text-orange-600/80 font-mono tabular-nums whitespace-nowrap">
                                    ({percent((p.total_commissions / p.total_revenue) * 100)})
                                  </div>
                                )}
                              </td>
                              <td className={`py-3 px-3.5 text-right font-bold whitespace-nowrap tabular-nums min-w-[95px] ${
                                p.has_missing_cost ? "text-stone-400" : p.net_profit < 0 ? "text-rose-700" : "text-emerald-700"
                              }`}>
                                {p.has_missing_cost ? (
                                  <div>
                                    <span className="text-stone-400 font-bold">—</span>
                                    <span className="block text-[9px] font-normal text-amber-700">Requer custo</span>
                                  </div>
                                ) : (
                                  <>
                                    <div>{money(p.net_profit)}</div>
                                    {p.units_sold > 0 && (
                                      <div className="text-[10px] font-mono font-normal text-stone-500 whitespace-nowrap">
                                        {isKit && packSize > 1 ? (
                                          <>
                                            <span className="text-emerald-700 font-medium">+{money(unitProfit)}/kit</span>
                                            <span className="text-stone-400"> · +{money(unitProfit / packSize)}/pç</span>
                                          </>
                                        ) : (
                                          <span>+{money(unitProfit)}/un</span>
                                        )}
                                      </div>
                                    )}
                                  </>
                                )}
                              </td>
                              <td className="py-3 px-3 text-right whitespace-nowrap min-w-[65px]">
                                {p.has_missing_cost ? (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-stone-200 bg-stone-50 text-stone-400 whitespace-nowrap">
                                    —
                                  </span>
                                ) : (
                                  <span
                                    className={`text-xs font-bold px-2 py-0.5 rounded-full border whitespace-nowrap tabular-nums ${
                                      p.net_margin_percent >= 30
                                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                        : p.net_margin_percent >= 15
                                        ? "bg-amber-100 text-amber-800 border-amber-200"
                                        : "bg-rose-100 text-rose-800 border-rose-200"
                                    }`}
                                  >
                                    {percent(p.net_margin_percent)}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span className="text-stone-400 hover:text-stone-700 inline-flex items-center justify-center">
                                  <ChevronDownIcon
                                    className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                                      isExpanded ? "rotate-180 text-stone-700" : ""
                                    }`}
                                  />
                                </span>
                              </td>
                            </tr>

                            {/* Detalhes Unitários Expansíveis */}
                            {isExpanded && (
                              <tr className="bg-amber-50/25 border-y border-amber-200/60">
                                <td colSpan={9} className="p-3 sm:p-4">
                                  {(() => {
                                    const isKit = p.name.toLowerCase().includes("kit");
                                    const packMatch = p.name.match(/kit\s*(\d+)/i);
                                    const packSize = packMatch ? Number(packMatch[1]) : 1;
                                    const unitPctComm = p.units_sold > 0 && p.percentage_commissions ? p.percentage_commissions / p.units_sold : 0;
                                    const unitFixFee = p.units_sold > 0 && p.fixed_fees ? p.fixed_fees / p.units_sold : (unitCommission - unitPctComm);
                                    const isFeeUnitExpanded = expandedFeeSku === `unit-${p.sku}`;

                                    const channelRateStr =
                                      unitAvgPrice > 0 && unitPctComm > 0
                                        ? `${Math.round((unitPctComm / unitAvgPrice) * 100)}%`
                                        : channelKey === "shopee"
                                        ? "20%"
                                        : channelKey === "mercadolivre"
                                        ? "16%"
                                        : channelKey === "tiktok"
                                        ? "7%"
                                        : "3,5%";

                                    const isNegativeProfit = unitProfit < 0 || p.net_profit < 0;
                                    const marginColorStyle =
                                      isNegativeProfit
                                        ? {
                                            bg: "bg-rose-50 border-rose-200",
                                            label: "text-rose-700",
                                            val: "text-rose-900 font-bold",
                                            sub: "text-rose-700 font-semibold",
                                          }
                                        : p.net_margin_percent >= 30
                                        ? {
                                            bg: "bg-emerald-50 border-emerald-200",
                                            label: "text-emerald-700",
                                            val: "text-emerald-900",
                                            sub: "text-emerald-700 font-semibold",
                                          }
                                        : p.net_margin_percent >= 15
                                        ? {
                                            bg: "bg-amber-50 border-amber-200",
                                            label: "text-amber-800",
                                            val: "text-amber-900",
                                            sub: "text-amber-800 font-semibold",
                                          }
                                        : {
                                            bg: "bg-rose-50 border-rose-200",
                                            label: "text-rose-700",
                                            val: "text-rose-900",
                                            sub: "text-rose-700 font-semibold",
                                          };

                                    return (
                                      <div className="space-y-4">
                                        <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-4">
                                          {/* Linha Superior: Foto, Título, Estoque e Botão de Ação */}
                                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                                            <div className="flex items-center gap-3.5 min-w-0">
                                              <div className="w-14 h-14 rounded-xl border border-stone-200 bg-stone-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                                {p.image_url ? (
                                                  <img
                                                    src={p.image_url}
                                                    alt={p.name}
                                                    className="w-full h-full object-cover"
                                                  />
                                                ) : (
                                                  <span className="text-2xl">🖼️</span>
                                                )}
                                              </div>
                                              <div className="min-w-0">
                                                <h4 className="font-bold text-stone-900 text-sm sm:text-base line-clamp-1">
                                                  {p.name.replace(/<br\s*\/?>/gi, " - ")}
                                                </h4>
                                                <p className="text-xs text-stone-500 font-mono mt-0.5">
                                                  SKU: <span className="text-stone-700 font-semibold">{p.sku}</span> · Estoque: <span className="text-stone-700 font-semibold">{p.stock_quantity ?? "—"} un</span> · <span className="text-stone-700 font-medium">{isKit ? `${p.units_sold} kits vendidos (${p.units_sold * packSize} peças)` : `${p.units_sold} unidades vendidas`}</span>
                                                </p>
                                              </div>
                                            </div>

                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (typeof window !== "undefined" && window.getSelection()?.toString().trim().length) return;
                                                    toggleAllProductDetails(p.sku);
                                              }}
                                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 px-3 py-1.5 rounded-lg border border-stone-200 transition select-none cursor-pointer flex-shrink-0 self-start sm:self-auto"
                                              title="Expandir ou recolher todos os 4 blocos de detalhes ao mesmo tempo"
                                            >
                                              <ChevronDownIcon
                                                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                                  openAccordions[`prod-details-${p.sku}`] ? "rotate-180 text-stone-800" : "text-stone-500"
                                                }`}
                                              />
                                              <span>
                                                {openAccordions[`prod-details-${p.sku}`]
                                                  ? "Recolher todos os detalhes"
                                                  : "Expandir todos os detalhes"}
                                              </span>
                                            </button>
                                          </div>

                                          {/* Métricas Unitárias - 4 Colunas com 100% da Largura da Tabela */}
                                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 w-full text-xs">
                                            {/* 1. Preço Médio Realizado com Referência do Anúncio */}
                                            {(() => {
                                              const isDetailsOpen = !!openAccordions[`prod-details-${p.sku}`];
                                              const isRevOpen = isDetailsOpen;
                                              const listingPrice = p.channel_listing_price;
                                              const hasListingPrice = listingPrice != null && listingPrice > 0;
                                              const unitPricePerPiece = isKit && packSize > 1 ? unitAvgPrice / packSize : unitAvgPrice;
                                              const baseCatalogPrice = p.base_price;
                                              const discountDiff = hasListingPrice && listingPrice > unitAvgPrice ? listingPrice - unitAvgPrice : 0;
                                              const discountPct = hasListingPrice && listingPrice > 0 ? Math.round((discountDiff / listingPrice) * 100) : 0;

                                              return (
                                                <div
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (typeof window !== "undefined" && window.getSelection()?.toString().trim().length) return;
                                                    toggleAllProductDetails(p.sku);
                                                  }}
                                                  className="bg-stone-50 hover:bg-stone-100/70 p-2.5 rounded-lg border border-stone-200 cursor-pointer transition flex flex-col justify-between min-w-0 overflow-hidden"
                                                  title="Clique para expandir ou recolher todos os detalhes deste produto"
                                                >
                                                  <div>
                                                    <div className="flex items-center justify-between">
                                                      <span className="text-stone-500 block text-[10px] uppercase font-bold truncate">
                                                        Valor Médio ({cfg.label})
                                                      </span>
                                                      <ChevronDownIcon
                                                        className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                                                          isRevOpen ? "rotate-180 text-stone-700" : "text-stone-400"
                                                        }`}
                                                      />
                                                    </div>
                                                    <div className="flex items-baseline gap-1 mt-0.5">
                                                      <strong className="text-stone-900 text-sm tabular-nums whitespace-nowrap font-bold">
                                                        {money(unitAvgPrice)}
                                                      </strong>
                                                      <span className="text-[10px] text-stone-600 font-medium">
                                                        / {isKit ? "kit" : "peça"}
                                                      </span>
                                                    </div>
                                                    <span className="text-[10px] text-stone-500 block tabular-nums">
                                                      {isKit && packSize > 1
                                                        ? `(${money(unitPricePerPiece)} por peça · ${packSize} un/kit)`
                                                        : "preço médio de venda"}
                                                    </span>
                                                  </div>

                                                  {isRevOpen && (
                                                    <div className="mt-2 pt-2 border-t border-stone-200 text-[10px] space-y-1 text-stone-700">
                                                      {hasListingPrice && (
                                                        <div className="flex justify-between items-center gap-1 min-w-0 pb-0.5 border-b border-stone-100">
                                                          <span className="truncate">Preço Anunciado no Canal:</span>
                                                          <strong className="text-stone-900 tabular-nums shrink-0">
                                                            {money(listingPrice)} / {isKit ? "kit" : "un"}
                                                          </strong>
                                                        </div>
                                                      )}
                                                      <div className="flex justify-between items-center gap-1 min-w-0">
                                                        <span className="truncate">Preço Médio Realizado:</span>
                                                        <strong className="text-stone-900 tabular-nums shrink-0">
                                                          {money(unitAvgPrice)} / {isKit ? "kit" : "un"}
                                                        </strong>
                                                      </div>
                                                      {isKit && packSize > 1 && (
                                                        <div className="flex justify-between items-center gap-1 min-w-0 text-stone-600">
                                                          <span className="truncate">Média Realizada / Peça:</span>
                                                          <span className="tabular-nums shrink-0 font-medium">
                                                            {money(unitPricePerPiece)} / peça
                                                          </span>
                                                        </div>
                                                      )}
                                                      {discountDiff > 0 && (
                                                        <div className="flex justify-between items-center gap-1 min-w-0 text-rose-700">
                                                          <span className="truncate">Desconto Promocional / Cupom:</span>
                                                          <span className="tabular-nums shrink-0 font-semibold">
                                                            -{money(discountDiff)} / kit (-{discountPct}%)
                                                          </span>
                                                        </div>
                                                      )}
                                                      {baseCatalogPrice != null && baseCatalogPrice > 0 && (
                                                        <div className="flex justify-between items-center gap-1 min-w-0 text-stone-500">
                                                          <span className="truncate">Preço Base Catálogo (Tray):</span>
                                                          <span className="text-stone-700 tabular-nums shrink-0 font-medium">
                                                            {money(baseCatalogPrice)}
                                                          </span>
                                                        </div>
                                                      )}
                                                      <div className="flex justify-between items-center gap-1 min-w-0 text-stone-600">
                                                        <span className="truncate">Volume no Período:</span>
                                                        <span className="tabular-nums shrink-0 font-medium">
                                                          {p.units_sold} {isKit ? `kits (${p.units_sold * packSize} peças)` : "unidades"}
                                                        </span>
                                                      </div>
                                                      <div className="flex justify-between items-center gap-1 min-w-0 pt-1 border-t border-stone-200/80 font-bold text-stone-900">
                                                        <span className="truncate">Total Faturamento:</span>
                                                        <strong className="tabular-nums shrink-0">{money(p.total_revenue)}</strong>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })()}

                                            {/* 2. Custo Fábrica (Sanfona) */}
                                            {(() => {
                                              const isCostOpen = !!openAccordions[`prod-details-${p.sku}`];
                                              const isMissingCost = p.has_missing_cost || (unitCost === 0 && !p.is_own_production);

                                              return (
                                                <div
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (typeof window !== "undefined" && window.getSelection()?.toString().trim().length) return;
                                                    toggleAllProductDetails(p.sku);
                                                  }}
                                                  className="bg-stone-50 hover:bg-stone-100/70 p-2.5 rounded-lg border border-stone-200 cursor-pointer transition flex flex-col justify-between min-w-0 overflow-hidden"
                                                  title="Clique para expandir ou recolher todos os detalhes deste produto"
                                                >
                                                  {isMissingCost ? (
                                                    <div>
                                                      <div className="flex items-center justify-between">
                                                        <span className="text-stone-500 block text-[10px] uppercase font-bold">
                                                          Custo Fábrica
                                                        </span>
                                                        <ChevronDownIcon
                                                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                                            isCostOpen ? "rotate-180 text-stone-700" : "text-stone-400"
                                                          }`}
                                                        />
                                                      </div>
                                                      <div className="mt-1">
                                                        <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                                                          Não informado
                                                        </span>
                                                      </div>
                                                      <span className="text-[10px] text-stone-400 block mt-0.5">
                                                        custo não cadastrado
                                                      </span>
                                                    </div>
                                                  ) : (
                                                    <div>
                                                      <div className="flex items-center justify-between">
                                                        <span className="text-stone-500 block text-[10px] uppercase font-bold">
                                                          Custo Fábrica
                                                        </span>
                                                        <ChevronDownIcon
                                                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                                            isCostOpen ? "rotate-180 text-stone-700" : "text-stone-400"
                                                          }`}
                                                        />
                                                      </div>
                                                      <div className="flex items-baseline gap-1 mt-0.5">
                                                        <strong className="text-stone-700 text-sm tabular-nums whitespace-nowrap font-bold">
                                                          -{money(unitCost)}
                                                        </strong>
                                                        <span className="text-[10px] text-stone-600 font-medium">
                                                          / {isKit ? "kit" : "peça"}
                                                        </span>
                                                      </div>
                                                      <span className="text-[10px] text-stone-500 block">
                                                        {isKit && packSize > 1
                                                          ? `(-${money(unitCost / packSize)} por peça · ${packSize} un/kit)`
                                                          : isKit ? "por kit confecção" : "por peça confecção"}
                                                      </span>
                                                    </div>
                                                  )}

                                                  {isCostOpen && (
                                                    <div className="mt-2 pt-2 border-t border-stone-200 text-[10px] space-y-1 text-stone-700">
                                                      {isMissingCost ? (
                                                        <div className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px]">
                                                          ⚠️ Produto sem custo cadastrado. Cadastre o preço de custo na Tray ou na planilha para habilitar o cálculo de CMV e Lucro Real.
                                                        </div>
                                                      ) : (
                                                        <>
                                                          <div className="flex justify-between gap-1">
                                                            <span>Custo do Kit:</span>
                                                            <strong className="text-stone-900 tabular-nums">-{money(unitCost)} / kit</strong>
                                                          </div>
                                                          {isKit && packSize > 1 && (
                                                            <div className="flex justify-between gap-1 text-stone-600">
                                                              <span>Custo por Peça:</span>
                                                              <strong className="text-stone-900 tabular-nums">-{money(unitCost / packSize)} / peça</strong>
                                                            </div>
                                                          )}
                                                          <div className="flex justify-between gap-1">
                                                            <span>Origem:</span>
                                                            <strong className="text-stone-900">
                                                              {p.is_own_production ? "Confecção Própria" : "Cerâmica / Terceiro"}
                                                            </strong>
                                                          </div>
                                                          <div className="flex justify-between items-center gap-1 min-w-0 pt-1 border-t border-stone-200/80 font-bold text-stone-900">
                                                            <span className="truncate">Total Custo (CMV):</span>
                                                            <strong className="tabular-nums shrink-0">-{money(p.total_cost)}</strong>
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })()}

                                            {/* 3. Sanfona Interativa da Taxa do Canal */}
                                            {(() => {
                                              const isTaxOpen = !!openAccordions[`prod-details-${p.sku}`] || isFeeUnitExpanded;
                                              const isShopee = channelKey === "shopee";
                                              const shopeeCommLiquid = isShopee ? unitAvgPrice * 0.186 : unitPctComm;
                                              const shopeeTransFee = isShopee ? unitAvgPrice * 0.014 : 0;
                                              const effectiveFeePerUnit = isShopee ? 4.5 : (unitFixFee > 0 ? unitFixFee : 0);
                                              const effectiveRatePercent = unitAvgPrice > 0 ? (unitCommission / unitAvgPrice) * 100 : (isShopee ? 20 : 16);
                                              const fixedFeePct = unitAvgPrice > 0 ? (effectiveFeePerUnit / unitAvgPrice) * 100 : 0;

                                              return (
                                                <div
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (typeof window !== "undefined" && window.getSelection()?.toString().trim().length) return;
                                                    toggleAllProductDetails(p.sku);
                                                  }}
                                                  className="bg-orange-50/70 hover:bg-orange-50 p-2.5 rounded-lg border border-orange-200 cursor-pointer transition flex flex-col justify-between min-w-0 overflow-hidden"
                                                  title="Clique para expandir ou recolher todos os detalhes deste produto"
                                                >
                                                  <div className="flex items-center justify-between">
                                                    <span className="text-orange-900 block text-[10px] uppercase font-bold">
                                                      Taxa ({percent(effectiveRatePercent)})
                                                    </span>
                                                    <ChevronDownIcon
                                                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                                        isTaxOpen ? "rotate-180 text-orange-700" : "text-orange-400"
                                                      }`}
                                                    />
                                                  </div>
                                                  <strong className="text-orange-700 text-sm mt-0.5 tabular-nums whitespace-nowrap">
                                                    -{money(unitCommission)}
                                                  </strong>
                                                  <span className="text-[10px] text-orange-600/80 block">
                                                    retenção por venda
                                                  </span>

                                                  {isTaxOpen && (
                                                    <div className="mt-2 pt-2 border-t border-orange-200 text-[10px] space-y-1 text-orange-950">
                                                      <div className="flex justify-between gap-1 items-center">
                                                        <span>Comissão Líquida ({isShopee ? "18,6%" : channelRateStr}):</span>
                                                        <strong className="text-orange-900 tabular-nums whitespace-nowrap">
                                                          -{money(shopeeCommLiquid)}
                                                        </strong>
                                                      </div>
                                                      {isShopee && (
                                                        <div className="flex justify-between gap-1 pl-1 text-stone-600 items-center">
                                                          <span>Transação (1,40%):</span>
                                                          <strong className="text-orange-900 tabular-nums whitespace-nowrap">-{money(shopeeTransFee)}</strong>
                                                        </div>
                                                      )}
                                                      <div className="flex justify-between gap-1 items-center">
                                                        <span>Taxa Fixa ({percent(fixedFeePct)}):</span>
                                                        <strong className="text-orange-900 tabular-nums whitespace-nowrap">
                                                          -{money(effectiveFeePerUnit)}
                                                        </strong>
                                                      </div>
                                                      <div className="flex justify-between gap-1 pt-1 border-t border-orange-200/80 font-bold items-center">
                                                        <span>Total Taxas:</span>
                                                        <span className="tabular-nums whitespace-nowrap">-{money(p.total_commissions)}</span>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })()}

                                            {/* 4. Lucro Líquido Unitário (Sanfona e cor dinâmica) */}
                                            {(() => {
                                              const isProfitOpen = !!openAccordions[`prod-details-${p.sku}`];
                                              const isMissingCost = p.has_missing_cost || (unitCost === 0 && !p.is_own_production);

                                              if (isMissingCost) {
                                                return (
                                                  <div
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      if (typeof window !== "undefined" && window.getSelection()?.toString().trim().length) return;
                                                      toggleAllProductDetails(p.sku);
                                                    }}
                                                    className="bg-stone-50 hover:bg-stone-100/70 p-2.5 rounded-lg border border-stone-200 cursor-pointer transition flex flex-col justify-between min-w-0 overflow-hidden"
                                                    title="Clique para expandir ou recolher todos os detalhes deste produto"
                                                  >
                                                    <div>
                                                      <div className="flex items-center justify-between">
                                                        <span className="text-stone-500 block text-[10px] uppercase font-bold">
                                                          Lucro por {isKit ? "Kit" : "Peça"}
                                                        </span>
                                                        <ChevronDownIcon
                                                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                                            isProfitOpen ? "rotate-180 text-stone-700" : "text-stone-400"
                                                          }`}
                                                        />
                                                      </div>
                                                      <div className="mt-1">
                                                        <span className="text-stone-400 font-bold text-sm">—</span>
                                                      </div>
                                                      <span className="text-amber-700 text-[10px] block font-medium mt-0.5">
                                                        Requer custo de produção
                                                      </span>
                                                    </div>

                                                    {isProfitOpen && (
                                                      <div className="mt-2 pt-2 border-t border-stone-200 text-[10px] text-stone-600 space-y-1">
                                                        <p className="text-amber-800 font-semibold">
                                                          ⚠️ Preço de custo não informado
                                                        </p>
                                                        <p>
                                                          Cadastre o custo na Tray ou na planilha para apurar o lucro líquido real deste produto.
                                                        </p>
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              }

                                              return (
                                                <div
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (typeof window !== "undefined" && window.getSelection()?.toString().trim().length) return;
                                                    toggleAllProductDetails(p.sku);
                                                  }}
                                                  className={`${marginColorStyle.bg} hover:brightness-98 p-2.5 rounded-lg border cursor-pointer transition flex flex-col justify-between min-w-0 overflow-hidden`}
                                                  title="Clique para expandir ou recolher todos os detalhes deste produto"
                                                >
                                                  <div>
                                                    <div className="flex items-center justify-between">
                                                      <span className={`${marginColorStyle.label} block text-[10px] uppercase font-bold`}>
                                                        Lucro por {isKit ? "Kit" : "Peça"}
                                                      </span>
                                                      <ChevronDownIcon
                                                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                                          isProfitOpen ? "rotate-180 text-stone-700" : "text-stone-400"
                                                        }`}
                                                      />
                                                    </div>
                                                    <div className="flex items-baseline gap-1 mt-0.5">
                                                      <strong className={`${marginColorStyle.val} text-sm tabular-nums font-bold`}>
                                                        {money(unitProfit)}
                                                      </strong>
                                                      <span className="text-[10px] font-medium opacity-80">
                                                        / {isKit ? "kit" : "peça"}
                                                      </span>
                                                    </div>
                                                    <span className={`${marginColorStyle.sub} text-[10px] block tabular-nums`}>
                                                      {isKit && packSize > 1
                                                        ? `(+${money(unitProfit / packSize)}/pç · Margem ${percent(p.net_margin_percent)})`
                                                        : `Margem ${percent(p.net_margin_percent)}`}
                                                    </span>
                                                  </div>

                                                  {isProfitOpen && (
                                                    <div className="mt-2 pt-2 border-t border-current/20 text-[10px] space-y-1">
                                                      <div className="flex justify-between gap-1">
                                                        <span>Lucro do Kit:</span>
                                                        <strong className="tabular-nums">{money(unitProfit)} / kit</strong>
                                                      </div>
                                                      {isKit && packSize > 1 && (
                                                        <div className="flex justify-between gap-1">
                                                          <span>Lucro por Peça:</span>
                                                          <strong className="tabular-nums">{money(unitProfit / packSize)} / peça</strong>
                                                        </div>
                                                      )}
                                                      <div className="flex justify-between gap-1">
                                                        <span>Margem Real:</span>
                                                        <strong className="tabular-nums">{percent(p.net_margin_percent)}</strong>
                                                      </div>
                                                      <div className="flex justify-between items-center gap-1 min-w-0 pt-1 border-t border-current/30 font-bold">
                                                        <span className="truncate">Total Lucro Limpo:</span>
                                                        <strong className="tabular-nums shrink-0">{money(p.net_profit)}</strong>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })()}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })()}
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
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* ABA 3: PEDIDOS & CLIENTES                                                 */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === "pedidos" && (
          <div className="space-y-6">
            {(() => {
              const allOrders = data?.recent_orders || [];

              // Classificadores de status por ciclo operacional
              const isAEnviar = (s: string) =>
                s.includes("a enviar") ||
                s.includes("aguardando envio") ||
                s.includes("pronto para envio") ||
                s.includes("a despachar");

              const isFinalizado = (s: string) =>
                s.includes("finalizado") ||
                s.includes("entregue") ||
                s.includes("concluido") ||
                s.includes("concluído");

              const isCancelado = (s: string) =>
                s.includes("cancelado") ||
                s.includes("devolvido") ||
                s.includes("estornado") ||
                s.includes("rejeitado");

              const isAguardandoPgto = (s: string) =>
                s.includes("aguardando pagamento") ||
                s.includes("aguardando vindi") ||
                s.includes("pendente");

              const isEnviado = (s: string) =>
                (s.includes("enviado") ||
                  s.includes("transporte") ||
                  s.includes("monitoramento") ||
                  s.includes("despachado")) &&
                !isFinalizado(s) &&
                !isCancelado(s);

              // Contagens dinâmicas
              const countAEnviar = allOrders.filter((o) => isAEnviar((o.status || "").toLowerCase())).length;
              const countEnviados = allOrders.filter((o) => isEnviado((o.status || "").toLowerCase())).length;
              const countFinalizados = allOrders.filter((o) => isFinalizado((o.status || "").toLowerCase())).length;
              const countCancelados = allOrders.filter((o) => isCancelado((o.status || "").toLowerCase())).length;
              const countAguardandoPgto = allOrders.filter((o) => isAguardandoPgto((o.status || "").toLowerCase())).length;

              const filteredOrders = allOrders.filter((o) => {
                const s = (o.status || "").toLowerCase();
                if (orderStatusFilter === "a_enviar" && !isAEnviar(s)) return false;
                if (orderStatusFilter === "enviados" && !isEnviado(s)) return false;
                if (orderStatusFilter === "finalizados" && !isFinalizado(s)) return false;
                if (orderStatusFilter === "cancelados" && !isCancelado(s)) return false;
                if (orderStatusFilter === "aguardando_pgto" && !isAguardandoPgto(s)) return false;

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
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-bold text-stone-900">
                          Últimos Pedidos Recebidos
                        </h2>
                        {data?.start_date && data?.end_date && (
                          <span className="text-[11px] font-semibold bg-stone-100 text-stone-800 border border-stone-300 px-2 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
                            <span>📅</span>
                            <span>{formatDateBR(data.start_date)} a {formatDateBR(data.end_date)}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500">
                        Clique em qualquer pedido para conferir os produtos, frete, taxa e lucro de cada compra.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Barra de Filtros por Fases com Scroll Suave */}
                      <div className="flex items-center bg-stone-100 p-1 rounded-xl gap-1 text-xs font-semibold overflow-x-auto whitespace-nowrap scrollbar-none max-w-full">
                        {/* Todos */}
                        <button
                          type="button"
                          onClick={() => setOrderStatusFilter("todos")}
                          className={`px-3 py-1.5 min-h-[38px] rounded-lg transition active:scale-[0.98] inline-flex items-center justify-center ${
                            orderStatusFilter === "todos"
                              ? "bg-white text-stone-900 shadow-2xs font-bold"
                              : "text-stone-500 hover:text-stone-800"
                          }`}
                        >
                          Todos ({allOrders.length})
                        </button>

                        {/* A Enviar */}
                        <button
                          type="button"
                          onClick={() => setOrderStatusFilter("a_enviar")}
                          className={`px-3 py-1.5 min-h-[38px] rounded-lg transition active:scale-[0.98] inline-flex items-center gap-1.5 justify-center ${
                            orderStatusFilter === "a_enviar"
                              ? "bg-amber-800 text-white shadow-2xs font-bold"
                              : "text-amber-900 hover:bg-amber-100/60"
                          }`}
                          title="Filtrar pedidos com pagamento aprovado que aguardam separação e envio"
                        >
                          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" />
                          A Enviar ({countAEnviar})
                        </button>

                        {/* Enviados */}
                        <button
                          type="button"
                          onClick={() => setOrderStatusFilter("enviados")}
                          className={`px-3 py-1.5 min-h-[38px] rounded-lg transition active:scale-[0.98] inline-flex items-center gap-1.5 justify-center ${
                            orderStatusFilter === "enviados"
                              ? "bg-sky-800 text-white shadow-2xs font-bold"
                              : "text-sky-900 hover:bg-sky-100/60"
                          }`}
                          title="Filtrar pedidos despachados e em transporte"
                        >
                          <span className={`w-2 h-2 rounded-full ${orderStatusFilter === "enviados" ? "bg-sky-300" : "bg-sky-500"}`} />
                          Enviados ({countEnviados})
                        </button>

                        {/* Finalizados */}
                        <button
                          type="button"
                          onClick={() => setOrderStatusFilter("finalizados")}
                          className={`px-3 py-1.5 min-h-[38px] rounded-lg transition active:scale-[0.98] inline-flex items-center gap-1.5 justify-center ${
                            orderStatusFilter === "finalizados"
                              ? "bg-emerald-800 text-white shadow-2xs font-bold"
                              : "text-emerald-900 hover:bg-emerald-100/60"
                          }`}
                          title="Filtrar pedidos com entrega confirmada e ciclo 100% concluído"
                        >
                          <span className={`w-2 h-2 rounded-full ${orderStatusFilter === "finalizados" ? "bg-emerald-300" : "bg-emerald-500"}`} />
                          Finalizados ({countFinalizados})
                        </button>

                        {/* Cancelados (se houver ou se selecionado) */}
                        {(countCancelados > 0 || orderStatusFilter === "cancelados") && (
                          <button
                            type="button"
                            onClick={() => setOrderStatusFilter("cancelados")}
                            className={`px-3 py-1.5 min-h-[38px] rounded-lg transition active:scale-[0.98] inline-flex items-center gap-1.5 justify-center ${
                              orderStatusFilter === "cancelados"
                                ? "bg-rose-800 text-white shadow-2xs font-bold"
                                : "text-rose-900 hover:bg-rose-100/60"
                            }`}
                            title="Filtrar pedidos cancelados ou estornados"
                          >
                            <span className={`w-2 h-2 rounded-full ${orderStatusFilter === "cancelados" ? "bg-rose-300" : "bg-rose-500"}`} />
                            Cancelados ({countCancelados})
                          </button>
                        )}

                        {/* Aguardando Pagamento (se houver ou se selecionado) */}
                        {(countAguardandoPgto > 0 || orderStatusFilter === "aguardando_pgto") && (
                          <button
                            type="button"
                            onClick={() => setOrderStatusFilter("aguardando_pgto")}
                            className={`px-3 py-1.5 min-h-[38px] rounded-lg transition active:scale-[0.98] inline-flex items-center gap-1.5 justify-center ${
                              orderStatusFilter === "aguardando_pgto"
                                ? "bg-yellow-700 text-white shadow-2xs font-bold"
                                : "text-yellow-950 hover:bg-yellow-100/60"
                            }`}
                            title="Filtrar pedidos aguardando confirmação do pagamento"
                          >
                            <span className={`w-2 h-2 rounded-full ${orderStatusFilter === "aguardando_pgto" ? "bg-yellow-300" : "bg-yellow-500"}`} />
                            Aguardando Pgto ({countAguardandoPgto})
                          </button>
                        )}
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Buscar pedido, cliente, cidade..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          className="text-xs border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-950 w-48 sm:w-56 min-h-[38px]"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none flex items-center justify-center">
                          <SearchIcon className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((o) => renderOrderCard(o))
                    ) : (
                      <p className="text-stone-400 text-sm col-span-3 text-center py-8">
                        Nenhum pedido encontrado com os filtros aplicados.
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* ABA 4: ANÚNCIOS & RETORNO (ROAS)                                          */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === "anuncios" && (() => {
          const isPlatformFiltered = selectedAdPlatform !== "all";
          const currentPlatformInfo = isPlatformFiltered
            ? data?.ads.by_platform.find((p) => p.platform === selectedAdPlatform)
            : null;
          const targetChannelKey = isPlatformFiltered
            ? PLATFORM_CHANNEL_MAP[selectedAdPlatform]
            : null;
          const targetChannelStats = targetChannelKey
            ? data?.channels.find((c) => c.channel === targetChannelKey)
            : null;

          // Métricas dinâmicas do topo
          const displayAdSpend = isPlatformFiltered
            ? currentPlatformInfo?.total_spent || 0
            : kpis?.total_ad_spend || 0;

          const displayRevenue = isPlatformFiltered
            ? targetChannelStats?.gross_revenue || 0
            : grossRevenue || 0;

          const displayOrdersCount = isPlatformFiltered
            ? targetChannelStats?.orders_count || 0
            : kpis?.total_orders || 0;

          const displayRoas = displayAdSpend > 0 ? displayRevenue / displayAdSpend : 0;
          const displayCac =
            displayOrdersCount > 0 && displayAdSpend > 0
              ? displayAdSpend / displayOrdersCount
              : 0;

          const channelOpProfit = targetChannelStats ? targetChannelStats.net_profit : 0;
          const displayNetProfit = isPlatformFiltered
            ? channelOpProfit - displayAdSpend
            : kpis?.final_net_profit || 0;

          const displayMarginPct =
            displayRevenue > 0 ? (displayNetProfit / displayRevenue) * 100 : 0;

          // 1. Gera todos os dias contínuos do período selecionado
          const allDatesInPeriod: string[] = [];
          if (data?.start_date && data?.end_date) {
            const cur = new Date(data.start_date + "T12:00:00");
            const end = new Date(data.end_date + "T12:00:00");
            while (cur <= end) {
              const yyyy = cur.getFullYear();
              const mm = String(cur.getMonth() + 1).padStart(2, "0");
              const dd = String(cur.getDate()).padStart(2, "0");
              allDatesInPeriod.push(`${yyyy}-${mm}-${dd}`);
              cur.setDate(cur.getDate() + 1);
            }
          }

          const platformsToDisplay: AdPlatform[] = isPlatformFiltered
            ? [selectedAdPlatform]
            : ["shopee_ads", "meta_ads"];

          const rawRecords = data?.ads.recent_records || [];
          let combinedRecords: (AdSpendRecord & { is_zero_fill?: boolean })[] = [];

          if (showZeroSpendDays && allDatesInPeriod.length > 0) {
            const recordMap = new Map<string, AdSpendRecord>();
            for (const r of rawRecords) {
              const key = `${r.platform}_${r.date.split(" ")[0]}`;
              recordMap.set(key, r);
            }

            for (const date of allDatesInPeriod) {
              for (const p of platformsToDisplay) {
                const key = `${p}_${date}`;
                const existing = recordMap.get(key);
                if (existing) {
                  combinedRecords.push(existing);
                } else {
                  combinedRecords.push({
                    id: `zero-${p}-${date}`,
                    platform: p,
                    date: date,
                    amount_spent: 0,
                    impressions: 0,
                    clicks: 0,
                    conversions: 0,
                    campaign_name: "Sem Veiculação / Pausado",
                    is_zero_fill: true,
                  });
                }
              }
            }
          } else {
            combinedRecords = rawRecords.filter((r) => {
              if (selectedAdPlatform === "all") return true;
              return r.platform === selectedAdPlatform;
            });
          }

          // Ordenação dinâmica
          const sortedRecords = [...combinedRecords].sort((a, b) => {
            let cmp = 0;
            switch (adSortField) {
              case "date":
                cmp = a.date.localeCompare(b.date);
                break;
              case "platform":
                cmp = (PLATFORM_LABELS[a.platform] || a.platform).localeCompare(
                  PLATFORM_LABELS[b.platform] || b.platform
                );
                break;
              case "campaign":
                cmp = (a.campaign_name || "").localeCompare(b.campaign_name || "");
                break;
              case "amount_spent":
                cmp = Number(a.amount_spent || 0) - Number(b.amount_spent || 0);
                break;
              case "clicks":
                cmp = Number(a.clicks || 0) - Number(b.clicks || 0);
                break;
              case "conversions":
                cmp = Number(a.conversions || 0) - Number(b.conversions || 0);
                break;
            }
            return adSortAsc ? cmp : -cmp;
          });

          return (
            <div className="space-y-6">
              {/* Barra de Filtros por Plataforma */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mr-1 flex items-center gap-1.5">
                    <span>Filtro de Anúncios:</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedAdPlatform("all")}
                    className={`text-xs font-semibold px-3 py-1.5 min-h-[34px] rounded-xl transition active:scale-[0.98] inline-flex items-center gap-1.5 cursor-pointer ${
                      selectedAdPlatform === "all"
                        ? "bg-stone-900 text-white shadow-xs font-bold"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    <span>🌐</span>
                    <span>Todas as Plataformas</span>
                    <span className="text-[10px] opacity-75 font-mono">
                      ({data?.ads.recent_records.length || 0})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAdPlatform("shopee_ads")}
                    className={`text-xs font-semibold px-3 py-1.5 min-h-[34px] rounded-xl transition active:scale-[0.98] inline-flex items-center gap-1.5 cursor-pointer ${
                      selectedAdPlatform === "shopee_ads"
                        ? "bg-orange-700 text-white shadow-xs font-bold"
                        : "bg-orange-50 text-orange-950 hover:bg-orange-100 border border-orange-200/60"
                    }`}
                  >
                    <PlatformLogoIcon platform="shopee_ads" className="w-4 h-4" />
                    <span>Shopee Ads</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAdPlatform("meta_ads")}
                    className={`text-xs font-semibold px-3 py-1.5 min-h-[34px] rounded-xl transition active:scale-[0.98] inline-flex items-center gap-1.5 cursor-pointer ${
                      selectedAdPlatform === "meta_ads"
                        ? "bg-[#0081FB] text-white shadow-xs font-bold"
                        : "bg-sky-50 text-sky-950 hover:bg-sky-100 border border-sky-200/60"
                    }`}
                  >
                    <PlatformLogoIcon platform="meta_ads" className="w-4 h-4" />
                    <span>Meta Ads (Instagram & FB)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAdPlatform("mercado_ads")}
                    className={`text-xs font-semibold px-3 py-1.5 min-h-[34px] rounded-xl transition active:scale-[0.98] inline-flex items-center gap-1.5 cursor-pointer ${
                      selectedAdPlatform === "mercado_ads"
                        ? "bg-amber-500 text-stone-900 shadow-xs font-bold"
                        : "bg-amber-50 text-amber-950 hover:bg-amber-100 border border-amber-200/60"
                    }`}
                  >
                    <PlatformLogoIcon platform="mercado_ads" className="w-4 h-4" />
                    <span>Mercado Ads</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAdPlatform("tiktok_ads")}
                    className={`text-xs font-semibold px-3 py-1.5 min-h-[34px] rounded-xl transition active:scale-[0.98] inline-flex items-center gap-1.5 cursor-pointer ${
                      selectedAdPlatform === "tiktok_ads"
                        ? "bg-stone-900 text-white shadow-xs font-bold"
                        : "bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-200/80"
                    }`}
                  >
                    <PlatformLogoIcon platform="tiktok_ads" className="w-4 h-4" />
                    <span>TikTok Ads</span>
                  </button>
                </div>

                {isPlatformFiltered && (
                  <button
                    type="button"
                    onClick={() => setSelectedAdPlatform("all")}
                    className="text-xs text-stone-500 hover:text-stone-800 font-semibold underline cursor-pointer self-start md:self-auto"
                  >
                    Limpar filtro de plataforma
                  </button>
                )}
              </div>

              {/* Cards Dinâmicos de Anúncios Recalculados */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                    {isPlatformFiltered && (
                      <PlatformLogoIcon platform={selectedAdPlatform} className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {selectedAdPlatform === "shopee_ads"
                        ? "Gasto Shopee Ads"
                        : selectedAdPlatform === "meta_ads"
                        ? "Gasto Meta Ads"
                        : selectedAdPlatform === "mercado_ads"
                        ? "Gasto Mercado Ads"
                        : selectedAdPlatform === "tiktok_ads"
                        ? "Gasto TikTok Ads"
                        : "Total Investido em Ads"}
                    </span>
                  </span>
                  <p className="text-2xl font-bold text-stone-900 mt-2 tabular-nums">
                    {loading ? "..." : money(displayAdSpend)}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">Período de {days} dias</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    {selectedAdPlatform === "shopee_ads"
                      ? "ROAS da Shopee"
                      : selectedAdPlatform === "meta_ads"
                      ? "Cliques & CPC Meta"
                      : isPlatformFiltered
                      ? `ROAS ${targetChannelStats?.channel_name || ""}`
                      : "ROAS Geral (Retorno em Mídia)"}
                  </span>
                  {selectedAdPlatform === "meta_ads" ? (
                    <div>
                      <p className="text-2xl font-bold text-sky-700 mt-2 tabular-nums">
                        {Number(currentPlatformInfo?.clicks || 0).toLocaleString("pt-BR")}{" "}
                        <span className="text-xs font-medium text-stone-500">cliques</span>
                      </p>
                      <p className="text-xs text-stone-400 mt-1 tabular-nums">
                        CPC Médio:{" "}
                        {displayAdSpend > 0 && Number(currentPlatformInfo?.clicks || 0) > 0
                          ? money(displayAdSpend / Number(currentPlatformInfo?.clicks || 1))
                          : "—"}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-2xl font-bold text-emerald-700 mt-2 tabular-nums">
                        {displayRoas > 0 ? `${displayRoas.toFixed(2)}x` : "—"}
                      </p>
                      <p className="text-xs text-stone-400 mt-1">
                        {isPlatformFiltered
                          ? `Faturamento ${targetChannelStats?.channel_name || ""} ÷ Investimento`
                          : "Faturamento Loja ÷ Investimento Total"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    {selectedAdPlatform === "meta_ads"
                      ? "Alcance & Impressões"
                      : isPlatformFiltered
                      ? `CAC ${targetChannelStats?.channel_name || ""}`
                      : "CAC Médio por Pedido"}
                  </span>
                  {selectedAdPlatform === "meta_ads" ? (
                    <div>
                      <p className="text-2xl font-bold text-stone-800 mt-2 tabular-nums">
                        {Number(currentPlatformInfo?.impressions || 0).toLocaleString("pt-BR")}
                      </p>
                      <p className="text-xs text-stone-400 mt-1 tabular-nums">
                        CPM Médio:{" "}
                        {displayAdSpend > 0 && Number(currentPlatformInfo?.impressions || 0) > 0
                          ? money((displayAdSpend / Number(currentPlatformInfo?.impressions || 1)) * 1000)
                          : "—"}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-2xl font-bold text-stone-800 mt-2 tabular-nums">
                        {displayCac > 0 ? money(displayCac) : "—"}
                      </p>
                      <p className="text-xs text-stone-400 mt-1">
                        {displayOrdersCount > 0
                          ? `${displayOrdersCount} compras no canal`
                          : "Custo de Aquisição de Cliente"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-amber-950 text-white p-5 rounded-2xl shadow-xs">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                    {isPlatformFiltered
                      ? `Lucro ${targetChannelStats?.channel_name || "Canal"} pós-Ads`
                      : "Lucro Final após Ads"}
                  </span>
                  <p className="text-2xl font-bold text-white mt-2 tabular-nums">
                    {loading ? "..." : money(displayNetProfit)}
                  </p>
                  <p className="text-xs text-amber-300 mt-1 tabular-nums">
                    Margem: {percent(displayMarginPct)}
                  </p>
                </div>
              </div>

              {/* Plataformas de Anúncios (Grid de Cards Clicáveis) */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-base font-bold text-stone-900">
                      Investimento por Plataforma Publicitária
                    </h2>
                    <p className="text-xs text-stone-500">
                      Clique em um card para filtrar métricas e histórico da plataforma.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setShowAdsAttributionGuide((prev) => !prev)}
                      className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-xs inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.98] border ${
                        showAdsAttributionGuide
                          ? "bg-amber-100 text-amber-950 border-amber-300 font-bold"
                          : "bg-white hover:bg-stone-50 text-stone-700 border-stone-200"
                      }`}
                      title="Entenda como as conversões e métricas são registradas em cada canal"
                    >
                      <span>ℹ️</span>
                      <span>{showAdsAttributionGuide ? "Ocultar Guia de Atribuição" : "Entenda as Métricas & Atribuição"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSyncAds}
                      disabled={isSyncingAds}
                      className="bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-xs inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
                      title="Consultar e sincronizar as APIs oficiais das plataformas de anúncios"
                    >
                      <span className={isSyncingAds ? "animate-spin" : ""}>🔄</span>
                      <span>{isSyncingAds ? "Sincronizando..." : "Sincronizar APIs de Ads"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalOpen(true)}
                      className="bg-amber-950 hover:bg-amber-900 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-xs cursor-pointer active:scale-[0.98]"
                    >
                      + Novo Lançamento
                    </button>
                  </div>
                </div>

                {syncAdsResult && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-medium flex items-center justify-between shadow-2xs">
                    <span>✨ {syncAdsResult}</span>
                    <button
                      type="button"
                      onClick={() => setSyncAdsResult(null)}
                      className="text-emerald-700 font-bold hover:underline ml-2 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {showAdsAttributionGuide && (
                  <div className="mb-6 p-5 bg-gradient-to-br from-amber-50/90 via-stone-50 to-white rounded-2xl border border-amber-200/80 shadow-xs animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber-200/60">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📊</span>
                        <h3 className="text-sm font-bold text-amber-950">
                          Guia de Atribuição e Regras de Conversão por Canal
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAdsAttributionGuide(false)}
                        className="text-xs text-stone-500 hover:text-stone-800 font-bold cursor-pointer"
                      >
                        ✕ Fechar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-2">
                        <div className="flex items-center gap-2 font-bold text-stone-900">
                          <PlatformLogoIcon platform="shopee_ads" className="w-4 h-4 flex-shrink-0" />
                          <span>Shopee Ads</span>
                        </div>
                        <div className="text-[11px] text-stone-600 space-y-1.5 leading-relaxed">
                          <p>
                            <strong>Conversão = Itens Comprados:</strong> A métrica de conversão da Shopee mede a soma de <u>produtos/itens vendidos</u> sob o anúncio, e <em>não</em> a quantidade de carrinhos fechados. Um pedido com 3 kits soma 3 conversões.
                          </p>
                          <p>
                            <strong>Janela de Atribuição (7 dias):</strong> O mérito é registrado na <u>data do clique</u>. Se o comprador clicou no dia 21 e pagou no dia 22, o Shopee Ads atribui o resultado ao dia 21.
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-2">
                        <div className="flex items-center gap-2 font-bold text-stone-900">
                          <PlatformLogoIcon platform="meta_ads" className="w-4 h-4 flex-shrink-0" />
                          <span>Meta Ads (Instagram / FB)</span>
                        </div>
                        <div className="text-[11px] text-stone-600 space-y-1.5 leading-relaxed">
                          <p>
                            <strong>Atribuição Direta:</strong> Rastreamento via Meta Pixel e Conversions API (CAPI) sobre as compras finalizadas no checkout da Loja Virtual (7 dias clique / 1 dia visualização).
                          </p>
                          <p>
                            <strong>Tráfego & Marca:</strong> Anúncios sem checkout imediato geram reconhecimento, novos seguidores, mensagens no Direct e pedidos via WhatsApp, alimentando o topo de funil da marca.
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-2">
                        <div className="flex items-center gap-2 font-bold text-stone-900">
                          <span>🔄</span>
                          <span>Visão Blended / MER do Canal</span>
                        </div>
                        <div className="text-[11px] text-stone-600 space-y-1.5 leading-relaxed">
                          <p>
                            <strong>Limitação Técnica das APIs:</strong> Marketplaces (Shopee e Mercado Livre) <em>não</em> repassam o código do anúncio (ad_id) no payload do pedido para o ERP/Tray.
                          </p>
                          <p>
                            <strong>Transparência Operacional:</strong> A dashboard lista todos os pedidos do canal faturados no dia para calcular o <strong>MER (ROAS Geral do Canal)</strong>, métrica padrão do mercado para avaliar o retorno real de cada canal de venda.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {data?.ads.by_platform.map((ad) => {
                    const isSelected = selectedAdPlatform === ad.platform;

                    return (
                      <div
                        key={ad.platform}
                        onClick={() =>
                          setSelectedAdPlatform((prev) =>
                            prev === ad.platform ? "all" : ad.platform
                          )
                        }
                        className={`border rounded-xl p-4 flex flex-col justify-between gap-3 shadow-2xs transition min-w-0 cursor-pointer active:scale-[0.99] ${
                          isSelected
                            ? "bg-amber-50/70 border-amber-500 ring-2 ring-amber-400/40"
                            : "bg-stone-50/50 border-stone-200 hover:border-stone-400 hover:bg-white"
                        }`}
                        title="Clique para filtrar apenas esta plataforma"
                      >
                        <div className="flex items-center justify-between gap-1.5 min-w-0">
                          <span className="font-bold text-stone-900 text-sm flex items-center gap-2 truncate">
                            <PlatformLogoIcon platform={ad.platform} className="w-5 h-5 flex-shrink-0" />
                            <span className="truncate whitespace-nowrap" title={ad.platform_name}>
                              {ad.platform_name}
                            </span>
                          </span>
                          {ad.roas && ad.roas > 0 ? (
                            <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                              ROAS {ad.roas.toFixed(1)}x
                            </span>
                          ) : (
                            <span className="text-[10px] bg-stone-100 text-stone-600 font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 border border-stone-200">
                              {ad.platform === "meta_ads" ? "Tráfego & Marca" : "Sem Vendas"}
                            </span>
                          )}
                        </div>

                        <div className="text-2xl font-black text-stone-900 tabular-nums whitespace-nowrap">
                          {money(ad.total_spent)}
                        </div>

                        <div className="grid grid-cols-3 gap-1 pt-2.5 border-t border-stone-200/80 text-center">
                          <div className="min-w-0">
                            <div className="text-stone-900 font-bold tabular-nums text-xs truncate whitespace-nowrap">
                              {Number(ad.impressions || 0).toLocaleString("pt-BR")}
                            </div>
                            <div className="text-[10px] text-stone-500 font-medium whitespace-nowrap truncate">
                              Impressões
                            </div>
                          </div>
                          <div className="min-w-0 border-x border-stone-200/70 px-0.5">
                            <div className="text-stone-900 font-bold tabular-nums text-xs truncate whitespace-nowrap">
                              {Number(ad.clicks || 0).toLocaleString("pt-BR")}
                            </div>
                            <div className="text-[10px] text-stone-500 font-medium whitespace-nowrap truncate">
                              Cliques
                            </div>
                          </div>
                          <div className="min-w-0">
                            <div className="text-stone-900 font-bold tabular-nums text-xs truncate whitespace-nowrap">
                              {Number(ad.conversions || 0).toLocaleString("pt-BR")}
                            </div>
                            <div className="text-[10px] text-stone-500 font-medium whitespace-nowrap truncate flex items-center justify-center gap-0.5">
                              <span>Conversões</span>
                              <span className="text-[9px] text-stone-400 cursor-help" title={ad.platform === "shopee_ads" ? "No Shopee Ads, este número indica unidades/itens comprados sob anúncios (não pedidos únicos)" : "Total de conversões registradas"}>ℹ️</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Histórico Recente de Lançamentos com Sanfona / Accordion Interativo */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                      <span>Histórico de Lançamentos de Anúncios no Período</span>
                      {isPlatformFiltered && (
                        <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-semibold">
                          Filtrado por: {PLATFORM_LABELS[selectedAdPlatform]}
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Mostrando {sortedRecords.length} lançamentos. Clique em qualquer linha para expandir detalhes de CPC, conversões e pedidos faturados no dia.
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer select-none bg-stone-100 hover:bg-stone-200/80 px-3 py-1.5 rounded-xl border border-stone-200 transition self-start sm:self-auto">
                    <input
                      type="checkbox"
                      checked={showZeroSpendDays}
                      onChange={(e) => setShowZeroSpendDays(e.target.checked)}
                      className="rounded text-amber-950 focus:ring-amber-900 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>Mostrar dias sem investimento (R$ 0,00)</span>
                  </label>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm min-w-[760px]">
                    <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200 uppercase text-[11px] tracking-wider whitespace-nowrap select-none">
                      <tr>
                        <th className="py-3 px-4 whitespace-nowrap w-[130px]">
                          <button
                            type="button"
                            onClick={() => handleAdSort("date")}
                            className="flex items-center gap-1.5 hover:text-stone-900 transition cursor-pointer font-bold uppercase tracking-wider"
                            title="Ordenar por Data"
                          >
                            <span>Data</span>
                            <span className="text-[10px] text-stone-400">
                              {adSortField === "date" ? (adSortAsc ? "▲" : "▼") : "↕"}
                            </span>
                          </button>
                        </th>
                        <th className="py-3 px-3 whitespace-nowrap w-[170px]">
                          <button
                            type="button"
                            onClick={() => handleAdSort("platform")}
                            className="flex items-center gap-1.5 hover:text-stone-900 transition cursor-pointer font-bold uppercase tracking-wider"
                            title="Ordenar por Plataforma"
                          >
                            <span>Plataforma</span>
                            <span className="text-[10px] text-stone-400">
                              {adSortField === "platform" ? (adSortAsc ? "▲" : "▼") : "↕"}
                            </span>
                          </button>
                        </th>
                        <th className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => handleAdSort("campaign")}
                            className="flex items-center gap-1.5 hover:text-stone-900 transition cursor-pointer font-bold uppercase tracking-wider"
                            title="Ordenar por Campanha"
                          >
                            <span>Campanha</span>
                            <span className="text-[10px] text-stone-400">
                              {adSortField === "campaign" ? (adSortAsc ? "▲" : "▼") : "↕"}
                            </span>
                          </button>
                        </th>
                        <th className="py-3 px-3.5 text-right whitespace-nowrap w-[125px]">
                          <button
                            type="button"
                            onClick={() => handleAdSort("amount_spent")}
                            className="inline-flex items-center gap-1.5 hover:text-stone-900 transition cursor-pointer font-bold uppercase tracking-wider ml-auto"
                            title="Ordenar por Valor Gasto"
                          >
                            <span>Valor Gasto</span>
                            <span className="text-[10px] text-stone-400">
                              {adSortField === "amount_spent" ? (adSortAsc ? "▲" : "▼") : "↕"}
                            </span>
                          </button>
                        </th>
                        <th className="py-3 px-3 text-center whitespace-nowrap w-[85px]">
                          <button
                            type="button"
                            onClick={() => handleAdSort("clicks")}
                            className="inline-flex items-center gap-1.5 hover:text-stone-900 transition cursor-pointer font-bold uppercase tracking-wider mx-auto"
                            title="Ordenar por Cliques"
                          >
                            <span>Cliques</span>
                            <span className="text-[10px] text-stone-400">
                              {adSortField === "clicks" ? (adSortAsc ? "▲" : "▼") : "↕"}
                            </span>
                          </button>
                        </th>
                        <th className="py-3 px-4 text-center whitespace-nowrap w-[110px]">
                          <button
                            type="button"
                            onClick={() => handleAdSort("conversions")}
                            className="inline-flex items-center gap-1.5 hover:text-stone-900 transition cursor-pointer font-bold uppercase tracking-wider mx-auto"
                            title="Ordenar por Conversões"
                          >
                            <span>Conversões</span>
                            <span className="text-[10px] text-stone-400">
                              {adSortField === "conversions" ? (adSortAsc ? "▲" : "▼") : "↕"}
                            </span>
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700">
                      {sortedRecords && sortedRecords.length > 0 ? (
                        sortedRecords.map((r) => {
                          const isExpanded = expandedAdRecordId === r.id;
                          const dateIso = r.date ? r.date.split(" ")[0] : "";
                          const chKey = PLATFORM_CHANNEL_MAP[r.platform];

                          // Correlacionar pedidos daquele dia e canal
                          const matchingOrders = (data?.recent_orders || []).filter((o) => {
                            const orderDateIso = o.date ? o.date.split(" ")[0] : "";
                            const dateMatches = orderDateIso === dateIso;
                            const channelMatches = chKey ? o.channel === chKey : true;
                            return dateMatches && channelMatches;
                          });

                          const totalMatchingOrdersRevenue = matchingOrders.reduce(
                            (acc, o) => acc + (o.total || 0),
                            0
                          );
                          const totalMatchingOrdersProfit = matchingOrders.reduce(
                            (acc, o) => acc + (o.net_profit || 0),
                            0
                          );
                          const dailyRoas =
                            r.amount_spent > 0 && totalMatchingOrdersRevenue > 0
                              ? totalMatchingOrdersRevenue / r.amount_spent
                              : 0;

                          const clicksCount = Number(r.clicks || 0);
                          const conversionsCount = Number(r.conversions || 0);
                          const cpc = clicksCount > 0 ? r.amount_spent / clicksCount : 0;
                          const costPerConv =
                            conversionsCount > 0 ? r.amount_spent / conversionsCount : null;
                          const cvr =
                            clicksCount > 0 ? (conversionsCount / clicksCount) * 100 : 0;

                          return (
                            <Fragment key={r.id}>
                              <tr
                                onClick={() =>
                                  setExpandedAdRecordId((prev) =>
                                    prev === r.id ? null : r.id
                                  )
                                }
                                className={`transition cursor-pointer select-none ${
                                  isExpanded
                                    ? "bg-amber-50/70 border-b border-amber-200"
                                    : r.amount_spent === 0
                                    ? "hover:bg-stone-50/80 bg-stone-50/30 text-stone-500"
                                    : "hover:bg-stone-50/90"
                                }`}
                                title="Clique para expandir/recolher detalhes"
                              >
                                <td className="py-2.5 px-4 font-mono whitespace-nowrap text-xs flex items-center gap-2">
                                  <span
                                    className={`text-[10px] text-stone-400 transition-transform duration-150 inline-block ${
                                      isExpanded ? "rotate-90 text-amber-700 font-bold" : ""
                                    }`}
                                  >
                                    ▶
                                  </span>
                                  <span>{formatFullDateBR(r.date)}</span>
                                </td>

                                <td className="py-2.5 px-3 font-semibold text-stone-900 whitespace-nowrap text-xs">
                                  <div className="flex items-center gap-2">
                                    <PlatformLogoIcon platform={r.platform} className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate max-w-[130px]">
                                      {PLATFORM_LABELS[r.platform] || r.platform}
                                    </span>
                                  </div>
                                </td>

                                <td
                                  className="py-2.5 px-3 text-xs max-w-[260px] sm:max-w-[360px] truncate whitespace-nowrap"
                                  title={r.campaign_name || ""}
                                >
                                  {r.amount_spent === 0 ? (
                                    <span className="text-[10px] bg-stone-100 text-stone-500 font-semibold px-2 py-0.5 rounded-full border border-stone-200">
                                      Pausado / Sem gasto
                                    </span>
                                  ) : (
                                    <span className="text-stone-700 font-medium">
                                      {r.campaign_name || "—"}
                                    </span>
                                  )}
                                </td>

                                <td className="py-2.5 px-3.5 text-right tabular-nums whitespace-nowrap text-xs">
                                  <span className={r.amount_spent > 0 ? "font-bold text-stone-900" : "text-stone-400 font-medium"}>
                                    {money(r.amount_spent)}
                                  </span>
                                </td>

                                <td className="py-2.5 px-3 text-center tabular-nums whitespace-nowrap text-xs">
                                  <span className={Number(r.clicks || 0) > 0 ? "text-stone-700" : "text-stone-300"}>
                                    {Number(r.clicks || 0).toLocaleString("pt-BR")}
                                  </span>
                                </td>

                                <td className="py-2.5 px-4 text-center tabular-nums whitespace-nowrap text-xs">
                                  <div className="inline-flex items-center gap-1.5 justify-center">
                                    <span
                                      className={`font-bold ${
                                        conversionsCount > 0
                                          ? "text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[11px]"
                                          : "text-stone-500"
                                      }`}
                                    >
                                      {Number(r.conversions || 0).toLocaleString("pt-BR")}
                                    </span>
                                  </div>
                                </td>
                              </tr>

                              {/* Accordion Expandido com Informações Detalhadas e Pedidos */}
                              {isExpanded && (
                                <tr className="bg-stone-50/95 border-b border-stone-200 animate-in fade-in duration-150">
                                  <td colSpan={6} className="p-4 sm:p-5">
                                    <div className="space-y-4">
                                      {/* Sub-cards de métricas do dia */}
                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                                        <div className="bg-white p-3 rounded-xl border border-stone-200">
                                          <span className="text-[10px] uppercase font-bold text-stone-400 block">
                                            CPC Médio do Dia
                                          </span>
                                          <div className="text-base font-extrabold text-stone-900 mt-0.5 tabular-nums">
                                            {cpc > 0 ? money(cpc) : "—"}
                                          </div>
                                          <span className="text-[10px] text-stone-500">
                                            Custo por clique
                                          </span>
                                        </div>

                                        <div className="bg-white p-3 rounded-xl border border-stone-200">
                                          <span className="text-[10px] uppercase font-bold text-stone-400 block">
                                            Taxa de Conversão
                                          </span>
                                          <div className="text-base font-extrabold text-stone-900 mt-0.5 tabular-nums">
                                            {percent(cvr)}
                                          </div>
                                          <span className="text-[10px] text-stone-500" title={r.platform === "shopee_ads" ? "No Shopee Ads, cada conversão representa um produto/item comprado" : "Conversões ÷ Cliques"}>
                                            {r.conversions} {r.platform === "shopee_ads" ? "itens conv." : "conv."} ÷ {r.clicks} cliques
                                          </span>
                                        </div>

                                        <div className="bg-white p-3 rounded-xl border border-stone-200">
                                          <span className="text-[10px] uppercase font-bold text-stone-400 block">
                                            Custo por Conversão
                                          </span>
                                          <div className="text-base font-extrabold text-stone-900 mt-0.5 tabular-nums">
                                            {costPerConv ? money(costPerConv) : "Sem conv. direta"}
                                          </div>
                                          <span className="text-[10px] text-stone-500">
                                            {r.platform === "shopee_ads" ? "Investimento ÷ itens convertidos" : "Investimento ÷ conversões"}
                                          </span>
                                        </div>

                                        <div className="bg-white p-3 rounded-xl border border-stone-200">
                                          <span className="text-[10px] uppercase font-bold text-stone-400 block" title="Marketing Efficiency Ratio: Faturamento total das vendas do canal no dia dividido pelo valor investido em anúncios">
                                            ROAS Blended (MER) do Canal
                                          </span>
                                          <div className="text-base font-extrabold text-emerald-700 mt-0.5 tabular-nums">
                                            {dailyRoas > 0 ? `${dailyRoas.toFixed(2)}x` : "—"}
                                          </div>
                                          <span className="text-[10px] text-stone-500">
                                            {matchingOrders.length} pedido(s) no canal no dia
                                          </span>
                                        </div>
                                      </div>

                                      {/* Seção de Pedidos Faturados no Dia */}
                                      <div className="bg-white p-4 rounded-xl border border-stone-200">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2 flex-wrap">
                                            <span>
                                              Vendas do Canal ({PLATFORM_LABELS[r.platform]}) em {formatFullDateBR(r.date)}
                                            </span>
                                            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono">
                                              Visão Blended (MER)
                                            </span>
                                            <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono">
                                              {matchingOrders.length} pedido(s)
                                            </span>
                                          </h4>
                                          {matchingOrders.length > 0 && (
                                            <div className="text-xs text-stone-600">
                                              Faturado no Canal: <strong className="text-stone-900 tabular-nums">{money(totalMatchingOrdersRevenue)}</strong> · Lucro Líquido: <strong className="text-emerald-700 tabular-nums">{money(totalMatchingOrdersProfit)}</strong>
                                            </div>
                                          )}
                                        </div>

                                        {/* Banner de Transparência sobre Pedidos vs Anúncios */}
                                        <div className="mb-3.5 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-950 flex items-start gap-2.5 leading-relaxed">
                                          <span className="text-base leading-none select-none">ℹ️</span>
                                          <div className="space-y-0.5">
                                            <div>
                                              <strong>Atribuição Blended do Canal:</strong> A API dos marketplaces (Shopee e Mercado Livre) não repassa códigos de campanha ou identificadores de anúncio (ad_id) dentro do pedido para o ERP/Tray. Listamos todos os pedidos faturados no canal nesta data para calcular o <strong>MER (ROAS Geral do Canal)</strong> e a rentabilidade líquida real.
                                            </div>
                                            {r.platform === "shopee_ads" && conversionsCount > 0 && (
                                              <div className="text-emerald-800 font-semibold pt-0.5">
                                                🎯 O Shopee Ads confirmou <strong>{conversionsCount} unidades/itens convertidos</strong> através dos anúncios neste período.
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {matchingOrders.length > 0 ? (
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                            {matchingOrders.map((ord) => renderOrderCard(ord))}
                                          </div>
                                        ) : (
                                          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/60 text-stone-500 text-xs">
                                            {r.platform === "meta_ads" ? (
                                              <span>
                                                ℹ️ Nenhum pedido direto na Loja Virtual registrado nesta data. Anúncios na Meta podem ter objetivo de reconhecimento, seguidores no Instagram ou captação de clientes via Direct/WhatsApp.
                                              </span>
                                            ) : (
                                              <span>
                                                ℹ️ Nenhuma venda finalizada registrada no canal nesta data específica. O investimento manteve a loja ativa nas buscas patrocinadas.
                                              </span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </Fragment>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-stone-400">
                            Nenhum investimento registrado com os filtros aplicados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}
        {activeTab === "saude" && (
          <MarketplaceHealthClient />
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
                  <option value="meta_ads">🟣 Meta Ads (Instagram &amp; Facebook)</option>
                  <option value="shopee_ads">🟠 Shopee Ads</option>
                  <option value="mercado_ads">🟡 Mercado Ads (Mercado Livre)</option>
                  <option value="tiktok_ads">⚫ TikTok Ads</option>
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
