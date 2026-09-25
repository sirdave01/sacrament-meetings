// Use Next's config type to validate framework options at compile time.
import type { NextConfig } from "next";

// Keep framework-specific options together for build and runtime configuration.
const nextConfig: NextConfig = {
  // Add Next.js options here when the application needs framework customization.
  /* config options here */
};

// Export the typed configuration consumed by the Next.js CLI.
export default nextConfig;
