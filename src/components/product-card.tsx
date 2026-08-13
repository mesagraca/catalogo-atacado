"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product, Variation } from "@/types/catalog";
import { ArrowUpRightIcon } from "./ui-icons";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./ui-icons";

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

export function ProductCard({
  product,
  print = false,
}: {
  product: Product;
  print?: boolean;
}) {
  const [selected, setSelected] = useState<Variation | undefined>(
    product.variations?.[0],
  );
  const variations = product.variations ?? [];
  const visibleVariations = variations.slice(0, 6);
  const productUrl = `/catalogo/${product.id}`;
  const hasColorInfo = variations.length > 0 || Boolean(product.color_name);
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
        className={`product-image product-open ${product.editorial_image_url ? "has-editorial" : ""}`}
        href={productUrl}
        aria-label={`Ver ${product.name}`}
      >
        {product.image_url ? (
          <img
            className="product-image-main"
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="image-placeholder">Imagem em atualização</div>
        )}
        {product.editorial_image_url && <img className="product-image-editorial" src={product.editorial_image_url} alt={`Produto ${product.name} em uso`} loading="lazy" decoding="async" />}
        <span>Ver produto</span>
      </Link>
      <div className="product-info">
        <div className="product-topline">
          <span>{product.collection || product.category}</span>
        </div>
        <h3>{product.name}</h3>
        {product.wholesale_price != null && (
          <div className="product-commerce">
            <div>
              <span>{product.kit_quantity ? "Atacado por unidade" : "Preço atacado"}</span>
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
              <a
                className="product-whatsapp"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon /> Chamar no WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
