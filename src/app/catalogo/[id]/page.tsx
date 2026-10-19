import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUIProductById, getUIProducts } from "@/lib/catalog-db";
import { ProductPageClient } from "@/components/product-page-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getUIProductById(id);

  if (!product) {
    return {
      title: "Produto não encontrado | Mesa & Graça",
    };
  }

  const coverImage = product.image_url
    ? (product.image_url.startsWith("http")
        ? product.image_url
        : `https://catalogo.mesaegraca.com.br${product.image_url}`)
    : "https://catalogo.mesaegraca.com.br/banner-catalogo.jpg";

  const priceText = product.wholesale_price
    ? `R$ ${product.wholesale_price.toFixed(2).replace(".", ",")}`
    : "";

  const title = `${product.name} ${priceText ? `(Atacado: ${priceText})` : ""} | Mesa & Graça`;
  const desc =
    product.description ||
    `Confira ${product.name} no catálogo atacado Mesa & Graça com condições exclusivas para lojistas.`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `/catalogo/${product.id}`,
      types: {
        "application/json": `/api/catalogo/${product.id}`,
      },
    },
    openGraph: {
      title,
      description: desc,
      url: `https://catalogo.mesaegraca.com.br/catalogo/${product.id}`,
      siteName: "Mesa & Graça — Catálogo Atacado",
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [coverImage],
    },
    other: {
      "product:id": product.id,
      "product:sku": product.sku ?? "",
      "product:price:amount": product.wholesale_price ? String(product.wholesale_price) : "",
      "product:price:currency": "BRL",
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
  const [product, catalog] = await Promise.all([
    getUIProductById(id),
    getUIProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    productID: product.id,
    category: product.category,
    image: [
      product.image_url
        ? (product.image_url.startsWith("http")
            ? product.image_url
            : `https://catalogo.mesaegraca.com.br${product.image_url}`)
        : null,
      product.editorial_image_url
        ? (product.editorial_image_url.startsWith("http")
            ? product.editorial_image_url
            : `https://catalogo.mesaegraca.com.br${product.editorial_image_url}`)
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageClient
        id={id}
        initialProduct={product}
        initialCatalog={catalog}
      />
    </>
  );
}
