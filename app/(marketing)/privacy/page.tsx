import type { Metadata } from "next"
import Link from "next/link"

import { CurioLogo } from "@/components/branding/CurioLogo"

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for Curio.",
  alternates: {
    canonical: "/privacy",
  },
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[900px] px-4 py-24 sm:px-6">
      <div className="mb-10 flex items-center justify-between border-b border-[color:var(--marketing-border)] pb-6">
        <CurioLogo variant="wordmark" className="text-sm text-[color:var(--marketing-fg)]" />
        <Link href="/" className="text-sm text-[color:var(--marketing-muted)] hover:text-[color:var(--marketing-fg)]">
          Back to home
        </Link>
      </div>
      <h1 className="font-nord text-2xl uppercase tracking-[0.18em] text-[color:var(--marketing-fg)] sm:text-3xl">
        Privacy
      </h1>
      <p className="mt-6 text-sm leading-8 text-[color:var(--marketing-muted)]">
        This is a placeholder privacy page for Curio. Replace with your final legal policy before launch.
      </p>
      <p className="mt-4 text-sm leading-8 text-[color:var(--marketing-muted)]">
        TODO: Add sections for collected data, usage purpose, retention, and deletion request process.
      </p>
    </main>
  )
}
