import Link from "next/link";

export function CollectionHeader({ title, imageUrl }: { title: string; imageUrl: string }) {
  return (
    <section className="collection-header">
      <nav className="breadcrumb" aria-label="Navegação estrutural">
        <Link href="/">Início</Link>
        <span aria-hidden="true">/</span>
        <span>{title}</span>
      </nav>
      <div className="collection-hero" style={{ backgroundImage: `url("${imageUrl}")` }}>
        <div><p className="eyebrow">CATÁLOGO ATACADO</p><h1>{title}</h1></div>
      </div>
    </section>
  );
}
