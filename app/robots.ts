import type { MetadataRoute } from "next"

const canonicalHost = "https://curio.tanishparsana.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    host: canonicalHost,
    sitemap: `${canonicalHost}/sitemap.xml`,
  }
}
