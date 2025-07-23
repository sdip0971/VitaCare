const nextConfig = {
  // Your existing Next.js configuration goes here, for example:
  // reactStrictMode: true,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://apis.google.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
