/** @type {import('next').NextConfig} */
import { NextResponse } from 'next/server';
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-allowed-domain.com', // or '*'
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle the preflight request
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Handle your actual request
export async function GET(request) {
  return NextResponse.json(
    { message: 'Hello from a CORS-enabled API!' },
    { status: 200, headers: corsHeaders }
  );
}
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