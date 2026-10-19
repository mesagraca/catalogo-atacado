"use client";

import React from "react";
import { useWholesaleCart } from "@/context/wholesale-cart-context";
import { BagIcon } from "./ui-icons";

const money = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v);

export function WholesaleCartFloatButton() {
  const { totalPieces, totalValue, openDrawer, isDrawerOpen } = useWholesaleCart();

  if (totalPieces === 0 || isDrawerOpen) return null;

  return (
    <aside
      className="cart-float-wrapper"
      aria-label="Resumo do pedido de atacado"
    >
      <button
        type="button"
        className="cart-float-btn"
        onClick={openDrawer}
        aria-label={`Ver pedido de atacado com ${totalPieces} peças somando ${money(totalValue)}`}
      >
        <span className="cart-float-icon-wrap">
          <BagIcon className="cart-float-icon" />
          <span className="cart-float-count">{totalPieces}</span>
        </span>
        <span className="cart-float-text">
          <span className="cart-float-label">Ver Pedido</span>
          <strong className="cart-float-val">{money(totalValue)}</strong>
        </span>
      </button>
    </aside>
  );
}
