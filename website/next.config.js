/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // 🚀 Yahan humne redirects add kar diye hain
  async redirects() {
    return [
      {
        source: '/company',
        destination: 'https://www.digikraftsocial.com/',
        permanent: true, // SEO ke liye 301 redirect
      },
     
    ];
  },
};

module.exports = nextConfig;