"use client";

import { ConnectButton } from "thirdweb/react";
import { client } from "../client";

export default function WalletConnect() {
  try {
    return (
      <ConnectButton
        client={client}
        appMetadata={{
          name: "MMXX",
          url: typeof window !== "undefined" ? window.location.origin : "https://mmxx.com",
        }}
        connectButton={{
          label: "Connect Wallet",
        }}
        connectModal={{
          size: "wide",
        }}
      />
    );
  } catch (error) {
    console.error("Error rendering ConnectButton:", error);
    return (
      <button 
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        disabled
      >
        Wallet Connection Error
      </button>
    );
  }
}


