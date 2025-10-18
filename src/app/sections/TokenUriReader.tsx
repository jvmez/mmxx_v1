"use client";

import React from "react";
import { useReadContract } from "thirdweb/react";

interface TokenUriReaderProps {
  contract: any;
  onTokenUri: (tokenUri: any) => void;
}

export default function TokenUriReader({ contract, onTokenUri }: TokenUriReaderProps) {
  const { data: tokenUri } = useReadContract(
    contract
      ? {
          contract,
          method: "function tokenURI(uint256)",
          params: [0n],
        }
      : {
          contract: {} as any,
          method: "function tokenURI(uint256)",
          params: [0n],
        }
  );

  // Call the callback when tokenUri changes
  React.useEffect(() => {
    onTokenUri(tokenUri);
  }, [tokenUri, onTokenUri]);

  return null; // This component doesn't render anything
}
