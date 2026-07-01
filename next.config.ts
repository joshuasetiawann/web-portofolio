import type { NextConfig } from "next";
import { execFileSync } from "node:child_process";

/** Short commit SHA for the instrument telemetry (StatusBar / hero). */
function commitSha(): string {
  const fromVercel = process.env.VERCEL_GIT_COMMIT_SHA;
  if (fromVercel) return fromVercel.slice(0, 7);
  try {
    // No shell, fixed args — not command-injectable.
    return execFileSync("git", ["rev-parse", "--short", "HEAD"]).toString().trim();
  } catch {
    return "unknown";
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "opengraph.githubassets.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  env: {
    NEXT_PUBLIC_COMMIT_SHA: commitSha(),
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
};

export default nextConfig;
