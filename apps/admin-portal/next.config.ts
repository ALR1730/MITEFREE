import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mitefree/shared-types', '@mitefree/domain-core'],
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
      '.cjs': ['.cts', '.cjs'],
    };
    return config;
  },
  async redirects() {
    return [
      {
        source: '/rutas',
        destination: '/tecnicos',
        permanent: true,
      },
      {
        source: '/catalogo',
        destination: '/configuracion',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
