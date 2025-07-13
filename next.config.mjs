// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: `${process.env.NEXT_PUBLIC_IMAGE_BUCKET}.s3.ap-southeast-2.amazonaws.com`,
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'images.ala.org.au',
          pathname: '/**',
        },
      ],
    },
  };
  
  export default nextConfig;
  