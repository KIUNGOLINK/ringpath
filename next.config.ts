import type { NextConfig } from "next";

// Only the Spar side is open to the public. Everything else (Compét, coach,
// passport, scouting, internal design pages) is closed and sends visitors
// back to the homepage until it is ready.
const CLOSED_SECTIONS = ["/coach", "/coach/:path*", "/scouting", "/passport/:path*", "/foundations", "/components"];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...CLOSED_SECTIONS.map((source) => ({ source, destination: "/", permanent: false })),
      // The timer now lives in its own space.
      { source: "/app/spar/timer", destination: "/minuteur", permanent: true },
    ];
  },
};

export default nextConfig;
