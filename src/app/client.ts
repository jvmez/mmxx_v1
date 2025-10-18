import { createThirdwebClient } from "thirdweb";

// Resolve client ID from env. Avoid throwing at import time to prevent chunk load failures.
// Refer to https://portal.thirdweb.com/typescript/v5/client to obtain a client ID.
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!clientId) {
  console.warn(
    "NEXT_PUBLIC_THIRDWEB_CLIENT_ID is not set. Please add it to your .env.local file or environment variables."
  );
}

// Use a fallback client ID to prevent runtime errors
const fallbackClientId = "demo-client-id-for-development";

export const client = createThirdwebClient({
  clientId: clientId || fallbackClientId,
});
