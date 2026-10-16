import type { Metadata } from "next";
import { FEATURED_PRODUCTS } from "@/types/catalog";
import { ProductPageClient } from "@/components/product-page-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = FEATURED_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Produto não encontrado | Mesa & Graça",
    };
  }

  return {
    title: `${product.name} | Catálogo Atacado Mesa & Graça`,
    description:
      product.description ??
      `Confira ${product.name} no catálogo atacado Mesa & Graça.`,
    alternates: {
      canonical: `/catalogo/${product.id}`,
      types: {
        "application/json": `/api/catalogo/${product.id}`,
      },
    },
    other: {
      "product:id": product.id,
      "product:sku": product.sku ?? "",
      "product:tray_id": product.tray_id ? String(product.tray_id) : "",
      "product:category": product.category,
      "product:collection": product.collection ?? "",
      "product:api_url": `/api/catalogo/${product.id}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = FEATURED_PRODUCTS.find((p) => p.id === id);

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        sku: product.sku,
        productID: product.id,
        category: product.category,
        image: [
          product.image_url
            ? `https://catalogo.mesaegraca.com.br${product.image_url}`
            : null,
          product.editorial_image_url
            ? `https://catalogo.mesaegraca.com.br${product.editorial_image_url}`
            : null,
        ].filter(Boolean),
        description: product.description,
        brand: {
          "@type": "Brand",
          name: "Mesa & Graça",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "BRL",
          price: product.wholesale_price ?? product.retail_price ?? undefined,
          availability: "https://schema.org/InStock",
        },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "tray_id",
            value: product.tray_id ?? null,
          },
          {
            "@type": "PropertyValue",
            name: "api_endpoint",
            value: `https://catalogo.mesaegraca.com.br/api/catalogo/${product.id}`,
          },
          ...(product.game_items?.map((item) => ({
            "@type": "PropertyValue",
            name: `item_${item.label.toLowerCase().replace(/\s+/g, "_")}`,
            value: `Atacado: R$ ${item.wholesale_price}`,
          })) ?? []),
        ],
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductPageClient id={id} />
    </>
  );
}
