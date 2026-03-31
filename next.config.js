/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.pollinations.ai' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  // Vercel cron jobs are defined in vercel.json
}

module.exports = nextConfig
