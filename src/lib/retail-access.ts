import { cookies } from "next/headers";

export const RETAIL_ACCESS_COOKIE = "mesa_graca_varejo_access";

export async function hasRetailAccess() {
  return (await cookies()).get(RETAIL_ACCESS_COOKIE)?.value === "granted";
}
