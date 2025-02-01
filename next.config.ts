import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cy5mssvvxz2h9pd9.public.blob.vercel-storage.com", 
      },
    ],
  },
};

export default nextConfig;