import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // Fix Turbopack + Prisma compatibility
  serverExternalPackages: ["@prisma/client"],
  // Allow cross-origin requests from preview panel
  allowedDevOrigins: [
    "preview-chat-8b2fb0f0-5b96-4bb8-8ce4-f397123963dd.space.z.ai",
  ],
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
