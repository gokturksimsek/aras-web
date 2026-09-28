import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Nesne biçimi: `new URL()` biçimi sorgu parametrelerini (?auto=format…) reddediyor.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/**" }],
    qualities: [75, 85],
  },
};

export default nextConfig;
