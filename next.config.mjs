/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable API routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
