const { withAxiom } = require("next-axiom");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.scdn.co"],
  },
  webpack: (config) => {
    config.experiments ??= {};
    config.experiments.asyncWebAssembly = true;

    return config;
  },
};

module.exports = withAxiom({ ...nextConfig });
