import type { Metadata } from "next"

import { LandingPage } from "@/components/marketing/LandingPage"
import { marketingFaqs } from "@/lib/marketing-content"

const canonicalHost = "https://curio.tanishparsana.com"

export const metadata: Metadata = {
  title: "Curio - Curate what you consume.",
  description:
    "Curio is a watch-later app and distraction-free video watchlist for saving YouTube videos to watch later, organizing your queue, and watching with intention.",
  keywords: [
    "watch videos later",
    "save videos to watch later",
    "save YouTube videos to watch later",
    "video watchlist",
    "distraction-free queue",
    "Curio app",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Curio - Curate what you consume.",
    description:
      "From chaos to clarity. Save what matters, organize your watchlist, and return with intention.",
    url: canonicalHost,
    type: "website",
    siteName: "Curio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Curio - Curate what you consume.",
    description:
      "A premium, distraction-free watch-later product for focused learning and intentional viewing.",
  },
}

export default function MarketingHomePage() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Curio",
    url: canonicalHost,
    description:
      "Curio is a calm watch-later app and video watchlist for saving videos to watch later and organizing a distraction-free queue.",
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Curio",
    url: canonicalHost,
    logo: `${canonicalHost}/icon.svg`,
    sameAs: [
      "https://curio.tanishparsana.com",
      "https://solo.to/tparsana",
      // TODO: Add official Curio social URLs when available.
    ],
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: marketingFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <LandingPage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
