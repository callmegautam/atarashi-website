import type { NextConfig } from "next";

// The registry is served as static files out of `public/registry`, byte-identical
// to what `pnpm build:index` produces in the CLI repo. `@atarashi/registry` fetches
// three shapes of URL from it, and two of them are immutable:
//
//   /registry/v1/index.json            mutable "latest", revalidated by ETag
//   /registry/v1/<version>/index.json  immutable once published
//   /registry/bp/<slug>-<version>.tgz  immutable, addressed by content hash
//
// The client keeps a 24h TTL of its own and then sends `if-none-match`, so the
// mutable index must revalidate rather than sit in a CDN cache past a publish.
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
        // Content-Type matters less than the bytes, since the client reads the body
        // as an ArrayBuffer, but a wrong type invites a proxy to re-encode it.
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
