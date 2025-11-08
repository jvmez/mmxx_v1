# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Thirdweb Configuration
# Get your client ID from https://portal.thirdweb.com/typescript/v5/client
# Only this var is supported; remove any NEXT_PUBLIC_TEMPLATE_CLIENT_ID usage
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=a2386a46b72aab91322a8bd03b7f50b0

# Contract Configuration (choose one)
# Single contract:
NEXT_PUBLIC_CONTRACT_ADDRESS=0xb3E3D9a2E7A58c3e28bf7B8519844f5c3Ba7Ca6a

# Or multiple contracts (comma-separated):
NEXT_PUBLIC_CONTRACT_ADDRESSES=NEXT_PUBLIC_CONTRACT_ADDRESS=0xb3E3D9a2E7A58c3e28bf7B8519844f5c3Ba7Ca6a,0x98B8c63F576ACAFf64c5B8b933F04534756E12B8
```

## Steps to Fix the Client-Side Exception

1. **Get a Thirdweb Client ID:**
   - Go to https://portal.thirdweb.com/typescript/v5/client
   - Create a new project or use an existing one
   - Copy the Client ID

2. **Set up your contract:**
   - Deploy your NFT contract(s) or use existing ones
   - Set either `NEXT_PUBLIC_CONTRACT_ADDRESS` or `NEXT_PUBLIC_CONTRACT_ADDRESSES`

3. **Create the environment file:**
   - Create `.env.local` in the project root
   - Add the variables above with your actual values

4. **Redeploy:**
   - The app should now work without client-side exceptions

## Common Issues Fixed

- ✅ Added proper error handling for missing environment variables
- ✅ Fixed hydration mismatch issues with client-side rendering
- ✅ Improved contract validation to prevent runtime errors
- ✅ Added better error logging for debugging

## Domain Authorization Error

If you see an error like:
```
ORIGIN_UNAUTHORIZED - Invalid request: Unauthorized domain: localhost:3003
```

**Solution:**
1. Go to https://thirdweb.com/create-api-key
2. Find your API key (matching your Client ID)
3. Add your localhost domain to "Allowed Origins":
   - `http://localhost:3000` (or your port)
   - `http://localhost:*` (for all localhost ports)
4. Save and restart your dev server

See [THIRDWEB_DOMAIN_SETUP.md](./THIRDWEB_DOMAIN_SETUP.md) for detailed instructions.
