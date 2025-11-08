import { createThirdwebClient } from "thirdweb";

// Resolve client ID from env. Avoid throwing at import time to prevent chunk load failures.
// Refer to https://portal.thirdweb.com/typescript/v5/client to obtain a client ID.
const rawClientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

// Check if client ID is missing or is a placeholder value
const isPlaceholder = (value: string | undefined): boolean => {
  if (!value) return true;
  const placeholders = [
    'your_thirdweb_client_id_here',
    'your_client_id_here',
    'demo-client-id-for-development',
    'placeholder',
    'example',
  ];
  return placeholders.some(p => value.toLowerCase().includes(p.toLowerCase()));
};

const clientId = rawClientId && !isPlaceholder(rawClientId) ? rawClientId : undefined;

console.log("Environment check:", {
  clientId: clientId ? "✅ Set" : "❌ Missing or placeholder",
  nodeEnv: process.env.NODE_ENV,
  isClient: typeof window !== "undefined",
});

if (!clientId) {
  console.warn(
    "⚠️ NEXT_PUBLIC_THIRDWEB_CLIENT_ID is not set or contains a placeholder value."
  );
  console.warn("Please update your .env.local file with a valid client ID from https://portal.thirdweb.com/typescript/v5/client");
  console.warn("The app will use a fallback client ID for development, but some features may not work correctly.");
}

// Use a fallback client ID to prevent runtime errors
// Note: This fallback may have limited functionality
const fallbackClientId = "demo-client-id-for-development";

let client: ReturnType<typeof createThirdwebClient>;
try {
  const effectiveClientId = clientId || fallbackClientId;
  client = createThirdwebClient({
    clientId: effectiveClientId,
  });
  if (clientId) {
    console.log("✅ Thirdweb client created successfully with provided client ID");
  } else {
    console.warn("⚠️ Thirdweb client created with fallback ID - please set NEXT_PUBLIC_THIRDWEB_CLIENT_ID for full functionality");
  }
} catch (error: any) {
  console.error("❌ Failed to create Thirdweb client:", error);
  
  // Check for domain authorization error
  const errorMessage = error?.message || error?.toString() || "";
  if (errorMessage.includes("ORIGIN_UNAUTHORIZED") || errorMessage.includes("Unauthorized domain")) {
    const currentOrigin = typeof window !== "undefined" ? window.location.origin : "localhost";
    console.error("");
    console.error("🔴 DOMAIN AUTHORIZATION ERROR");
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error(`Your domain "${currentOrigin}" is not authorized for this API key.`);
    console.error("");
    console.error("To fix this:");
    console.error("1. Go to: https://thirdweb.com/create-api-key");
    console.error("2. Find your API key and click to edit");
    console.error(`3. Add "${currentOrigin}" to "Allowed Origins"`);
    console.error("   Or use wildcard: http://localhost:*");
    console.error("4. Save and restart your dev server");
    console.error("");
    console.error("See THIRDWEB_DOMAIN_SETUP.md for detailed instructions.");
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  }
  
  // Create a minimal client as fallback
  try {
    client = createThirdwebClient({
      clientId: fallbackClientId,
    });
    console.warn("⚠️ Using fallback client - some features may be limited");
  } catch (fallbackError) {
    console.error("❌ Failed to create fallback client:", fallbackError);
    // Last resort: create with empty string (may fail but prevents app crash)
    client = createThirdwebClient({
      clientId: fallbackClientId,
    });
  }
}

export { client };
