// next.config.js
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

/** ESM-compatible require */
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '**',
      },
    ],
  },

  webpack(config) {
    // ✅ Add alias to prevent "styled-jsx/package.json" error
    config.resolve.alias['styled-jsx/package.json'] = require.resolve('styled-jsx/package.json');
    return config;
  },
};

export default nextConfig;

