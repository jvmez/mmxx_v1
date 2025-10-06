"use client";

import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import { client } from "./client";
import { useState, useEffect } from "react";

function LivePrice() {
  const [price, setPrice] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const addr = "0x98b8c63f576acaff64c5b8b933f04534756e12b8";
        
        // Try DexScreener first
        const response = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${addr}`
        );
        const data = await response.json();

        if (data?.pairs && Array.isArray(data.pairs) && data.pairs.length > 0) {
          const pair = data.pairs.find((p: any) => p?.priceUsd);
          if (pair?.priceUsd) {
            const p = Number(pair.priceUsd);
            setPrice(`$${(isFinite(p) ? p : Number(pair.priceUsd)).toFixed(6)}`);
            return;
          }
        }

        // Fallback: Try CoinGecko with Base chain
        const cgResponse = await fetch(
          `https://api.coingecko.com/api/v3/simple/token_price/base?contract_addresses=${addr}&vs_currencies=usd`
        );
        const cgData = await cgResponse.json();
        
        if (cgData[addr]?.usd) {
          setPrice(`$${cgData[addr].usd.toFixed(6)}`);
          return;
        }

        // If no price found, show placeholder
        setPrice("$0.000000");
      } catch (error) {
        console.error("Error fetching price:", error);
        setPrice("$0.000000");
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-600">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-zinc-600">MMXX:</span>
      <span className="font-semibold text-zinc-900">{price}</span>
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40">
      <div className="container h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold tracking-wider text-zinc-900">
            <Image src="/IMG_0225.png" alt="MMXX" width={50} height={50}/>
          </Link>
          <LivePrice />
        </div>

        <div className="flex items-center justify-end gap-6">
          <div className="flex items-center gap-4">
            <Image src="/5588540_discord_communication_gaming_interaction_message_icon.png" alt="Discord" width={24} height={24} />
            <Image src="/9297484_uni_blockchain_coins_cryptocurrency_crypto_icon.png" alt="Crypto" width={24} height={24} />
            <Image src="/11053970_x_logo_twitter_new_brand_icon.png" alt="X" width={24} height={24} />
          </div>
          <ConnectButton
            client={client}
            appMetadata={{
              name: "MMXX",
              url: "https://example.com",
            }}
          />
        </div>
      </div>
    </nav>
  );
}


