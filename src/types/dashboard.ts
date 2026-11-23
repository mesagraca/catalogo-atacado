export type SalesChannel = "site" | "shopee" | "mercadolivre" | "tiktok";

export type AdPlatform = "shopee_ads" | "mercado_ads" | "tiktok_ads" | "meta_ads" | "google_ads";

export type DashboardScope = "all" | "textil";

export interface CommissionBreakdown {
  rate_percent: number;
  percentage_amount: number;
  fixed_fee: number;
  total_fee: number;
  effective_rate_percent: number;
  rule_description: string;
}

export interface ChannelPerformance {
  channel: SalesChannel;
  channel_name: string;
  orders_count: number;
  gross_revenue: number;
  product_cost: number;
  commissions: number;
  percentage_commissions: number;
  fixed_fees: number;
  seller_shipping?: number;
  effective_commission_rate: number;
  net_profit: number;
  net_margin_percent: number;
}

export interface ProductProfitSummary {
  product_id: string | number;
  sku: string;
  name: string;
  image_url?: string;
  stock_quantity?: number;
  main_channel: string;
  units_sold: number;
  total_revenue: number;
  total_cost: number;
  total_commissions: number;
  percentage_commissions?: number;
  fixed_fees?: number;
  net_profit: number;
  net_margin_percent: number;
  base_price?: number;
  channel_listing_price?: number;
  unit_avg_price?: number;
  is_own_production?: boolean;
  has_missing_cost?: boolean;
  is_active?: boolean;
}

export interface AdSpendRecord {
  id: string;
  platform: AdPlatform;
  date: string;
  amount_spent: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  campaign_name?: string;
  notes?: string;
  created_at?: string;
}

export interface AdSpendSummary {
  platform: AdPlatform;
  platform_name: string;
  total_spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roas?: number;
}

export interface DashboardResponse {
  period_days: number;
  start_date: string;
  end_date: string;
  scope: DashboardScope;
  missing_costs_count?: number;
  tray_warning?: string | null;
  tray_kpis: {
    total_orders_count: number;
    total_orders_revenue: number;
    products_sold_revenue: number;
    average_ticket: number;
    active_orders_count: number;
    active_orders_revenue: number;
    cancelled_orders_count: number;
    cancelled_orders_revenue: number;
  };
  kpis: {
    total_orders: number;
    gross_revenue: number;
    shipping_cost: number;
    third_party_shipping?: number;
    items_revenue: number;
    product_cost_cmv: number;
    platform_commissions: number;
    operational_profit: number;
    operational_margin_percent: number;
    total_ad_spend: number;
    final_net_profit: number;
    final_net_margin_percent: number;
    average_ticket: number;
    overall_roas: number;
  };
  channels: ChannelPerformance[];
  products: ProductProfitSummary[];
  all_time_products?: ProductProfitSummary[];
  daily_timeline: Array<{
    date: string;
    gross_revenue: number;
    net_profit: number;
    orders_count: number;
  }>;
  ads: {
    total_spent: number;
    by_platform: AdSpendSummary[];
    recent_records: AdSpendRecord[];
  };
  recent_orders: {
    id: string;
    date: string;
    hour?: string;
    channel: SalesChannel;
    channel_label: string;
    status: string;
    customer_city?: string;
    customer_state?: string;
    shipment_name?: string;
    total: number;
    products_subtotal?: number;
    shipment_value?: number;
    seller_shipping_cost?: number;
    discount_value?: number;
    net_profit: number;
    net_margin_percent?: number;
    items_count: number;
    commission_amount?: number;
    commission_percentage_amount?: number;
    commission_fixed_fee?: number;
    cost_amount?: number;
    has_missing_cost?: boolean;
    items?: Array<{
      product_id: string;
      name: string;
      sku: string;
      price: number;
      quantity: number;
      unit_cost: number;
      cost: number; // mantido para retrocompatibilidade
      unit_commission: number;
      total_commission: number;
      commission_rate_percent?: number;
      commission_percentage_amount?: number;
      commission_fixed_fee?: number;
      commission_effective_percent?: number;
      commission_rule_label?: string;
      unit_net_profit: number;
      total_net_profit: number;
      net_margin_percent: number;
      image_url?: string;
      product_url?: string;
      stock_quantity?: number;
      is_own_production?: boolean;
      has_missing_cost?: boolean;
      pack_description?: string;
    }>;
  }[];
}
