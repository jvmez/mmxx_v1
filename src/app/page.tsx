"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// No on-chain read needed for this static layout

const NFTMintSection = dynamic(() => import("./sections/NFTMintSection"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading NFT Minting Interface...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="p-4 pb-10 min-h-[100vh]">
      <div className="container py-16 md:py-20">
        <Suspense fallback={
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        }>
          <NFTMintSection />
        </Suspense>
      </div>
    </main>
  );
}
