/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  // Only enable static export for production builds
  ...(isProd && { output: 'export' }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['thirdweb'],
  },
  // Headers removed for static export compatibility
  webpack: (config, { isServer, dev }) => {
    // Avoid eval-based source maps in dev to satisfy strict CSP
    if (dev) {
      config.devtool = 'source-map';
    }

    // Fix for chunk loading issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
