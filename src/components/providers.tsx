"use client";

import React, { type ReactNode } from "react";
import { WholesaleCartProvider } from "@/context/wholesale-cart-context";
import { WholesaleCartDrawer } from "./wholesale-cart-drawer";
import { WholesaleCartFloatButton } from "./wholesale-cart-float-button";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WholesaleCartProvider>
      {children}
      <WholesaleCartFloatButton />
      <WholesaleCartDrawer />
    </WholesaleCartProvider>
  );
}
