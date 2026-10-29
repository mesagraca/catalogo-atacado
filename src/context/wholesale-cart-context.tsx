"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import type { Product, Variation } from "@/types/catalog";

export interface WholesaleCartItem {
  id: string;
  product: Product;
  variation?: Variation;
  quantity: number;
  unitPrice: number;
}

interface WholesaleCartContextType {
  items: WholesaleCartItem[];
  addItem: (product: Product, variation?: Variation, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  changeItemVariation: (id: string, newVariation: Variation) => void;
  clearCart: () => void;
  totalPieces: number;
  totalValue: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  checkoutWhatsApp: () => void;
}

const WholesaleCartContext = createContext<WholesaleCartContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "mesaegraca_wholesale_cart_v1";

export function WholesaleCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WholesaleCartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  // Carregar do localStorage após montagem
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignorar erros de storage
    }
    setHasHydrated(true);
  }, []);

  // Salvar no localStorage a cada alteração
  useEffect(() => {
    if (!hasHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignorar erros de quota
    }
  }, [items, hasHydrated]);

  const addItem = (
    product: Product,
    variation?: Variation,
    quantity: number = 1,
  ) => {
    const varKey = variation
      ? `${variation.pattern || "liso"}-${variation.name || "cor"}-${variation.sku || ""}`
      : "padrao";
    const itemId = `${product.id}::${varKey}`;

    const unitPrice =
      product.wholesale_price != null
        ? Number(product.wholesale_price)
        : product.retail_price != null
          ? Number(product.retail_price)
          : 0;

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          variation,
          quantity,
          unitPrice,
        },
      ];
    });

    setIsDrawerOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(newQuantity, 9999) } : item,
      ),
    );
  };

  const changeItemVariation = (id: string, newVariation: Variation) => {
    setItems((prev) => {
      const currentItemIndex = prev.findIndex((i) => i.id === id);
      if (currentItemIndex === -1) return prev;

      const currentItem = prev[currentItemIndex];
      const newVarKey = `${newVariation.pattern || "liso"}-${newVariation.name || "cor"}-${newVariation.sku || ""}`;
      const newId = `${currentItem.product.id}::${newVarKey}`;

      if (newId === id) return prev;

      const existingTargetIndex = prev.findIndex((i) => i.id === newId);

      if (existingTargetIndex > -1) {
        // Se já existe um item com a variação selecionada, funde as quantidades
        const updated = [...prev];
        updated[existingTargetIndex] = {
          ...updated[existingTargetIndex],
          quantity: updated[existingTargetIndex].quantity + currentItem.quantity,
        };
        // Remove a linha antiga
        return updated.filter((i) => i.id !== id);
      }

      // Senão apenas atualiza a variação e o id preservando a quantidade
      const updated = [...prev];
      updated[currentItemIndex] = {
        ...currentItem,
        id: newId,
        variation: newVariation,
      };
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalPieces = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [items]);

  const checkoutWhatsApp = () => {
    if (items.length === 0) return;

    const moneyFmt = (v: number) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(v);

    const productLines = items.map((item, index) => {
      const varText = item.variation
        ? ` (${item.variation.pattern === "xadrez" ? "Xadrez" : "Liso"} ${item.variation.name})`
        : item.product.color_name
          ? ` (${item.product.color_name})`
          : "";
      const skuText = item.variation?.sku || item.product.sku || "";
      const subtotal = item.unitPrice * item.quantity;

      return `${index + 1}. *${item.product.name}*${varText}\n   • ${item.quantity} un × ${moneyFmt(item.unitPrice)} = *${moneyFmt(subtotal)}*${skuText ? ` [SKU: ${skuText}]` : ""}`;
    });

    const message = [
      "Olá Mesa & Graça! Gostaria de solicitar orçamento para o seguinte pedido de atacado:\n",
      ...productLines,
      "\n📦 *Resumo do Pedido:*",
      `• *Total de Peças:* ${totalPieces} unidade(s)`,
      `• *Valor Estimado:* ${moneyFmt(totalValue)}`,
      "\nPoderiam confirmar a disponibilidade dos itens e o prazo de envio para o meu CEP?",
    ].join("\n");

    const url = `https://wa.me/5511977007234?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <WholesaleCartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        changeItemVariation,
        clearCart,
        totalPieces,
        totalValue,
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        checkoutWhatsApp,
      }}
    >
      {children}
    </WholesaleCartContext.Provider>
  );
}

export function useWholesaleCart() {
  const context = useContext(WholesaleCartContext);
  if (!context) {
    throw new Error(
      "useWholesaleCart deve ser utilizado dentro de WholesaleCartProvider",
    );
  }
  return context;
}
