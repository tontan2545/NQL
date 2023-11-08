module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@nql/ui"],
  output: "standalone",
  images: {
    remotePatterns: [
      {
        hostname: "d1.awsstatic.com",
      },
    ],
  },
};
