import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/fse-experience",
        destination: "/",
      },
    ];
  },
};

export default nextConfig;