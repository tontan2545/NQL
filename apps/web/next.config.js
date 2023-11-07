module.exports = {
  reactStrictMode: true,
  output: "standalone",
  transpilePackages: ["@nql/ui"],
  images: {
    remotePatterns: [
      {
        hostname: "d1.awsstatic.com",
      },
    ],
  },
};
