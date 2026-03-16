/** @type {import('next').NextConfig} */
const nextConfig = {

  // Prevent Vercel build failure because of ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Allow external images if you fetch news images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Enable compression for faster responses
  compress: true,

  // Optional performance optimization
  experimental: {
    optimizePackageImports: ["recharts", "@vercel/analytics"]
  },

};

export default nextConfig;