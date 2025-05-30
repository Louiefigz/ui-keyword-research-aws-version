/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://localhost:8080/api/v1/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/proxy/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-User-ID' },
        ],
      },
    ];
  },
  // Increase timeout for AI processing endpoints
  experimental: {
    proxyTimeout: 300000, // 5 minutes (300 seconds)
  },
};

export default nextConfig;