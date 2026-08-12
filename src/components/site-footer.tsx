import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { WhatsAppIcon } from "./ui-icons";

export function SiteFooter() {
  return <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><Link href="/catalogo" aria-label="Mesa & Graça"><BrandLogo /></Link><p>Peças autorais para mesas que recebem com beleza e afeto.</p></div><div className="footer-catalog"><span>Catálogo</span><Link href="/catalogo">Todos os produtos</Link><Link href="/catalogo">Jogos americanos</Link><Link href="/catalogo">Porta-guardanapos</Link></div><div className="footer-contact"><span>Atendimento para atacado</span><strong>Monte seu pedido<br />com a nossa equipe.</strong><a href="https://wa.me/5511977007234" target="_blank" rel="noreferrer"><WhatsAppIcon /> Chamar no WhatsApp</a></div></div><div className="footer-bottom"><small>© {new Date().getFullYear()} Mesa & Graça</small><small>Catálogo de atacado · pedidos sob consulta</small></div></footer>;
}
