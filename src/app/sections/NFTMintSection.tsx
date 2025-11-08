"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useCallback } from "react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { client } from "../client";
import { defineChain } from "thirdweb/chains";
import TokenUriReader from "./TokenUriReader";

export default function NFTMintSection() {
  const account = useActiveAccount();
  const [mintStatus, setMintStatus] = useState<string>("");

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const RAW_CONTRACT_ADDRESSES = process.env.NEXT_PUBLIC_CONTRACT_ADDRESSES;
  const contractAddresses = useMemo(() => {
    try {
      const list = (RAW_CONTRACT_ADDRESSES || "")
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.startsWith("0x"));
      if (list.length > 0) return list;
      return CONTRACT_ADDRESS && CONTRACT_ADDRESS.startsWith("0x") ? [CONTRACT_ADDRESS] : [];
    } catch (error) {
      console.error("Error parsing contract addresses:", error);
      return [];
    }
  }, [RAW_CONTRACT_ADDRESSES, CONTRACT_ADDRESS]);

  const [selectedAddress, setSelectedAddress] = useState<string>(
    contractAddresses[0] || ""
  );
  useEffect(() => {
    // keep selection in sync if env changes across HMR
    if (contractAddresses.length > 0 && !contractAddresses.includes(selectedAddress)) {
      setSelectedAddress(contractAddresses[0]);
    }
  }, [contractAddresses, selectedAddress]);
  const chain = defineChain({ id: 1, name: "Ethereum", rpc: "https://eth.llamarpc.com" });
  const effectiveAddress = selectedAddress;
  
  const contract = useMemo(() => {
    try {
      if (effectiveAddress && 
          effectiveAddress !== "0x0000000000000000000000000000000000000000" &&
          effectiveAddress.startsWith("0x") &&
          effectiveAddress.length === 42) {
        return getContract({ client, address: effectiveAddress, chain }) as any;
      }
      return null;
    } catch (error) {
      console.error("Error creating contract:", error);
      return null;
    }
  }, [effectiveAddress, client, chain]);

  const [tokenUri, setTokenUri] = useState<any>(undefined);

  const handleTokenUri = useCallback((uri: any) => {
    setTokenUri(uri);
  }, []);

  const [previewSrc, setPreviewSrc] = useState<string>("/Untitled design (2) 2.PNG");
  const [animationUrl, setAnimationUrl] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        const uriVal = tokenUri as any;
        if (typeof uriVal === "string" && uriVal.length > 0) {
          const res = await fetch(uriVal as string);
          const meta = await res.json();
          const img = meta.image || meta.image_url;
          if (typeof img === "string" && img.length > 0) {
            setPreviewSrc(img);
          }
          if (typeof meta.animation_url === "string") {
            setAnimationUrl(meta.animation_url);
          }
        }
      } catch (e) {
        console.error("Failed to load token metadata", e);
      }
    };
    load();
  }, [tokenUri]);

  const handleMint = async () => {
    if (!account) {
      setMintStatus("Please connect your wallet first");
      return;
    }
    if (!contract) {
      setMintStatus("No contract configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in your environment variables.");
      return;
    }
    
    try {
      setMintStatus("Preparing mint transaction...");
      
      // Try different mint function signatures
      let tx;
      let txError: Error | null = null;
      
      // Try mint() with no parameters
      try {
        tx = prepareContractCall({
          contract,
          method: "function mint()",
          params: [],
        });
      } catch (error: any) {
        console.log("mint() failed, trying mint(address)", error?.message);
        txError = error;
        
        // Try mint(address) with user's address
        try {
          tx = prepareContractCall({
            contract,
            method: "function mint(address)",
            params: [account.address],
          });
          txError = null;
        } catch (error2: any) {
          console.log("mint(address) failed, trying safeMint(address)", error2?.message);
          txError = error2;
          
          // Try safeMint(address) with user's address
          try {
            tx = prepareContractCall({
              contract,
              method: "function safeMint(address)",
              params: [account.address],
            });
            txError = null;
          } catch (error3: any) {
            console.error("All mint function attempts failed:", error3);
            throw new Error(`Contract does not support mint(), mint(address), or safeMint(address). Error: ${error3?.message || "Unknown error"}`);
          }
        }
      }
      
      if (!tx) {
        throw new Error("Failed to prepare transaction. Please check the contract ABI.");
      }
      
      setMintStatus("Minting... Please confirm the transaction in your wallet.");
      
      const result = await sendTransaction({ 
        transaction: tx, 
        account
      });
      
      setMintStatus(`Transaction sent: ${result.transactionHash}`);
      
      // Wait a moment before showing success message
      setTimeout(() => {
        setMintStatus("Mint successful! Check your wallet for the new NFT.");
      }, 2000);
      
      console.log("Mint transaction result:", result);
      
    } catch (err: any) {
      console.error("Mint error:", err);
      
      // Provide more specific error messages
      const errorMessage = err?.message || err?.toString() || "Unknown error";
      
      if (errorMessage.includes("user rejected") || errorMessage.includes("User rejected")) {
        setMintStatus("Transaction cancelled by user");
      } else if (errorMessage.includes("insufficient funds") || errorMessage.includes("insufficient balance")) {
        setMintStatus("Insufficient funds for gas fees");
      } else if (errorMessage.includes("execution reverted") || errorMessage.includes("revert")) {
        setMintStatus("Transaction failed: Contract execution reverted. Check if minting is enabled or if you've already minted.");
      } else if (errorMessage.includes("does not support")) {
        setMintStatus(`Contract error: ${errorMessage}`);
      } else {
        setMintStatus(`Mint failed: ${errorMessage}`);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Token URI Reader Component */}
      <TokenUriReader contract={contract} onTokenUri={handleTokenUri} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Copy */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-zinc-200">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">Tesseract Patent</h2>
            <p className="text-zinc-700 leading-relaxed">
              A map that doesn't just shows you where you are. It reveals when you are, what lies beneth and what could have been.This is the power of the tesseract. It's not just a map
            </p>
          </div>
        </div>

        {/* Right: Image */}
        <div className="flex justify-center">
          <Image
            src="/MMXX (2).png"
            alt="MMXX tesseract design"
            priority
            width={768}
            height={1365}
            className="w-full max-w-md rounded-xl shadow-2xl shadow-zinc-300/60 ring-1 ring-zinc-200 object-contain"
          />
        </div>
      </div>

      {/* Mint Section */}
      <div className="mt-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-zinc-900 mb-2">Mint</h2>
          <p className="text-zinc-600">Connect your wallet and mint the tesseract NFT.</p>
        </div>
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-zinc-200">
          {contractAddresses.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-700 mb-2">Select Contract</label>
              <select
                className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
              >
                {contractAddresses.map((addr, idx) => (
                  <option key={addr} value={addr}>{`Contract ${idx + 1} - ${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`}</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex justify-center mb-6">
            <Image
              src={previewSrc}
              alt="Tesseract NFT preview"
              width={512}
              height={512}
              className="w-full max-w-sm rounded-lg ring-1 ring-zinc-200 object-contain"
              priority
              unoptimized
            />
          </div>
          {animationUrl && (
            <div className="text-center mb-4">
              <a
                href={animationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {animationUrl}
              </a>
            </div>
          )}
          <div className="flex justify-center mb-6">
            <ConnectButton client={client} />
          </div>
          <button
            onClick={handleMint}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg disabled:bg-zinc-300 disabled:cursor-not-allowed"
            disabled={!account}
          >
            Mint NFT
          </button>
          {mintStatus && (
            <div className="mt-4 text-center text-sm text-zinc-700">{mintStatus}</div>
          )}
          
          {/* Debug Information */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
              <div><strong>Debug Info:</strong></div>
              <div>Selected Contract: {effectiveAddress || 'None'}</div>
              <div>Account: {account ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : 'Not connected'}</div>
              <div>Chain: {chain.name} (ID: {chain.id})</div>
              <div>Contract Valid: {contract ? 'Yes' : 'No'}</div>
            </div>
          )}
          {contractAddresses.length === 0 && (
            <div className="mt-3 text-center text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-3">
              <p className="font-semibold mb-1">⚠️ No contracts configured</p>
              <p>Set NEXT_PUBLIC_CONTRACT_ADDRESS or NEXT_PUBLIC_CONTRACT_ADDRESSES in your environment variables to enable minting.</p>
              <p className="mt-1 text-xs">Visit <a href="/debug" className="underline">/debug</a> to check your configuration.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


