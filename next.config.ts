import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos', // kalo kamu juga pake ini di avatar toko
      },
      {
        protocol: 'https',
        hostname: 'static-ecapac.acer.com', // kalo kamu juga pake ini di avatar toko
      },
    ],
  },
};

export default nextConfig;
