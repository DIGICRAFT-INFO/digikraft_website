const fs = require("fs");
const { SitemapStream, streamToPromise } = require("sitemap");
const path = require("path");

const baseUrl = "https://www.digikraftsocial.com";

async function generateSitemap() {
  const smStream = new SitemapStream({ hostname: baseUrl });

  // Static pages you want to include
  const pages = [
    "", // Homepage
    "/about",
    "/service",
    "/contact",
    "/blog",
    "/feature",
    "/seo",
    "/qr",

    // Add more static or dynamic routes here
  ];

  pages.forEach((page) => {
    smStream.write({ url: page, changefreq: "weekly", priority: 0.8 });
  });

  smStream.end();

  const sitemap = await streamToPromise(smStream).then((sm) => sm.toString());

  // Save to public/sitemap.xml
  fs.writeFileSync(path.join(__dirname, "../public/sitemap.xml"), sitemap);
  console.log("✅ Sitemap successfully created at public/sitemap.xml");
}

generateSitemap();
