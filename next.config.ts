import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // Enable experimental features if needed
  experimental: {
    // Enable optimization
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
