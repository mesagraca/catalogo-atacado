import type { Metadata } from "next";
import { Allura, Outfit } from "next/font/google";
import "./globals.css";

const allura = Allura({ weight: "400", subsets: ["latin"], variable: "--font-allura", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "Mesa & Graça | Catálogo Atacado",
  description: "Vitrine de atacado Mesa & Graça: jogos americanos e porta-guardanapos.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${allura.variable} ${outfit.variable}`}>{children}</body></html>;
}
