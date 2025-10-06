"use client";

import { ThirdwebProvider } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import type { PropsWithChildren } from "react";

// Create a thirdweb client with fallback
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "demo-client-id",
});

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThirdwebProvider 
      client={client}
      options={{
        supportedChains: [],
        activeChain: undefined,
      }}
    >
      {children}
    </ThirdwebProvider>
  );
}


