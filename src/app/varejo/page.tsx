import { cookies } from "next/headers";
import { RetailAccess } from "@/components/retail-access";
import { RetailCatalogOverview } from "@/components/retail-catalog-overview";

const COOKIE_NAME = "mesa_graca_varejo_access";

export const metadata = {
  title: "Catálogo Varejo | Mesa & Graça",
  robots: { index: false, follow: false },
};

export default async function RetailPage() {
  const cookieStore = await cookies();
  const hasAccess = cookieStore.get(COOKIE_NAME)?.value === "granted";

  return hasAccess ? <RetailCatalogOverview /> : <RetailAccess />;
}
