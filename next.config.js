/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'www.villaburada.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
    webpack: (config) => {
      config.cache = false;
      return config;
    },  
    reactStrictMode: false,
  };
  
  module.exports = nextConfig;
  