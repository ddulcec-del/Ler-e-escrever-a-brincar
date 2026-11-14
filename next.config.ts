import type { NextConfig } from 'next';

// On GitHub Pages the site is served from /<repo>/, so the deploy workflow
// passes that prefix in PAGES_BASE_PATH. Locally it is empty.
const basePath = process.env.PAGES_BASE_PATH || '';

const nextConfig: NextConfig = {
  // Static export: the app has no server — all data lives in localStorage.
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
