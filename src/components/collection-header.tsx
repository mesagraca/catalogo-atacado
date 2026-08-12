import Link from "next/link";

export function CollectionHeader({ title }: { title: string }) {
  return (
    <section className="collection-header">
      <nav className="breadcrumb" aria-label="Navegação estrutural">
        <Link href="/">Início</Link>
        <span aria-hidden="true">/</span>
        <span>{title}</span>
      </nav>
      <p className="eyebrow">CATÁLOGO ATACADO</p>
      <h1>{title}</h1>
    </section>
  );
}
