/**
 * Utilitário para padronização visual e semântica de badges de status de pedidos.
 *
 * @description
 * Mapeia os status oficiais da Tray Commerce e marketplaces parceiros (Shopee, Mercado Livre, TikTok Shop)
 * para uma paleta de cores consistente e com significado operacional claro no e-commerce:
 * - A Enviar / Aguardando Envio: Âmbar / Laranja (Ação requerida da expedição)
 * - Enviado / Em Transporte: Azul / Índigo (Em trânsito / Transportadora)
 * - Finalizado / Entregue: Verde Esmeralda (Sucesso concluído)
 * - Aguardando Pagamento / Pendente: Amarelo (Aguardando cliente)
 * - Compra em Análise: Roxo (Antifraude / Gateway)
 * - Cancelado: Rosa / Vermelho (Interrompido)
 *
 * @category Orders
 * @since v21.0.0
 */

export interface OrderStatusBadgeConfig {
  label: string;
  badgeClass: string;
  dotClass: string;
  icon?: string;
  description: string;
}

/**
 * Retorna a configuração visual completa para um determinado status de pedido.
 *
 * @param {string | undefined | null} rawStatus - O status retornado pela Tray ou canais de venda
 * @returns {OrderStatusBadgeConfig} Configuração visual para classes Tailwind, ícone e semântica
 * @example
 * const badge = getOrderStatusBadge("A enviar");
 * // Retorna badge com estilo âmbar e indicador operacional de separação pendente
 */
export function getOrderStatusBadge(rawStatus?: string | null): OrderStatusBadgeConfig {
  const s = (rawStatus || "").trim().toLowerCase();

  // 1. A Enviar / Aguardando Envio / Expedição Pendente (Ação Requerida da Loja)
  if (
    s.includes("a enviar") ||
    s.includes("aguardando envio") ||
    s.includes("pronto para envio") ||
    s.includes("a despachar") ||
    s.includes("separacao") ||
    s.includes("separação")
  ) {
    return {
      label: rawStatus || "A Enviar",
      badgeClass: "bg-amber-50 text-amber-900 border-amber-300/80 shadow-2xs",
      dotClass: "bg-amber-500",
      icon: "📦",
      description: "Pagamento aprovado. Requer embalo e envio imediato pela expedição.",
    };
  }

  // 2. Enviado / Em Trânsito / Em Monitoramento
  if (
    s.includes("enviado") ||
    s.includes("em transporte") ||
    s.includes("em trânsito") ||
    s.includes("em transito") ||
    s.includes("monitoramento") ||
    s.includes("despachado")
  ) {
    return {
      label: rawStatus || "Enviado",
      badgeClass: "bg-sky-50 text-sky-900 border-sky-300/80 shadow-2xs",
      dotClass: "bg-sky-500",
      icon: "🚚",
      description: "Pacote despachado e em rota de entrega com a transportadora.",
    };
  }

  // 3. Finalizado / Entregue / Concluído com Sucesso
  if (
    s.includes("finalizado") ||
    s.includes("entregue") ||
    s.includes("concluido") ||
    s.includes("concluído")
  ) {
    return {
      label: rawStatus || "Finalizado",
      badgeClass: "bg-emerald-50 text-emerald-900 border-emerald-300/80 shadow-2xs",
      dotClass: "bg-emerald-500",
      icon: "✅",
      description: "Entrega confirmada e ciclo da compra concluído com sucesso.",
    };
  }

  // 4. Aguardando Pagamento / Pendente / Aguardando Gateway
  if (
    s.includes("aguardando pagamento") ||
    s.includes("aguardando vindi") ||
    s.includes("aguardando") ||
    s.includes("pendente") ||
    s.includes("não pago") ||
    s.includes("nao pago")
  ) {
    return {
      label: rawStatus || "Aguardando Pagamento",
      badgeClass: "bg-yellow-50 text-yellow-950 border-yellow-300/80 shadow-2xs",
      dotClass: "bg-yellow-500",
      icon: "⏳",
      description: "Aguardando confirmação de pagamento do PIX, boleto ou cartão pelo cliente.",
    };
  }

  // 5. Compra em Análise / Análise Antifraude
  if (s.includes("analise") || s.includes("análise") || s.includes("antifraude")) {
    return {
      label: rawStatus || "Em Análise",
      badgeClass: "bg-purple-50 text-purple-900 border-purple-300/80 shadow-2xs",
      dotClass: "bg-purple-500",
      icon: "🛡️",
      description: "Pedido em análise de risco ou validação pelo intermediador de pagamento.",
    };
  }

  // 6. Cancelado / Cancelado Automático / Estornado
  if (
    s.includes("cancelado") ||
    s.includes("cancelado aut") ||
    s.includes("devolvido") ||
    s.includes("estornado") ||
    s.includes("rejeitado")
  ) {
    return {
      label: rawStatus || "Cancelado",
      badgeClass: "bg-rose-50 text-rose-800 border-rose-300/80 shadow-2xs",
      dotClass: "bg-rose-500",
      icon: "❌",
      description: "Pedido cancelado, pagamento não concluído ou cancelado pelo cliente.",
    };
  }

  // 7. Padrão / Neutro
  return {
    label: rawStatus || "Desconhecido",
    badgeClass: "bg-stone-100 text-stone-800 border-stone-200 shadow-2xs",
    dotClass: "bg-stone-400",
    icon: "📋",
    description: "Status informativo da plataforma.",
  };
}
