import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    ppr: "incremental",
    dynamicIO: true,
    reactCompiler: true,
  },
};

export default nextConfig;
