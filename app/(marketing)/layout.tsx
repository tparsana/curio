import type { Metadata } from "next"
import type React from "react"
import { Fraunces, Manrope } from "next/font/google"

import { nord } from "@/app/fonts"

const canonicalHost = "https://curio.tanishparsana.com"
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["400", "500", "600"],
})
const accent = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-accent",
  weight: ["400", "500"],
  style: ["italic"],
})

export const metadata: Metadata = {
  metadataBase: new URL(canonicalHost),
  title: {
    default: "Curio - Curate what you consume.",
    template: "%s | Curio",
  },
  description:
    "Curio is a calm, distraction-free watch-later app for saving videos, organizing a personal watchlist, and returning with intention.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: canonicalHost,
    title: "Curio - Curate what you consume.",
    description:
      "From chaos to clarity: save videos to watch later, organize your queue, and watch with intention.",
    siteName: "Curio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Curio - Curate what you consume.",
    description:
      "A premium, distraction-free way to build a video watchlist and return with intention.",
  },
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={`${manrope.variable} ${accent.variable} ${nord.variable} marketing-shell relative min-h-screen bg-[#0B0B0C] font-sans text-[color:var(--marketing-fg)]`}
      style={
        {
          "--marketing-bg": "#0B0B0C",
          "--marketing-panel": "#121214",
          "--marketing-border": "#2A2A2D",
          "--marketing-fg": "#EDE9E4",
          "--marketing-muted": "rgba(237,233,228,0.65)",
          "--marketing-sage": "191 216 194",
          "--marketing-sky": "191 215 234",
          "--marketing-lilac": "215 198 242",
          "--marketing-sand": "230 215 200",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}
