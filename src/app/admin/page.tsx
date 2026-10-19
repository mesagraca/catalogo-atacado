import { AdminClient } from "@/components/admin-client";
import { AdminAccess } from "@/components/admin-access";
import { hasAdminAccess } from "@/lib/admin-access";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Administração do Catálogo | Mesa & Graça",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const isAuthorized = await hasAdminAccess();
  return isAuthorized ? <AdminClient /> : <AdminAccess />;
}
