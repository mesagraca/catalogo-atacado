import { NextRequest, NextResponse } from "next/server";
import { hasRetailAccess } from "@/lib/retail-access";
import { applyRetailImport } from "@/lib/retail-import";
import { parseTrayWorkbook } from "@/lib/tray-import";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!(await hasRetailAccess())) {
    return NextResponse.json({ message: "Acesso não autorizado." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const apply = formData.get("apply") === "true";
  if (!(file instanceof File) || !file.name.toLowerCase().endsWith(".xlsx")) {
    return NextResponse.json({ message: "Envie o XLSX exportado pela Tray." }, { status: 400 });
  }

  try {
    const result = await parseTrayWorkbook(Buffer.from(await file.arrayBuffer()));
    if (!apply) return NextResponse.json({ mode: "validation", ...result });
    const applied = await applyRetailImport(result, file.name);
    return NextResponse.json({ mode: "apply", ...result, applied });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao importar a planilha.";
    return NextResponse.json({ message }, { status: 422 });
  }
}
