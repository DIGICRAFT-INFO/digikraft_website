import { Urbanist } from "next/font/google";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "/public/assets/css/style.css";
import GoogleAnalytics from "@/components/slider/GoogleAnalytics";

const urban = Urbanist({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--tg-body-font-family",
  display: "swap",
  preload: false,
});

const BASE_URL = "https://www.digikraftsocial.com";
const OG_IMAGE = `${BASE_URL}/assets/imgs/template/logo.png`;

export const metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "DigiKraft Social — Empowering Brands Digitally",
    template: "%s | DigiKraft Social",
  },
  description:
    "DigiKraft Social is a full-service digital agency in Raipur specializing in content creation, social media marketing, web & app development. We craft digital experiences that engage and convert.",
  keywords: [
    "DigiKraft Social",
    "digital marketing Raipur",
    "social media marketing",
    "content creation",
    "web development Raipur",
    "app development",
    "branding agency",
    "SEO services",
    "UI/UX design",
    "Chhattisgarh digital agency",
  ],
  authors: [{ name: "DigiKraft Social", url: BASE_URL }],
  creator: "DigiKraft Social",
  publisher: "DigiKraft Social",

  // ── Canonical URL ──────────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
  },

  // ── Google Search Console verification ────────────────────
  // Replace the content value with your actual verification code from
  // Search Console → Settings → Ownership verification → HTML tag method
  verification: {
    google: "7291f555c270186f", // matches google7291f555c270186f.html in /public
  },

  // ── Open Graph (Facebook, LinkedIn, WhatsApp previews) ────
  openGraph: {
    type:        "website",
    locale:      "en_IN",
    url:         BASE_URL,
    siteName:    "DigiKraft Social",
    title:       "DigiKraft Social — Empowering Brands Digitally",
    description: "Full-service digital agency in Raipur — social media, web development, branding & more.",
    images: [
      {
        url:    OG_IMAGE,
        width:  1200,
        height: 630,
        alt:    "DigiKraft Social — Empowering Brands Digitally",
      },
    ],
  },

  // ── Twitter / X Card ──────────────────────────────────────
  twitter: {
    card:        "summary_large_image",
    site:        "@digikraftsocial",
    creator:     "@digikraftsocial",
    title:       "DigiKraft Social — Empowering Brands Digitally",
    description: "Digital marketing, web/app development, and content creation under one roof.",
    images:      [OG_IMAGE],
  },

  // ── Robots ────────────────────────────────────────────────
  robots: {
    index:          true,
    follow:         true,
    googleBot: {
      index:             true,
      follow:            true,
      "max-image-preview":    "large",
      "max-snippet":          -1,
      "max-video-preview":    -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicons */}
        <link rel="icon"             href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/assets/imgs/template/logo.png" />

        {/* Canonical — also set per-page via generateMetadata */}
        <link rel="canonical" href={BASE_URL} />

        {/* Sitemap hint (some crawlers read this) */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>
      {/* GA4 — placed inside <html>, before <body> per Next.js convention */}
      <GoogleAnalytics />
      <body className={urban.variable} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
