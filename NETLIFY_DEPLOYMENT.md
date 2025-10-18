# Netlify Deployment Guide

## Quick Fix for Client-Side Exception Error

The client-side exception error on Netlify is typically caused by missing environment variables or incorrect build settings. Follow these steps to fix it:

## 1. Environment Variables Setup

In your Netlify dashboard, go to **Site Settings** → **Environment Variables** and add:

```
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
```

**OR** for multiple contracts:

```
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
NEXT_PUBLIC_CONTRACT_ADDRESSES=0xContract1,0xContract2,0xContract3
```

## 2. Build Settings

In **Site Settings** → **Build & Deploy** → **Build Settings**:

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 18 (or higher)

## 3. Get Your Thirdweb Client ID

1. Go to [thirdweb Portal](https://portal.thirdweb.com/typescript/v5/client)
2. Sign up or log in
3. Create a new project or select existing
4. Copy your Client ID
5. Add it to Netlify environment variables

## 4. Redeploy

After adding environment variables:
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete

## 5. Verify Deployment

Your site should now load without client-side exceptions. If you still see issues:

1. Check the browser console for specific error messages
2. Verify environment variables are set correctly
3. Ensure your contract addresses are valid Ethereum addresses

## Common Issues Fixed

- ✅ Added fallback client ID to prevent runtime errors
- ✅ Improved error handling for missing environment variables
- ✅ Added better loading states and error boundaries
- ✅ Fixed hydration mismatch issues
- ✅ Added proper contract address validation

## Support

If you continue to experience issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure your contract addresses are valid and deployed
