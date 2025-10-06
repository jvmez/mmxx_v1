import { createThirdwebClient } from "thirdweb";

// Resolve client ID from env. Avoid throwing at import time to prevent chunk load failures.
// Refer to https://portal.thirdweb.com/typescript/v5/client to obtain a client ID.
const clientId =
  process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ||
  process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID ||
  "";

export const client = createThirdwebClient({
  clientId: clientId,
});
