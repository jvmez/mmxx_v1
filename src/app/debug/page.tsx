"use client";

import { useEffect, useState } from "react";

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setEnvVars({
        NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ? "✅ Set" : "❌ Missing",
        NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ? "✅ Set" : "❌ Missing",
        NEXT_PUBLIC_CONTRACT_ADDRESSES: process.env.NEXT_PUBLIC_CONTRACT_ADDRESSES ? "✅ Set" : "❌ Missing",
        NODE_ENV: process.env.NODE_ENV,
        isClient: typeof window !== "undefined",
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "Server",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Information</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-mono text-sm text-gray-600">{key}:</span>
                <span className={`font-mono text-sm ${value === "❌ Missing" ? "text-red-600" : "text-green-600"}`}>
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
            <p className="text-red-700 font-mono text-sm">{error}</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-semibold mb-2">Next Steps:</h3>
          <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
            <li>Go to your Netlify dashboard</li>
            <li>Navigate to Site Settings → Environment Variables</li>
            <li>Add: <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_THIRDWEB_CLIENT_ID</code></li>
            <li>Get your Client ID from <a href="https://portal.thirdweb.com" target="_blank" rel="noopener noreferrer" className="underline">thirdweb Portal</a></li>
            <li>Redeploy your site</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
