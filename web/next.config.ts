import type { NextConfig } from "next";

// Static export: Cloudflare serves the generated `out/` folder as plain assets.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
