"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FEATURED_PRODUCTS,
  type Product,
  type Variation,
} from "@/types/catalog";
import { supabase } from "@/lib/supabase";
import { whatsappUrl } from "@/lib/whatsapp";
import { ProductCard } from "./product-card";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import {
  ArrowUpRightIcon,
  MinusIcon,
  PlusIcon,
  WhatsAppIcon,
} from "./ui-icons";

const money = (value: number | null) =>
  value == null
    ? "Sob consulta"
    : new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);

export function ProductPageClient({
  id,
  initialProduct,
  initialCatalog,
}: {
  id: string;
  initialProduct?: Product | null;
  initialCatalog?: Product[];
}) {
  const [product, setProduct] = useState<Product | null>(
    initialProduct ?? FEATURED_PRODUCTS.find((item) => item.id === id) ?? null,
  );
  const [loading, setLoading] = useState(!initialProduct && !product);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(
    initialCatalog && initialCatalog.length > 0 ? initialCatalog : FEATURED_PRODUCTS,
  );
  const [variation, setVariation] = useState<Variation | undefined>(
    (initialProduct ?? product)?.variations?.[0],
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<"studio" | "editorial">("studio");
  const [editorialImage, setEditorialImage] = useState<string | null>(
    (initialProduct ?? product)?.editorial_image_url ?? null,
  );
  const [zoomPosition, setZoomPosition] = useState("50% 50%");

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      setVariation(initialProduct.variations?.[0]);
      setEditorialImage(initialProduct.editorial_image_url ?? null);
      if (initialCatalog && initialCatalog.length > 0) {
        setCatalogProducts(initialCatalog);
      }
      setLoading(false);
      return;
    }

    // Fallback no client caso a página seja montada sem SSR props
    fetch(`/api/produtos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          const p = data.product;
          const mapped: Product = {
            id: p.sync_control?.catalog_product_id || p.id,
            name: p.general?.name || p.name,
            category: p.general?.category || p.category,
            sku: p.general?.sku || p.sku,
            tray_id: p.sync_control?.tray_product_id ?? p.tray_id ?? null,
            collection: p.general?.collection ?? p.collection ?? null,
            color_name: p.general?.color_name ?? p.color_name ?? null,
            color_hex: p.general?.color_hex ?? p.color_hex ?? null,
            retail_price: p.pricing?.price ?? p.retail_price ?? null,
            wholesale_price: p.pricing?.wholesale_price ?? p.wholesale_price ?? null,
            image_url: p.media?.images?.find((img: any) => img.is_cover)?.url_webp || p.media?.images?.[0]?.url_webp || p.media?.images?.[0]?.url || null,
            editorial_image_url: p.media?.images?.find((img: any) => !img.is_cover)?.url_webp || p.media?.images?.[1]?.url_webp || null,
            description: p.general?.description || p.general?.short_description || "",
            image_status: "final",
            sort_order: p.sort_order ?? 0,
            is_visible: p.general?.active ?? true,
            kit_quantity: p.kit_quantity ?? null,
            game_items: p.game_items,
            variations: p.variants,
          };
          setProduct(mapped);
          setVariation(mapped.variations?.[0]);
          setEditorialImage(mapped.editorial_image_url ?? null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, initialProduct, initialCatalog]);

  if (loading)
    return (
      <main className="product-page-shell">
        <div className="product-page-skeleton" />
      </main>
    );
  if (!product)
    return (
      <main className="product-page-shell">
        <section className="product-not-found">
          <p className="eyebrow">CATÁLOGO ATACADO</p>
          <h1>Produto não encontrado.</h1>
          <Link href="/catalogo">Voltar ao catálogo</Link>
        </section>
      </main>
    );
  const selectedName = variation
    ? `${variation.pattern === "xadrez" ? "Xadrez" : "Liso"} ${variation.name}`
    : product.color_name;
  const href = whatsappUrl({ ...product, color_name: selectedName }, quantity);
  const groups = ["xadrez", "liso"] as const;
  const related = catalogProducts
    .filter((item) => item.id !== product.id)
    .sort(
      (a, b) =>
        Number(b.collection === product.collection) -
          Number(a.collection === product.collection) ||
        Number(b.category === product.category) -
          Number(a.category === product.category) ||
        a.sort_order - b.sort_order,
    )
    .slice(0, 3);
  const hasColorInfo =
    Boolean(product.variations?.length) || Boolean(product.color_name);
  return (
    <>
      <SiteHeader products={catalogProducts} />
      <main className="product-page-shell">
      <nav className="breadcrumb" aria-label="Navegação estrutural">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/catalogo">Catálogo</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>
      <article className="product-page">
        <section className="product-page-image">
          {product.image_url ? (
            <><div className="product-zoom" onMouseMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setZoomPosition(`${((event.clientX - rect.left) / rect.width) * 100}% ${((event.clientY - rect.top) / rect.height) * 100}%`); }} onMouseLeave={() => setZoomPosition("50% 50%")}><img style={{ transformOrigin: zoomPosition }} src={activeImage === "editorial" && editorialImage ? editorialImage : product.image_url} alt={activeImage === "editorial" ? `Produto ${product.name} em uso` : product.name} onError={() => { if (activeImage === "editorial") { setEditorialImage(null); setActiveImage("studio"); } }} /></div>{editorialImage && <div className="product-image-gallery"><button className={activeImage === "studio" ? "selected" : ""} onClick={() => setActiveImage("studio")} aria-label="Ver foto do produto"><img src={product.image_url} alt="" /></button><button className={activeImage === "editorial" ? "selected" : ""} onClick={() => setActiveImage("editorial")} aria-label="Ver foto editorial"><img src={editorialImage} alt="" onError={() => setEditorialImage(null)} /></button></div>}</>
          ) : (
            <div className="image-placeholder">Imagem em atualização</div>
          )}
        </section>
        <section className="product-page-info">
          <p className="eyebrow">{product.collection || product.category}</p>
          <h1>{product.name}</h1>
          {product.game_items?.length ? (
            <section className="product-page-game-prices">
              <span>Jogo completo · atacado por item</span>
              {product.game_items.map((item) => (
                <p key={item.label}><small>{item.label}{item.retail_price != null && <> <s>{money(item.retail_price)}</s></>}</small><b>{money(item.wholesale_price)}</b></p>
              ))}
            </section>
          ) : (
            <div className="product-page-price">
              <span>{product.wholesale_price == null ? "Preço" : product.kit_quantity ? "Atacado por unidade" : "Preço atacado"}</span>
              <strong>{money(product.wholesale_price)}</strong>
              {product.retail_price != null && (
                <small>
                  Varejo: <s>{money(product.retail_price)}</s>
                </small>
              )}
            </div>
          )}
          {product.kit_quantity && (
            <p className="product-page-kit-note">
              <b>Venda em kit com {product.kit_quantity} unidades.</b> O valor exibido é por peça.
            </p>
          )}
          {hasColorInfo &&
            (product.variations?.length ? (
              <section className="product-page-variations">
                <b>Escolha a variação</b>
                {groups.map((pattern) => {
                  const items =
                    product.variations?.filter(
                      (item) => item.pattern === pattern,
                    ) ?? [];
                  return items.length ? (
                    <div className="product-page-option-row" key={pattern}>
                      <span>{pattern === "xadrez" ? "Xadrez" : "Liso"}</span>
                      <div className="product-page-options">
                        {items.map((item) => (
                          <button
                            className={`product-page-swatch ${pattern} ${variation?.name === item.name && variation.pattern === item.pattern ? "selected" : ""}`}
                            style={
                              { "--swatch": item.hex } as React.CSSProperties
                            }
                            onClick={() => setVariation(item)}
                            key={`${pattern}-${item.name}`}
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })}
              </section>
            ) : (
              <section className="product-page-variations">
                <b>Cor disponível</b>
                <p className="product-page-color">
                  {product.color_hex && (
                    <i style={{ backgroundColor: product.color_hex }} />
                  )}{" "}
                  {product.color_name}
                </p>
              </section>
            ))}
          <section className="product-page-details" aria-label="Características do produto">
            <div>
              <b>Características</b>
              <p>{product.description ?? "—"}</p>
            </div>
            <div>
              <b>Materiais</b>
              <dl>
                {(product.materials?.length ? product.materials : [{ label: "Material", value: "—" }]).map((material) => (
                  <div key={material.label}><dt>{material.label}</dt><dd>{material.value || "—"}</dd></div>
                ))}
              </dl>
            </div>
            <div>
              <b>Medidas</b>
              <dl>
                {(product.dimensions?.length ? product.dimensions : [{ label: "Medidas", value: "—" }]).map((dimension) => (
                  <div key={dimension.label}><dt>{dimension.label}</dt><dd>{dimension.value || "—"}</dd></div>
                ))}
              </dl>
            </div>
          </section>
          <div className="product-page-quantity">
            <span>{product.kit_quantity ? "Quantidade de kits" : "Quantidade"}</span>
            <div>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Diminuir quantidade"
              >
                <MinusIcon />
              </button>
              <strong>{quantity}</strong>
              <button
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Aumentar quantidade"
              >
                <PlusIcon />
              </button>
            </div>
          </div>
          <a
            className="product-page-action"
            target="_blank"
            rel="noreferrer"
            href={href}
          >
            <WhatsAppIcon /> Solicitar pelo WhatsApp
          </a>
          <p className="product-page-note">
            Pedido sem checkout. Nossa equipe confirma disponibilidade, mínimo e
            prazo.
          </p>
        </section>
      </article>
      <section className="product-page-reference">
        <p className="eyebrow">REFERÊNCIA VISUAL</p>
        <p>
          As imagens apresentam a peça em uso. As cores e os acabamentos podem
          variar conforme a tela.
        </p>
      </section>
      {related.length > 0 && (
        <section className="related-products">
          <div className="related-heading">
            <div>
              <p className="eyebrow">CONTINUE EXPLORANDO</p>
              <h2>Produtos relacionados</h2>
            </div>
            <Link href="/catalogo">
              Ver catálogo completo <ArrowUpRightIcon />
            </Link>
          </div>
          <div className="related-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
      <SiteFooter />
      </main>
    </>
  );
}
