"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product, Variation } from "@/types/catalog";
import { ArrowUpRightIcon, BagIcon, WhatsAppIcon } from "./ui-icons";
import { whatsappUrl } from "@/lib/whatsapp";

const money = (value: number | null) =>
  value == null
    ? "Sob consulta"
    : new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
function Swatch({
  variation,
  selected,
  onClick,
}: {
  variation: Variation;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`swatch ${variation.pattern} ${selected ? "selected" : ""}`}
      onClick={onClick}
      title={`${variation.pattern} ${variation.name}`}
      aria-label={`${variation.pattern} ${variation.name}`}
      style={{ "--swatch": variation.hex } as React.CSSProperties}
    />
  );
}

import { useWholesaleCart } from "@/context/wholesale-cart-context";

export function ProductCard({
  product,
  print = false,
}: {
  product: Product;
  print?: boolean;
}) {
  const { addItem } = useWholesaleCart();
  const [selected, setSelected] = useState<Variation | undefined>(
    product.variations?.[0],
  );
  const [editorialImage, setEditorialImage] = useState(
    product.editorial_image_url ?? null,
  );
  const variations = product.variations ?? [];
  const visibleVariations = variations.slice(0, 6);
  const productUrl = `/catalogo/${product.id}`;
  const hasColorInfo = variations.length > 0 || Boolean(product.color_name);
  const isGame = Boolean(product.game_items?.length);
  const whatsappHref = whatsappUrl(
    {
      ...product,
      color_name: selected
        ? `${selected.pattern === "xadrez" ? "Xadrez" : "Liso"} ${selected.name}`
        : product.color_name,
    },
    1,
  );
  const discount =
    product.retail_price != null &&
    product.wholesale_price != null &&
    product.retail_price > product.wholesale_price
      ? Math.round((1 - product.wholesale_price / product.retail_price) * 100)
      : null;
  return (
    <article className="product-card">
      <Link
        className={`product-image product-open ${editorialImage ? "has-editorial" : ""}`}
        href={productUrl}
        aria-label={`Ver ${product.name}`}
      >
        {product.image_url ? (
          <img
            className="product-image-main"
            src={product.image_url}
            alt={product.name}
            loading={print ? "eager" : "lazy"}
            decoding={print ? "sync" : "async"}
          />
        ) : (
          <div className="image-placeholder">Imagem em atualização</div>
        )}
        {editorialImage && (
          <img
            className="product-image-editorial"
            src={editorialImage}
            alt={`Produto ${product.name} em uso`}
            loading={print ? "eager" : "lazy"}
            decoding={print ? "sync" : "async"}
            onError={() => setEditorialImage(null)}
          />
        )}
        <span>Ver produto</span>
      </Link>
      <div className="product-info">
        <div className="product-topline">
          <span>{product.collection || product.category}</span>
        </div>
        <h3>{product.name}</h3>
        {isGame ? (
          <div className="game-price-list" aria-label="Valores por item do jogo">
            <span>Jogo completo · preços por item</span>
            {product.game_items!.map((item) => (
              <p key={item.label}><small>{item.label}{item.retail_price != null && <> <s>{money(item.retail_price)}</s></>}</small><b>{money(item.wholesale_price)}</b></p>
            ))}
          </div>
        ) : (
          <div className="product-commerce">
            <div>
              <span>{product.wholesale_price == null ? "Preço" : product.kit_quantity ? "Atacado por unidade" : "Preço atacado"}</span>
              <strong>{money(product.wholesale_price)}</strong>
            </div>
            {product.retail_price != null && (
              <div className="price-comparison">
                <small>
                  Varejo <s>{money(product.retail_price)}</s>
                </small>
                {discount != null && <b>{discount}% OFF</b>}
              </div>
            )}
          </div>
        )}
        {product.kit_quantity && (
          <p className="kit-unit-note">
            Kit com {product.kit_quantity} unidades · valor por peça
          </p>
        )}
        {hasColorInfo && (
          <>
            <div className="product-divider" />
            {variations.length > 0 ? (
              <div className="variation-picker">
                <span>Variações no mesmo preço</span>
                <div className="swatch-row">
                  {visibleVariations.map((v) => (
                    <Swatch
                      key={`${v.pattern}-${v.name}`}
                      variation={v}
                      selected={
                        selected?.name === v.name &&
                        selected?.pattern === v.pattern
                      }
                      onClick={() => setSelected(v)}
                    />
                  ))}
                  {variations.length > visibleVariations.length && (
                    <Link
                      className="more-swatches"
                      href={productUrl}
                      aria-label={`Ver mais ${variations.length - visibleVariations.length} variações`}
                    >
                      +{variations.length - visibleVariations.length}
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="variation-picker single-color">
                <span>Cor disponível</span>
                <p>
                  {product.color_hex && (
                    <i style={{ backgroundColor: product.color_hex }} />
                  )}{" "}
                  {product.color_name}
                </p>
              </div>
            )}
          </>
        )}
        <div className="card-bottom">
          {!print && (
            <div className="card-actions">
              <Link className="product-cta" href={productUrl}>
                Ver produto <ArrowUpRightIcon />
              </Link>
              <button
                type="button"
                className="product-add-cart-btn"
                onClick={() => addItem(product, selected, 1)}
                title="Adicionar à sacola de pedido de atacado"
                aria-label={`Adicionar ${product.name} ao pedido`}
              >
                <BagIcon /> + Adicionar ao pedido
              </button>
              <a
                className="product-whatsapp"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                title="Pedir direto no WhatsApp"
                aria-label={`Pedir ${product.name} no WhatsApp`}
              >
                <WhatsAppIcon /> Pedir avulso no WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
