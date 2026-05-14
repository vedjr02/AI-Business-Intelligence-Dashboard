import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev-only route indicator (small Next.js badge, default bottom-left).
  // Errors still show in the overlay; this only removes the corner badge.
  devIndicators: false,
};

export default nextConfig;
