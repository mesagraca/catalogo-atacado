import type { Product } from "@/types/catalog";

/**
 * Contract for the Supabase-backed catalog implementation in Phase 2.
 * Public readers must only receive active, visible products.
 */
export interface CatalogService {
  listPublishedProducts(): Promise<Product[]>;
  listAdminProducts(): Promise<Product[]>;
}
