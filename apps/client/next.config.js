//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

// Validate environment variables
function validateClientEnv() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  
  // Basic URL validation
  try {
    new URL(apiUrl);
  } catch (error) {
    throw new Error(`NEXT_PUBLIC_API_URL must be a valid URL. Received: ${apiUrl}`);
  }
  
  // Security check: warn if using HTTP in production
  if (process.env.NODE_ENV === 'production' && apiUrl.startsWith('http://')) {
    console.warn('⚠️  WARNING: Using HTTP in production. Consider using HTTPS for security.');
  }
  
  return { apiUrl };
}

const { apiUrl } = validateClientEnv();

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
  
  // Enable standalone output for Docker deployment
  output: 'standalone',
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: apiUrl,
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
