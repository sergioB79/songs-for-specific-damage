import type { NextConfig } from "next";

const repoBase = process.env.GITHUB_ACTIONS ? "/songs-for-specific-damage" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath: repoBase,
  assetPrefix: repoBase || undefined,
};

export default nextConfig;
