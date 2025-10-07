"use client";

import { ConnectButton } from "thirdweb/react";
import { client } from "../client";

export default function WalletConnect() {
  return (
    <ConnectButton
      client={client}
      appMetadata={{
        name: "MMXX",
        url: "https://example.com",
      }}
    />
  );
}


