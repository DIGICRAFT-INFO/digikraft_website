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
});
export const metadata = {
  title: "Digikraft Social - Empowering Brands Digitally",
  description:
    "Digikraft Social is a full-service digital agency specializing in content creation, marketing, and web/app development. We craft digital experiences that engage and convert.",
  keywords:
    "Digikraft Social, digital marketing, content creation, web development, app development, branding, social media, UI/UX, Raipur agency",
  authors: [{ name: "Digikraft Social", url: "https://digikraftsocial.com" }],
  creator: "Digikraft Social",
  publisher: "Digikraft Social",
  openGraph: {
    title: "Digikraft Social - Empowering Brands Digitally",
    description:
      "Full-service digital agency offering marketing, content, and tech solutions.",
    url: "https://digikraftsocial.com",
    siteName: "Digikraft Social",
    images: [
      {
        url: "https://demo.digikraftsocial.com/public/uploads/logo_digifoot.png", // Replace with actual OG image path
        width: 1200,
        height: 630,
        alt: "Digikraft Social Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digikraft Social - Empowering Brands Digitally",
    description:
      "Digital marketing, web/app development, and content creation under one roof.",
    site: "@digikraftsocial", // Replace with actual Twitter handle if available
    creator: "@digikraftsocial",
    images: [
      "https://demo.digikraftsocial.com/public/uploads/logo_digifoot.png",
    ], // Replace with actual OG image path
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleAnalytics />
      <body className={urban.variable} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
