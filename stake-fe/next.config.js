/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 配置 webpack 以处理 HMR 问题
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
