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
import { useWholesaleCart } from "@/context/wholesale-cart-context";

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
  const { addItem } = useWholesaleCart();
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
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [zoomPosition, setZoomPosition] = useState("50% 50%");

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      setVariation(initialProduct.variations?.[0]);
      setSelectedImageIdx(0);
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
          const allImgs = (p.media?.images || [])
            .map((img: any) => img.url_webp || img.url)
            .filter(Boolean);
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
            gallery_urls: Array.from(new Set(allImgs)),
            description: p.general?.description || p.general?.short_description || p.description || "",
            materials: p.technical_specifications?.materials || p.materials,
            dimensions: p.technical_specifications?.dimensions || p.dimensions,
            image_status: "final",
            sort_order: p.sort_order ?? 0,
            is_visible: p.general?.active ?? true,
            kit_quantity: p.kit_quantity ?? null,
            game_items: p.game_items,
            variations: p.variants,
          };
          setProduct(mapped);
          setVariation(mapped.variations?.[0]);
          setSelectedImageIdx(0);
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
  const hasColorInfo = Boolean(product.variations && product.variations.length > 1);
  const galleryList = Array.from(
    new Set(
      [
        ...(product.gallery_urls ?? []),
        product.image_url,
        product.editorial_image_url,
      ].filter((u): u is string => Boolean(u) && !failedImages[u!]),
    ),
  );
  const currentImageUrl = galleryList[selectedImageIdx] || galleryList[0] || product.image_url;

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
          {currentImageUrl ? (
            <>
              <div
                className="product-zoom"
                onMouseMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  setZoomPosition(
                    `${((event.clientX - rect.left) / rect.width) * 100}% ${((event.clientY - rect.top) / rect.height) * 100}%`,
                  );
                }}
                onMouseLeave={() => setZoomPosition("50% 50%")}
              >
                <img
                  style={{ transformOrigin: zoomPosition }}
                  src={currentImageUrl}
                  alt={`${product.name} - Foto ${selectedImageIdx + 1}`}
                  onError={() => {
                    if (currentImageUrl) {
                      setFailedImages((prev) => ({ ...prev, [currentImageUrl]: true }));
                      setSelectedImageIdx(0);
                    }
                  }}
                />
              </div>
              {galleryList.length > 1 && (
                <div className="product-image-gallery">
                  {galleryList.map((imgUrl, idx) => (
                    <button
                      key={imgUrl}
                      className={selectedImageIdx === idx ? "selected" : ""}
                      onClick={() => setSelectedImageIdx(idx)}
                      aria-label={`Ver foto ${idx + 1} do produto`}
                    >
                      <img
                        src={imgUrl}
                        alt=""
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [imgUrl]: true }))
                        }
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="image-placeholder">Imagem em atualização</div>
          )}
        </section>
        <section className="product-page-info">
          <p className="eyebrow">{product.collection || product.category}</p>
          <h1>{product.name}</h1>
          {(product.sku || product.id) && (
            <div className="product-page-sku-wrapper">
              <span className="product-ref-code" title={`Código de referência: ${product.sku || product.id}`}>
                REF: {product.sku ? product.sku.replace(/^MG-/, "") : product.id.slice(0, 8)}
              </span>
            </div>
          )}
                    {/* Bloco Universal de Preco (Avulsos e Kits) */}
          <div className="product-page-price">
            <div className="price-main-row">
              <div>
                <span>
                  {product.game_items?.length
                    ? "Total atacado"
                    : product.kit_quantity
                    ? "Atacado por unidade"
                    : product.wholesale_price == null
                    ? "Preço"
                    : "Preço atacado"}
                </span>
                <div className="wholesale-price-row">
                  <strong>{money(product.wholesale_price)}</strong>
                  {product.wholesale_price &&
                    product.retail_price &&
                    product.retail_price > product.wholesale_price && (
                      <span className="discount-pill">
                        {Math.round(
                          (1 - product.wholesale_price / product.retail_price) * 100,
                        )}
                        % OFF
                      </span>
                    )}
                </div>
              </div>
            </div>
            {product.retail_price != null && (
              <div className="price-comparison-row">
                <small>
                  Preço varejo: <s>{money(product.retail_price)}</s>
                </small>
              </div>
            )}
          </div>

          {/* Discriminacao por peca para Jogos / Kits */}
          {Boolean(product.game_items?.length) && (
            <section className="product-page-game-prices">
              <div className="game-prices-header">
                <span>Jogo completo · discriminação por peça</span>
              </div>
              <div className="game-items-table">
                {product.game_items!.map((item) => {
                  const rowContent = (
                    <>
                      <span className="game-item-label">
                        {item.label}
                        {item.product_id && (
                          <span className="game-item-link-badge" aria-hidden="true">
                            Ver avulso ↗
                          </span>
                        )}
                      </span>
                      <div className="game-item-values">
                        {item.retail_price != null && (
                          <s className="game-item-retail">
                            {money(item.retail_price)}
                          </s>
                        )}
                        <b className="game-item-wholesale">
                          {money(item.wholesale_price)}
                        </b>
                      </div>
                    </>
                  );

                  return item.product_id ? (
                    <Link
                      className="game-item-row game-item-row-link"
                      href={`/catalogo/${item.product_id}`}
                      key={item.label}
                      title={`Ver ${item.label} avulso`}
                    >
                      {rowContent}
                    </Link>
                  ) : (
                    <div className="game-item-row" key={item.label}>
                      {rowContent}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          {product.kit_quantity && (
            <p className="product-page-kit-note">
              <b>Venda em kit com {product.kit_quantity} unidades.</b> O valor exibido é por peça.
            </p>
          )}
          {hasColorInfo && (
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
          )}
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
          <div className="product-page-cta-group">
            <button
              type="button"
              className="product-page-add-cart-btn"
              onClick={() => addItem(product, variation, quantity)}
            >
              + Adicionar ao Pedido ({quantity} {quantity === 1 ? "unidade" : "unidades"})
            </button>
            <a
              className="product-page-action"
              target="_blank"
              rel="noreferrer"
              href={href}
              title="Pedir apenas este item agora no WhatsApp"
            >
              <WhatsAppIcon /> Pedir avulso no WhatsApp
            </a>
          </div>
          <p className="product-page-note">
            Monte seu pedido de atacado com múltiplas peças ou chame direto para um item avulso.
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
