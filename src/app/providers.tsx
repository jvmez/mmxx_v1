"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider } from "thirdweb/react";
import { client } from "./client";

export function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  useEffect(() => {
    // Prefer a single injected provider to avoid conflicts between multiple wallet extensions
    try {
      const w = globalThis as unknown as { ethereum?: any };
      const injected = w?.ethereum;
      if (injected?.providers && Array.isArray(injected.providers)) {
        const pickOrder = [
          (p: any) => p?.isMetaMask,
          (p: any) => p?.isCoinbaseWallet,
          (p: any) => p?.isBraveWallet,
        ];
        const selected =
          pickOrder.map((f) => injected.providers.find(f)).find(Boolean) ||
          injected.providers[0];
        if (selected && injected !== selected) {
          w.ethereum = selected;
        }
      }
    } catch {
      // noop: never throw from provider selection
    }
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        {children}
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}


