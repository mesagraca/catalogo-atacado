import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mesa & Graça | Catálogo Atacado",
  description: "Vitrine de atacado Mesa & Graça: jogos americanos e porta-guardanapos.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
