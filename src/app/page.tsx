"use client";

import Image from "next/image";
import dynamic from "next/dynamic";

// No on-chain read needed for this static layout

const NFTMintSection = dynamic(() => import("./sections/NFTMintSection"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="p-4 pb-10 min-h-[100vh]">
      <div className="container py-16 md:py-20">
        <NFTMintSection />
      </div>
    </main>
  );
}
