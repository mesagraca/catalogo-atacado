import type { Product } from "@/types/catalog";

export function whatsappUrl(
  product: Pick<Product, "category" | "name" | "color_name" | "kit_quantity" | "game_items">,
  quantity?: number,
) {
  const details = [
    `*Produto:* ${product.name}`,
    product.color_name ? `*Variação:* ${product.color_name}` : null,
    product.kit_quantity
      ? `*Kits:* ${quantity ?? 1} (com ${product.kit_quantity} unidades cada)`
      : quantity
        ? `*Quantidade:* ${quantity}`
        : null,
    product.game_items?.length
      ? `*Composição:* ${product.game_items.map((item) => item.label).join(", ")}`
      : null,
  ].filter(Boolean);
  const message = `Olá! Quero pedir este item do atacado Mesa & Graça 😊\n\n${details.join("\n")}\n\nPode me confirmar a disponibilidade e o prazo, por favor?`;

  return `https://wa.me/5511977007234?text=${encodeURIComponent(message)}`;
}
