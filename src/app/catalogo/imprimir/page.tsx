import { getUIProducts } from "@/lib/catalog-db";
import { PrintCatalogClient } from "./print-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PrintPage() {
  const products = await getUIProducts();
  return <PrintCatalogClient products={products} />;
}
