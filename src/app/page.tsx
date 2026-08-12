import Link from "next/link";

export default function Home() {
  return <main className="cover-page">
    <i className="botanical botanical-top" aria-hidden="true">✦</i>
    <div className="cover-content">
      <p className="eyebrow">CATÁLOGO ATACADO</p><h1>Mesa<span>&amp;</span>Graça</h1><div className="cover-rule" />
      <p className="cover-subtitle">Jogos americanos · Porta-guardanapos · Coleções especiais</p>
      <Link className="cover-link" href="/catalogo">Abrir catálogo</Link>
      <p className="cover-note">Vitrine B2B · Pedidos sob consulta</p>
    </div><i className="botanical botanical-bottom" aria-hidden="true">✦</i>
  </main>;
}
