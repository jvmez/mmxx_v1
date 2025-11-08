# Fixing Thirdweb Domain Authorization Error

## Error Message
```
ORIGIN_UNAUTHORIZED - Invalid request: Unauthorized domain: localhost:3003
```

## Solution

You need to add your development domain to the allowed origins in your thirdweb API key settings.

### Steps to Fix:

1. **Go to Thirdweb Dashboard**
   - Visit: https://thirdweb.com/create-api-key
   - Or go to: https://portal.thirdweb.com → Settings → API Keys

2. **Find Your API Key**
   - Locate the API key that matches your `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`
   - Click on it to edit

3. **Add Allowed Origins**
   - In the "Allowed Origins" or "Domain Restrictions" section, add:
     - `http://localhost:3000` (default Next.js port)
     - `http://localhost:3003` (your current port)
     - `http://localhost:*` (or use wildcard for all localhost ports)
     - Your production domain (e.g., `https://yourdomain.com`)

4. **Save Changes**
   - Click "Save" or "Update"
   - Changes may take a few seconds to propagate

5. **Restart Your Dev Server**
   ```bash
   npm run dev
   ```

### Common Development Ports to Add:
- `http://localhost:3000` (Next.js default)
- `http://localhost:3001`
- `http://localhost:3002`
- `http://localhost:3003`
- `http://localhost:*` (wildcard - allows all localhost ports)

### For Production:
Make sure to add your production domain:
- `https://yourdomain.com`
- `https://www.yourdomain.com` (if using www)

### Quick Fix:
If you want to allow all localhost ports during development, you can use:
- `http://localhost:*`

**Note:** Be careful with wildcards in production - only use specific domains for production environments.

