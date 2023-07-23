module.exports = {
  env: {
    API: process.env.API,
    EMAIL_LAMBDA_URL: process.env.EMAIL_LAMBDA_URL,
  },
  images: {
    domains: [
      "localhost",
      "images.unsplash.com",
      "fakeimg.pl",
      "avatars.dicebear.com",
      "lh3.googleusercontent.com",
      "www.larvalabs.com",
      "picsum.photos",
      "incepthink.mypinata.cloud",
      "gateway.pinata.cloud",
    ],
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${process.env.API}/:path*`,
      },
      {
        source: "/frontend/:path*",
        destination: "http://localhost:3000/:path*",
      },
    ];
  },
};
