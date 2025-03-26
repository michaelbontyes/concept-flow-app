const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      // Add any other domains you need here
    ],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
}

module.exports = withBundleAnalyzer(nextConfig)
