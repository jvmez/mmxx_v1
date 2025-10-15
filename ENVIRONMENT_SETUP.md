# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Thirdweb Configuration
# Get your client ID from https://portal.thirdweb.com/typescript/v5/client
# Only this var is supported; remove any NEXT_PUBLIC_TEMPLATE_CLIENT_ID usage
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here

# Contract Configuration (choose one)
# Single contract:
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourSingleContract

# Or multiple contracts (comma-separated):
NEXT_PUBLIC_CONTRACT_ADDRESSES=0xYourContract1,0xYourContract2
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
