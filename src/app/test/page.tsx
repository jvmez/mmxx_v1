"use client";

import { useEffect, useState } from "react";

export default function TestPage() {
  const [error, setError] = useState<string | null>(null);
  const [envVars, setEnvVars] = useState<any>({});

  useEffect(() => {
    try {
      // Test basic functionality
      console.log("Test page loaded");
      
      // Check environment variables
      const vars = {
        NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ? "✅ Set" : "❌ Missing",
        NODE_ENV: process.env.NODE_ENV,
        isClient: typeof window !== "undefined",
      };
      setEnvVars(vars);
      
      // Test thirdweb import
      import("thirdweb").then(() => {
        console.log("✅ Thirdweb imported successfully");
      }).catch((err) => {
        console.error("❌ Thirdweb import failed:", err);
        setError(`Thirdweb import failed: ${err.message}`);
      });
      
    } catch (err) {
      console.error("Test page error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Page</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
            <p className="text-red-700 font-mono text-sm">{error}</p>
          </div>
        )}
        
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
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-semibold mb-2">Next Steps:</h3>
          <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
            <li>Check the browser console for detailed error messages</li>
            <li>Set up environment variables in Netlify</li>
            <li>Redeploy your site</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
