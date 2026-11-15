import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // `next build` produces the static export; `next dev` runs as a normal dev
  // server so on-demand rendering can't trip the export-only path checks.
  ...(isProd ? { output: 'export' as const } : {}),
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // the original site keeps unicode (persian) permalinks; keep them verbatim
  turbopack: { root: process.cwd() },
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
};

export default nextConfig;
