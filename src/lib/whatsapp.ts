import type { Product } from "@/types/catalog";

export function whatsappUrl(
  product: Pick<Product, "category" | "name" | "color_name">,
  quantity?: number,
) {
  const details = [
    `*Produto:* ${product.name}`,
    product.color_name ? `*Variação:* ${product.color_name}` : null,
    quantity ? `*Quantidade:* ${quantity}` : null,
  ].filter(Boolean);
  const message = `Olá! Quero pedir este item do atacado Mesa & Graça 😊\n\n${details.join("\n")}\n\nPode me confirmar a disponibilidade e o prazo, por favor?`;

  return `https://wa.me/5511977007234?text=${encodeURIComponent(message)}`;
}
