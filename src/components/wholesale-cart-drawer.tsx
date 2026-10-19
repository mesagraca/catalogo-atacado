"use client";

import React from "react";
import Link from "next/link";
import { useWholesaleCart } from "@/context/wholesale-cart-context";
import { MinusIcon, PlusIcon, TrashIcon, WhatsAppIcon } from "./ui-icons";

const money = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v);

export function WholesaleCartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    clearCart,
    totalPieces,
    totalValue,
    checkoutWhatsApp,
  } = useWholesaleCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="cart-backdrop" onClick={closeDrawer} role="dialog" aria-modal="true" aria-label="Sacola de Pedido de Atacado">
      <aside
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Itens do Pedido de Atacado"
      >
        <header className="cart-header">
          <div className="cart-header-title">
            <h2>Pedido de Atacado</h2>
            <span className="cart-badge">{totalPieces} {totalPieces === 1 ? "peça" : "peças"}</span>
          </div>
          <button
            type="button"
            className="cart-close-btn"
            onClick={closeDrawer}
            aria-label="Fechar sacola"
          >
            ✕
          </button>
        </header>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p className="cart-empty-title">Sua lista de pedido está vazia.</p>
            <p className="cart-empty-desc">
              Navegue pelos produtos e adicione os itens desejados para montar seu orçamento completo.
            </p>
            <button
              type="button"
              className="cart-browse-btn"
              onClick={closeDrawer}
            >
              Continuar olhando produtos
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {items.map((item) => {
                const subtotal = item.unitPrice * item.quantity;
                const varLabel = item.variation
                  ? `${item.variation.pattern === "xadrez" ? "Xadrez" : "Liso"} ${item.variation.name}`
                  : item.product.color_name;

                return (
                  <article key={item.id} className="cart-item">
                    <div className="cart-item-thumb">
                      {item.product.image_url ? (
                        <img src={item.product.image_url} alt={item.product.name} />
                      ) : (
                        <div className="cart-item-placeholder">Sem foto</div>
                      )}
                    </div>

                    <div className="cart-item-details">
                      <div className="cart-item-head">
                        <Link
                          href={`/catalogo/${item.product.id}`}
                          onClick={closeDrawer}
                          className="cart-item-name"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          type="button"
                          className="cart-item-remove"
                          onClick={() => removeItem(item.id)}
                          title="Remover do pedido"
                          aria-label={`Remover ${item.product.name} do pedido`}
                        >
                          <TrashIcon />
                        </button>
                      </div>

                      {varLabel && (
                        <div className="cart-item-var">
                          {item.variation?.hex && (
                            <span
                              className="cart-item-swatch"
                              style={{ backgroundColor: item.variation.hex }}
                            />
                          )}
                          <span>{varLabel}</span>
                        </div>
                      )}

                      <div className="cart-item-pricing">
                        <small className="cart-item-unit">
                          {money(item.unitPrice)} un
                        </small>
                        <strong className="cart-item-subtotal">
                          {money(subtotal)}
                        </strong>
                      </div>

                      <div className="cart-item-actions">
                        <div className="cart-qty-control">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Diminuir quantidade"
                          >
                            <MinusIcon />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Aumentar quantidade"
                          >
                            <PlusIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <footer className="cart-footer">
              <div className="cart-summary">
                <div className="cart-summary-row">
                  <span>Itens no pedido:</span>
                  <strong>{totalPieces} unidade(s)</strong>
                </div>
                <div className="cart-summary-row total">
                  <span>Total Estimado:</span>
                  <strong className="cart-total-value">{money(totalValue)}</strong>
                </div>
                <p className="cart-disclaimer">
                  * Os valores de atacado são válidos conforme condições comerciais Mesa &amp; Graça.
                </p>
              </div>

              <div className="cart-cta-group">
                <button
                  type="button"
                  className="cart-checkout-btn"
                  onClick={checkoutWhatsApp}
                >
                  <WhatsAppIcon /> Enviar Pedido no WhatsApp
                </button>
                <button
                  type="button"
                  className="cart-clear-btn"
                  onClick={clearCart}
                >
                  Limpar lista
                </button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
