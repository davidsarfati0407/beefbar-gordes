import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
  },
  // three / @react-three ship untranspiled ESM helpers used by drei.
  transpilePackages: ["three"],
};

export default nextConfig;
