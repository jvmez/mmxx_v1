"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider } from "thirdweb/react";
import { client } from "./client";
import { ErrorBoundary } from "./ErrorBoundary";

export function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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
    } catch (error) {
      console.warn("Error during provider selection:", error);
    }
  }, []);

  // Prevent hydration mismatch by only rendering on client
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider>
          {children}
        </ThirdwebProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}


