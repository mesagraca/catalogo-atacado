import type { Product } from "@/types/catalog";

export function whatsappUrl(product: Pick<Product, "category" | "name" | "color_name">, quantity?: number) {
  const variation = product.color_name ? `\nVariação: ${product.color_name}` : "";
  const quantityLine = quantity ? `\nQuantidade: ${quantity}` : "";
  const message = `Olá! Tenho interesse no catálogo de atacado Mesa & Graça.\n\nProduto: ${product.name}\nCategoria: ${product.category}${variation}${quantityLine}\n\nGostaria de confirmar disponibilidade, pedido mínimo e prazo.`;
  return `https://wa.me/5511977007234?text=${encodeURIComponent(message)}`;
}
