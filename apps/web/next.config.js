module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@nql/ui"],
  images: {
    remotePatterns: [
      {
        hostname: "d1.awsstatic.com",
      },
    ],
  },
};
