// components/GoogleAnalytics.js
// GA4 tracking with Next.js App Router — auto-tracks page changes
"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-LF7XKHQLQH";

// Send a pageview hit to GA4
function pageview(url) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA_ID, { page_path: url });
}

export default function GoogleAnalytics() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  // Fire pageview on every route change (Next.js App Router)
  useEffect(() => {
    if (!GA_ID) return;
    const url = pathname + (searchParams?.toString() ? "?" + searchParams.toString() : "");
    pageview(url);
  }, [pathname, searchParams]);

  if (!GA_ID) return null;

  return (
    <>
      {/* Load gtag.js async — doesn't block page render */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      {/* Initialise dataLayer and configure GA4 */}
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            send_page_view: true,
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}
