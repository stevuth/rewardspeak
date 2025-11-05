
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'admin.notik.me',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.offertoro.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https' ,
        hostname: 'play-lh.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '3423.efuserassets.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.efusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.lootably.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'publisher.notik.me',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'publishers.theoremreach.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'main-p.agmcdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'banners.hangmyads.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.digitaloceanspaces.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.go2speed.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.playfull.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.timebucks.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'timewall.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
