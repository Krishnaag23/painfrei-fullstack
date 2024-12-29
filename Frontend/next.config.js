/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["15.206.223.241","localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
      },
    ],
  },
};

        // 
        


module.exports = nextConfig;
