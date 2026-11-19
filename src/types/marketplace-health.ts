/**
 * Tipagens e Catálogo de Regras para Central de Saúde dos Marketplaces e Diagnóstico de Performance.
 * 
 * @module types/marketplace-health
 * @category Dashboard
 * @since v4.0.0
 */

import type { SalesChannel } from "./dashboard";

export type HealthSeverity = "healthy" | "warning" | "critical";

export type PenaltyStatusCategory = "confirmed" | "risk" | "informative_rule";

export type BottleneckPriority = "high" | "medium" | "low";

export type ConfidenceLevel = "high" | "medium" | "hypothesis";

export type ActionHorizon = "immediate_0_7d" | "short_term_8_15d" | "recovery_16_30d";

export interface SlaOrderItem {
  product_id: string;
  name: string;
  reference?: string;
  price: number;
  quantity: number;
  cost?: number;
  image_url?: string;
  pack_description?: string;
}

export interface SlaOrderMetrics {
  order_id: string;
  channel: SalesChannel;
  point_sale: string;
  order_date: string;
  order_hour?: string;
  customer_name?: string;
  customer_city?: string;
  customer_state?: string;
  status: string;
  shipment_name?: string;
  tracking_code?: string;
  total_amount: number;
  customer_paid: number;
  items_summary: string;
  units_sold: number;
  products_subtotal: number;
  discount: number;
  shipping_cost: number;
  is_free_shipping: boolean;
  channel_tax: number;
  channel_tax_percent: number;
  net_revenue: number;
  factory_cost: number;
  net_profit: number;
  net_margin_percent: number;
  items?: SlaOrderItem[];
  
  // SLA Fields
  payment_confirmed_at: string;
  expected_dispatch_deadline: string;
  official_sending_limit?: string;
  dispatch_cutoff_hour: string;
  actual_dispatched_at?: string;
  is_delayed: boolean;
  is_at_risk_today: boolean;
  is_at_risk_tomorrow: boolean;
  is_cancelled?: boolean;
  delay_business_days: number;
  sla_status: "on_time" | "at_risk" | "delayed" | "dispatched_late" | "dispatched_ok" | "cancelled";
}

export interface OfficialMarketplaceRule {
  id: string;
  channel: SalesChannel;
  metric_name: string;
  official_code: string;
  description: string;
  tolerance_limit_percent?: number;
  tolerance_limit_days?: number;
  penalty_points?: number;
  business_impact: string;
  appeal_period_days?: number;
  how_to_prevent: string;
  official_source_url: string;
  rules_version_date: string;
}

export interface ActivePenaltyRecord {
  id: string;
  channel: SalesChannel;
  rule_id: string;
  title: string;
  category: PenaltyStatusCategory;
  severity: HealthSeverity;
  points_accumulated?: number;
  applied_at?: string;
  expires_at?: string;
  appeal_deadline?: string;
  current_metric_value: number;
  target_threshold: number;
  active_restrictions: string[];
  notes: string;
}

export interface ChannelHealthSummary {
  channel: SalesChannel;
  channel_label: string;
  status: HealthSeverity;
  health_score: number; // 0 a 100
  late_dispatch_rate_percent: number;
  late_orders_count: number;
  orders_at_risk_count: number;
  cancelled_orders_count?: number;
  cancellation_rate_percent?: number;
  total_orders_in_period: number;
  confirmed_penalties_count: number;
  active_risks_count: number;
  trend_vs_previous_period_percent: number; // Ex: -2.5% ou +1.8%
  last_sync_timestamp: string;
  is_sync_stale: boolean;
  rules: OfficialMarketplaceRule[];
  penalties: ActivePenaltyRecord[];
}

export interface PerformanceDropHypothesis {
  id: string;
  category: "operations_delays" | "stock_stockout" | "ads_efficiency" | "commercial_seasonality";
  title: string;
  problem_identified: string;
  evidence_summary: string;
  estimated_financial_loss_brl: number;
  confidence: ConfidenceLevel;
  probable_cause: string;
  alternative_factors: string;
  recommended_action: string;
  priority: BottleneckPriority;
}

export interface StockoutLossItem {
  sku: string;
  name: string;
  image_url?: string;
  current_stock: number;
  peak_period_units_sold: number;
  recent_period_units_sold: number;
  all_time_units_sold?: number;
  sales_period_label?: string;
  drop_units: number;
  unit_price: number;
  estimated_revenue_lost_brl: number;
  days_out_of_stock: number;
  is_top_seller: boolean;
}

export interface RecoveryActionPlanItem {
  id: string;
  horizon: ActionHorizon;
  title: string;
  description: string;
  responsible: string;
  priority: BottleneckPriority;
  deadline_days: number;
  success_metric: string;
  expected_financial_impact_brl?: number;
  status: "pending" | "in_progress" | "completed";
}

export interface MarketplaceHealthDashboardResponse {
  period_selected_days: number;
  last_sync_at: string;
  is_data_stale: boolean;
  
  // Resumo de Saúde
  overall_health_status: HealthSeverity;
  channel_summaries: ChannelHealthSummary[];
  
  // Pedidos em Risco e Atrasados
  critical_orders: SlaOrderMetrics[];
  
  // Diagnóstico Comparativo
  historical_comparison: {
    baseline_period_label: string; // Ex: "Setembro/2026 (Mês Recorde)"
    baseline_start_date?: string;  // Ex: "2026-09-01"
    baseline_end_date?: string;    // Ex: "2026-09-30"
    baseline_revenue_brl: number;
    baseline_orders_count: number;
    current_period_label: string;  // Ex: "Últimos 30 dias (Período Recente)"
    current_start_date?: string;   // Ex: "2026-10-20"
    current_end_date?: string;     // Ex: "2026-11-19"
    current_revenue_brl: number;
    current_orders_count: number;
    revenue_delta_brl: number;
    revenue_delta_percent: number;
  };
  
  // Diagnóstico de Gargalos
  hypotheses: PerformanceDropHypothesis[];
  top_stockout_losses: StockoutLossItem[];
  
  // Plano de Ação
  action_plan: RecoveryActionPlanItem[];
}
