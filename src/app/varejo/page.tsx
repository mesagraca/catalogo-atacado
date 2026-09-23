import { RetailAccess } from "@/components/retail-access";
import { RetailCatalogOverview } from "@/components/retail-catalog-overview";
import { hasRetailAccess } from "@/lib/retail-access";

export const metadata = {
  title: "Catálogo Varejo | Mesa & Graça",
  robots: { index: false, follow: false },
};

export default async function RetailPage() {
  const accessGranted = await hasRetailAccess();

  return accessGranted ? <RetailCatalogOverview /> : <RetailAccess />;
}
