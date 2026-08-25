import type { MetadataRoute } from "next";
import { site } from "@/data/beefbar";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/styleguide" }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
