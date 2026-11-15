import type { NextConfig } from 'next';

/* GitHub Pages serves the project from a sub-path
   (https://ali-shahabi.github.io/medisdesign/). Everything that is not part of
   the framework — images, fonts, the manifest — is referenced through
   `lib/asset.ts`, which uses the same value at build time. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  // `next build` produces the static export; `next dev` stays a normal dev server.
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' as const } : {}),
  basePath: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  turbopack: { root: process.cwd() },
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
};

export default nextConfig;
