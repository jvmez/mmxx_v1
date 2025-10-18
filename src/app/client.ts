import { createThirdwebClient } from "thirdweb";

// Resolve client ID from env. Avoid throwing at import time to prevent chunk load failures.
// Refer to https://portal.thirdweb.com/typescript/v5/client to obtain a client ID.
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

console.log("Environment check:", {
  clientId: clientId ? "✅ Set" : "❌ Missing",
  nodeEnv: process.env.NODE_ENV,
  isClient: typeof window !== "undefined",
});

if (!clientId) {
  console.error(
    "❌ NEXT_PUBLIC_THIRDWEB_CLIENT_ID is not set. Please add it to your environment variables in Netlify."
  );
  console.error("Go to: Site Settings → Environment Variables → Add NEXT_PUBLIC_THIRDWEB_CLIENT_ID");
}

// Use a fallback client ID to prevent runtime errors
const fallbackClientId = "demo-client-id-for-development";

let client: ReturnType<typeof createThirdwebClient>;
try {
  client = createThirdwebClient({
    clientId: clientId || fallbackClientId,
  });
  console.log("✅ Thirdweb client created successfully");
} catch (error) {
  console.error("❌ Failed to create Thirdweb client:", error);
  // Create a minimal client as fallback
  client = createThirdwebClient({
    clientId: fallbackClientId,
  });
}

export { client };
