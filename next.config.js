/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  experimental: {
    optimizePackageImports: ['thirdweb'],
  },
  async headers() {
    if (isProd) return [];
    // Development-only CSP to allow eval for tooling that relies on it
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https: ws:; font-src 'self' data:; frame-ancestors 'self'; object-src 'none'",
          },
        ],
      },
    ];
  },
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
