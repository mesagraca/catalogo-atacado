import { CatalogClient } from "@/components/catalog-client";
import { getUIProducts } from "@/lib/catalog-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CatalogPage() {
  const products = await getUIProducts();
  return <CatalogClient initialProducts={products} />;
}
