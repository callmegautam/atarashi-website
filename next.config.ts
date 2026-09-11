import type { NextConfig } from "next";

const IMMUTABLE = "public, max-age=31536000, immutable";
const REVALIDATE = "public, max-age=0, must-revalidate";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/registry/v1/index.json",
        headers: [{ key: "cache-control", value: REVALIDATE }],
      },
      {
        source: "/registry/v1/:version/index.json",
        headers: [{ key: "cache-control", value: IMMUTABLE }],
      },
      {
        source: "/registry/bp/:tarball*.tgz",
        headers: [
          { key: "cache-control", value: IMMUTABLE },
          { key: "content-type", value: "application/gzip" },
        ],
      },
    ];
  },
};

export default nextConfig;
