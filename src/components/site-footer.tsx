import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { ArrowUpRightIcon } from "./ui-icons";

export function SiteFooter() {
  return <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><Link href="/catalogo" aria-label="Mesa & Graça"><BrandLogo /></Link><p>Peças autorais para mesas que recebem com beleza e afeto.</p></div><div className="footer-links"><div><span>Catálogo</span><Link href="/catalogo">Todos os produtos</Link><Link href="/catalogo">Jogos americanos</Link><Link href="/catalogo">Porta-guardanapos</Link></div><div><span>Atendimento</span><a href="https://wa.me/5511977007234" target="_blank" rel="noreferrer">WhatsApp <ArrowUpRightIcon /></a><a href="https://wa.me/5511977007234" target="_blank" rel="noreferrer">Solicitar pedido <ArrowUpRightIcon /></a></div></div></div><div className="footer-bottom"><small>© {new Date().getFullYear()} Mesa & Graça</small><small>Catálogo de atacado · pedidos sob consulta</small></div></footer>;
}
