/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          port: ''
        },
        {
          protocol: 'https',
          hostname: 'replicate.com',
          port: ''
        },
        {
          protocol: 'https',
          hostname: 'replicate.delivery',
          port: ''
        },
      ]
    }
  };
  
  export default nextConfig;