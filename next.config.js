/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Configure redirects for backward compatibility
  async redirects() {
    return [
      // Redirect root to dashboard for authenticated users
      {
        source: '/dashboard',
        destination: '/app/dashboard',
        permanent: false,
      },
      // Handle company routes
      {
        source: '/company/:path*',
        destination: '/app/company/:path*',
        permanent: false,
      },
      // Handle customer routes
      {
        source: '/customer/:path*',
        destination: '/app/customer/:path*',
        permanent: false,
      },
    ];
  },
  
  // Configure rewrites for API compatibility
  async rewrites() {
    return {
      beforeFiles: [
        // Handle API routes
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ],
    };
  },
  
  // Allow importing from src directory
  transpilePackages: [],
  
  // Set up the output directory
  distDir: '.next',
  
  // Enable image optimization
  images: {
    domains: ['localhost', 'threestage.app'],
  },

  // Support both TS and JS files during migration
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

module.exports = nextConfig; 