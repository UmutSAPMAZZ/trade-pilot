import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['ccxt', 'technicalindicators'],
  experimental: {
    serverActions: {},
    //  missingSuspenseWithCSRBailout: false, // Bu kritik!
    // typedRoutes: true,
  },
  serverExternalPackages: ["@prisma/client"],
  // optimizePackageImports: ["@prisma/client"],
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  },
   webpack: (config) => {
    config.externals = [...config.externals, { '@prisma/client': 'require("@prisma/client")' }]
    return config
  }
};
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      },
    ]
  }
};

export default nextConfig;
