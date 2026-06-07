/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true, // Allow SVG placeholders
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Double asterisk allows ALL https domains
      },
      {
        protocol: 'http',
        hostname: '**', // Double asterisk allows ALL http domains
      },
    ],
  },
};

module.exports = nextConfig;