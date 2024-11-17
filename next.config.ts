import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    webpack(config) {
        config.resolve.alias.canvas = false;
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
};

export default nextConfig;
