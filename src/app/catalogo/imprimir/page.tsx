"use client";
import Link from "next/link";
import { CatalogClient } from "@/components/catalog-client";
export default function PrintPage(){return <><div className="print-toolbar"><Link href="/catalogo">← Voltar ao catálogo</Link><button onClick={()=>window.print()}>Exportar / Salvar PDF</button></div><CatalogClient print/></>}
