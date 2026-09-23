import { notFound, redirect } from "next/navigation";
import { RetailProductEditor } from "@/components/retail-product-editor";
import { hasRetailAccess } from "@/lib/retail-access";
import { getRetailCatalogCards } from "@/lib/retail-catalog";

export default async function RetailProductPage({ params }: { params: Promise<{ skuId: string }> }) {
  if (!(await hasRetailAccess())) redirect("/varejo");
  const { skuId } = await params;
  const catalog = await getRetailCatalogCards();
  const product = catalog.products.find((item) => item.id === skuId);
  if (!product) notFound();
  return <RetailProductEditor product={product} />;
}
