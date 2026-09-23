import { NextRequest, NextResponse } from "next/server";
import { hasRetailAccess } from "@/lib/retail-access";
import { applyRetailImport } from "@/lib/retail-import";
import { parseTrayCsv, parseTrayWorkbook } from "@/lib/tray-import";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!(await hasRetailAccess())) {
    return NextResponse.json({ message: "Acesso não autorizado." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const apply = formData.get("apply") === "true";
  const syncInventory = formData.get("syncInventory") === "true";
  if (!(file instanceof File) || !/\.(xlsx|csv)$/i.test(file.name)) {
    return NextResponse.json({ message: "Envie o XLSX ou CSV exportado pela Tray." }, { status: 400 });
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const result = file.name.toLowerCase().endsWith(".csv")
      ? parseTrayCsv(bytes)
      : await parseTrayWorkbook(bytes);
    if (!apply) return NextResponse.json({ mode: "validation", ...result });
    const applied = await applyRetailImport(result, file.name, syncInventory);
    return NextResponse.json({ mode: "apply", ...result, applied });
  } catch (error) {
    console.error("Retail import failed", error);
    const message = error instanceof Error
      ? error.message
      : typeof error === "object" && error && "message" in error && typeof error.message === "string"
        ? error.message
        : "Falha ao importar a planilha.";
    return NextResponse.json({ message }, { status: 422 });
  }
}
