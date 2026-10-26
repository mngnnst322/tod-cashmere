"use client";

import { createContext, useContext } from "react";
import { DEFAULT_PRICING, formatMoney, type Pricing } from "@/lib/money";

const PricingContext = createContext<Pricing>(DEFAULT_PRICING);

export function PricingProvider({ pricing, children }: { pricing: Pricing; children: React.ReactNode }) {
  return <PricingContext.Provider value={pricing}>{children}</PricingContext.Provider>;
}

/** Formats tugrik amounts in the visitor's currency (client components). */
export function useMoney() {
  const pricing = useContext(PricingContext);
  return (mnt: number) => formatMoney(mnt, pricing);
}
