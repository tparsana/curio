"use client"

import { useState } from "react"
import type React from "react"
import Link from "next/link"
import { motion, useMotionValueEvent, useScroll } from "framer-motion"
import { ArrowRight, MoveRight } from "lucide-react"

import { CurioLogo } from "@/components/branding/CurioLogo"
import { EditorialHeading, EditorialLabel } from "@/components/marketing/Type"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  marketingFaqs,
  marketingFeatures,
  marketingNavItems,
  marketingUseCases,
} from "@/lib/marketing-content"
import { cn } from "@/lib/utils"

function SectionReveal({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function CMark({ className }: { className?: string }) {
  return <CurioLogo variant="mark" className={cn("text-[11px] text-[color:var(--marketing-fg)]", className)} />
}

export function LandingPage() {
  const { scrollY } = useScroll()
  const [isCompact, setIsCompact] = useState(false)

  useMotionValueEvent(scrollY, "change", (value) => {
    setIsCompact(value > 18)
  })

  return (
    <div className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-220px] h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(237,233,228,0.18)_0%,_rgba(237,233,228,0)_68%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-160px] top-[38%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,_rgba(162,175,188,0.14)_0%,_rgba(162,175,188,0)_70%)] blur-3xl"
      />

      <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6">
        <motion.nav
          initial={false}
          animate={{
            y: isCompact ? 4 : 0,
            scale: isCompact ? 0.988 : 1,
          }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className={cn(
            "mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 border border-transparent px-4 sm:px-6",
            isCompact
              ? "rounded-full border-[color:var(--marketing-border)] bg-[rgba(11,11,12,0.76)] py-3 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
              : "rounded-none bg-transparent py-4",
          )}
        >
          <Link href="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--marketing-fg)] focus-visible:ring-offset-black">
            <CurioLogo variant="wordmark" className="text-[15px] text-[color:var(--marketing-fg)]" />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {marketingNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-[color:var(--marketing-muted)] transition-colors hover:text-[color:var(--marketing-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--marketing-fg)]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Button
            asChild
            className="h-9 rounded-full bg-[color:var(--marketing-fg)] px-4 text-xs font-medium uppercase tracking-[0.08em] text-black hover:bg-[color:var(--marketing-fg)]/90"
          >
            <Link href="/app">Open Curio</Link>
          </Button>
        </motion.nav>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
        <section id="product" className="grid grid-cols-12 gap-x-6 gap-y-10 border-b border-[color:var(--marketing-border)] pb-16 sm:pb-20">
          <SectionReveal className="col-span-12 lg:col-span-8">
            <EditorialLabel className="mb-5">Curio — Watch with intention.</EditorialLabel>
            <h1 className="font-nord text-balance text-[34px] font-medium leading-[1.12] tracking-[0.12em] text-[color:var(--marketing-fg)] sm:text-[50px] md:text-[58px]">
              Curio — Curate what you consume.
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-[17px] leading-8 text-[color:var(--marketing-muted)]">
              A distraction-free library to save videos, organize them, and return when it matters-on your terms.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                asChild
                className="h-11 rounded-full bg-[color:var(--marketing-fg)] px-6 text-xs uppercase tracking-[0.1em] text-black hover:bg-[color:var(--marketing-fg)]/90"
              >
                <Link href="/app">
                  Open Curio
                  <MoveRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full border-[color:var(--marketing-border)] bg-transparent px-6 text-xs uppercase tracking-[0.1em] text-[color:var(--marketing-fg)] hover:bg-[color:var(--marketing-panel)]"
              >
                <Link href="#how-it-works">See how it works</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-[color:var(--marketing-muted)]">No autoplay. No noise. No algorithmic pressure.</p>
          </SectionReveal>
        </section>

        <section id="why-curio" className="grid grid-cols-12 gap-x-6 gap-y-10 border-b border-[color:var(--marketing-border)] py-16 sm:py-20">
          <SectionReveal className="col-span-12 lg:col-span-7">
            <EditorialLabel className="mb-4">Curio — From chaos to clarity.</EditorialLabel>
            <EditorialHeading className="mb-7">From chaos to clarity</EditorialHeading>
            <p className="max-w-xl text-base leading-8 text-[color:var(--marketing-muted)]">
              Most video feeds are built for volume, not intention. Curio reframes your watch-later workflow into a
              calm system where what you save has context, and what you watch has purpose.
            </p>
          </SectionReveal>
          <SectionReveal className="col-span-12 lg:col-span-5">
            <ul className="space-y-4">
              {[
                "Save what matters.",
                "Organize with calm.",
                "Return with intention.",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 border-b border-[color:var(--marketing-border)] pb-4 text-[15px] text-[color:var(--marketing-fg)] last:border-none">
                  <CMark />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </SectionReveal>
        </section>

        <section className="grid grid-cols-12 gap-x-6 gap-y-10 border-b border-[color:var(--marketing-border)] py-16 sm:py-20">
          <SectionReveal className="col-span-12 lg:col-span-7">
            <EditorialHeading className="mb-7">What is Curio?</EditorialHeading>
            <p className="max-w-2xl text-base leading-8 text-[color:var(--marketing-muted)]">
              Curio is a watch-later app and video watchlist that helps you save YouTube videos to watch later, keep
              your queue organized, and cut through feed noise. It is built for people who want a distraction-free
              queue instead of another endless scroll.
            </p>
          </SectionReveal>
          <SectionReveal className="col-span-12 lg:col-span-5">
            <div className="space-y-3">
              {marketingUseCases.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[color:var(--marketing-border)] bg-[color:var(--marketing-panel)] px-4 py-4 text-sm leading-7 text-[color:var(--marketing-muted)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </SectionReveal>
        </section>

        <section id="features" className="border-b border-[color:var(--marketing-border)] py-16 sm:py-20">
          <SectionReveal className="mb-10">
            <EditorialHeading>Core product blocks</EditorialHeading>
          </SectionReveal>
          <div className="grid grid-cols-12 gap-4">
            {marketingFeatures.map((feature) => {
              const Icon = feature.icon
              return (
                <SectionReveal key={feature.title} className="col-span-12 md:col-span-6">
                  <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                    <Card className="h-full rounded-2xl border-[color:var(--marketing-border)] bg-[color:var(--marketing-panel)] shadow-none">
                      <CardContent className="p-6">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--marketing-border)] text-[color:var(--marketing-fg)]">
                          <Icon className="h-4 w-4" />
                        </div>
                        <h3 className="font-nord text-lg font-medium uppercase tracking-[0.13em] text-[color:var(--marketing-fg)]">
                          {feature.title}
                        </h3>
                        <p className="mt-2 text-sm font-medium text-[color:var(--marketing-fg)]">{feature.subtitle}</p>
                        <p className="mt-3 text-sm leading-7 text-[color:var(--marketing-muted)]">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </SectionReveal>
              )
            })}
          </div>
        </section>

        <section id="screens" className="border-b border-[color:var(--marketing-border)] py-16 sm:py-20">
          <SectionReveal className="mb-10">
            <EditorialHeading>A calmer way to watch later</EditorialHeading>
          </SectionReveal>

          <div className="grid grid-cols-12 gap-4">
            {[
              "Screenshot / Video Library",
              "Screenshot / Video Detail",
              "Screenshot / Insights",
            ].map((label) => (
              <SectionReveal key={label} className="col-span-12 md:col-span-4">
                <div className="aspect-[4/3] rounded-2xl border border-[color:var(--marketing-border)] bg-[color:var(--marketing-panel)] p-5">
                  {/* TODO: Replace with real product screenshot asset. */}
                  <p className="font-nord text-xs uppercase tracking-[0.16em] text-[color:var(--marketing-muted)]">
                    {label}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal className="mt-4">
            <div className="aspect-[16/6] rounded-2xl border border-[color:var(--marketing-border)] bg-[color:var(--marketing-panel)] p-6">
              {/* TODO: Replace with embedded 10-15s product walkthrough video component. */}
              <p className="font-nord text-xs uppercase tracking-[0.16em] text-[color:var(--marketing-muted)]">
                Video placeholder - 10-15s product walkthrough
              </p>
            </div>
          </SectionReveal>
        </section>

        <section className="border-b border-[color:var(--marketing-border)] py-16 sm:py-20">
          <SectionReveal className="max-w-lg">
            <Card className="rounded-2xl border-[color:var(--marketing-border)] bg-[color:var(--marketing-panel)] shadow-none">
              <CardContent className="p-6">
                <EditorialLabel className="mb-4">Empty state preview</EditorialLabel>
                <p className="text-base font-medium text-[color:var(--marketing-fg)]">Your Curio is empty.</p>
                <p className="mt-2 text-sm text-[color:var(--marketing-muted)]">Add something worth your time.</p>
              </CardContent>
            </Card>
          </SectionReveal>
        </section>

        <section id="how-it-works" className="border-b border-[color:var(--marketing-border)] py-16 sm:py-20">
          <SectionReveal className="mb-10">
            <EditorialHeading>How it works</EditorialHeading>
          </SectionReveal>
          <div className="grid grid-cols-12 gap-4">
            {[
              "Add what matters",
              "Organize your library",
              "Watch with intention",
            ].map((step, index) => (
              <SectionReveal key={step} className="col-span-12 md:col-span-4">
                <Card className="h-full rounded-2xl border-[color:var(--marketing-border)] bg-[color:var(--marketing-panel)] shadow-none">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <CMark />
                      <p className="font-nord text-xs uppercase tracking-[0.2em] text-[color:var(--marketing-muted)]">
                        Step {index + 1}
                      </p>
                    </div>
                    <p className="text-base text-[color:var(--marketing-fg)]">{step}</p>
                  </CardContent>
                </Card>
              </SectionReveal>
            ))}
          </div>
        </section>

        <section className="border-b border-[color:var(--marketing-border)] py-16 sm:py-20">
          <SectionReveal className="mb-10">
            <EditorialHeading>From people like you</EditorialHeading>
          </SectionReveal>
          <div className="grid grid-cols-12 gap-4">
            {[
              {
                role: "Student",
                quote:
                  "Curio helped me stop losing lecture links and actually finish what I saved.",
              },
              {
                role: "Creator",
                quote:
                  "I finally have a clean queue for tutorials instead of 40 chaotic open tabs.",
              },
              {
                role: "Analyst",
                quote:
                  "It feels calm. I save research quickly and come back when I can focus.",
              },
            ].map((item) => (
              <SectionReveal key={item.role} className="col-span-12 md:col-span-4">
                <Card className="h-full rounded-2xl border-[color:var(--marketing-border)] bg-[color:var(--marketing-panel)] shadow-none">
                  <CardContent className="p-6">
                    <p className="text-sm leading-7 text-[color:var(--marketing-muted)]">{item.quote}</p>
                    <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[color:var(--marketing-fg)]">{item.role}</p>
                  </CardContent>
                </Card>
              </SectionReveal>
            ))}
          </div>
        </section>

        <section id="faq" className="border-b border-[color:var(--marketing-border)] py-16 sm:py-20">
          <SectionReveal className="mb-10">
            <EditorialHeading>FAQ</EditorialHeading>
          </SectionReveal>
          <SectionReveal>
            <Card className="rounded-2xl border-[color:var(--marketing-border)] bg-[color:var(--marketing-panel)] shadow-none">
              <CardContent className="p-2 sm:p-5">
                <Accordion type="single" collapsible className="w-full">
                  {marketingFaqs.map((item, index) => (
                    <AccordionItem
                      key={item.question}
                      value={`faq-${index}`}
                      className="border-[color:var(--marketing-border)] px-3"
                    >
                      <AccordionTrigger className="text-left text-sm text-[color:var(--marketing-fg)] hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-7 text-[color:var(--marketing-muted)]">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </SectionReveal>
        </section>

        <section className="py-16 sm:py-20">
          <SectionReveal>
            <Card className="rounded-2xl border-[color:var(--marketing-border)] bg-[color:var(--marketing-panel)] shadow-none">
              <CardContent className="p-8 sm:p-10">
                <EditorialHeading className="text-[26px] sm:text-[34px]">Start building your Curio</EditorialHeading>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[color:var(--marketing-muted)]">
                  Save less. Choose better. Return with intention.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button
                    asChild
                    className="h-11 rounded-full bg-[color:var(--marketing-fg)] px-6 text-xs uppercase tracking-[0.1em] text-black hover:bg-[color:var(--marketing-fg)]/90"
                  >
                    <Link href="/app">
                      Open Curio
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 rounded-full border-[color:var(--marketing-border)] bg-transparent px-6 text-xs uppercase tracking-[0.1em] text-[color:var(--marketing-fg)] hover:bg-black/30"
                  >
                    <Link href="#product">Learn more</Link>
                  </Button>
                </div>
                <div className="mt-8 border-t border-[color:var(--marketing-border)] pt-6">
                  <CurioLogo variant="wordmark" className="text-[13px] text-[color:var(--marketing-fg)]" />
                </div>
              </CardContent>
            </Card>
          </SectionReveal>
        </section>
      </main>

      <footer className="border-t border-[color:var(--marketing-border)] py-8">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-4 text-sm text-[color:var(--marketing-muted)] sm:px-6">
          <div className="flex items-center gap-3">
            <CMark />
            <span>&copy; {new Date().getFullYear()} Curio. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="transition-colors hover:text-[color:var(--marketing-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--marketing-fg)]">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[color:var(--marketing-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--marketing-fg)]">
              Terms
            </Link>
            <a
              href="mailto:hello@curio.app"
              className="transition-colors hover:text-[color:var(--marketing-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--marketing-fg)]"
            >
              Contact
            </a>
          </div>
          <p>
            Created Curiously by{" "}
            <a
              href="https://solo.to/tparsana"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--marketing-fg)] transition-colors hover:text-[color:var(--marketing-fg)]/80"
            >
              Tanish Parsana
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
