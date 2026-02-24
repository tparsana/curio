"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { motion, useMotionValueEvent, useScroll } from "framer-motion"
import { ArrowRight, MoveRight } from "lucide-react"

import { CurioLogo } from "@/components/branding/CurioLogo"
import { Glow } from "@/components/marketing/Glow"
import { GradientDivider } from "@/components/marketing/GradientDivider"
import { EditorialHeading, EditorialLabel } from "@/components/marketing/Type"
import { UnderlineAccent } from "@/components/marketing/UnderlineAccent"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  marketingCompareRows,
  marketingFaqs,
  marketingFeatures,
  marketingManifesto,
  marketingNavItems,
  marketingUseCases,
  marketingWhyWorks,
} from "@/lib/marketing-content"
import { cn } from "@/lib/utils"

function SectionReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.46, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function CMark({ className }: { className?: string }) {
  return <CurioLogo variant="mark" className={cn("text-[11px] text-[color:var(--marketing-fg)]", className)} />
}

function PastelDot({ variant = "sky", className }: { variant?: "sky" | "sage" | "lilac" | "sand"; className?: string }) {
  const variants = {
    sky: "bg-[rgb(var(--marketing-sky)/0.7)]",
    sage: "bg-[rgb(var(--marketing-sage)/0.7)]",
    lilac: "bg-[rgb(var(--marketing-lilac)/0.7)]",
    sand: "bg-[rgb(var(--marketing-sand)/0.7)]",
  }
  return <span className={cn("inline-flex h-1.5 w-1.5 rounded-full", variants[variant], className)} />
}

export function LandingPage() {
  const { scrollY } = useScroll()
  const [isCompact, setIsCompact] = useState(false)

  useMotionValueEvent(scrollY, "change", (value) => {
    setIsCompact(value > 18)
  })

  const [heroFeature, ...otherFeatures] = marketingFeatures

  return (
    <div className="relative isolate overflow-hidden">
      <Glow variant="sand" opacity={0.16} className="left-1/2 top-[-180px] h-[460px] w-[500px] -translate-x-1/2" />
      <Glow variant="sky" opacity={0.11} className="right-[-150px] top-[32%] h-[320px] w-[320px]" />

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
              ? "rounded-full border-[color:var(--marketing-border)] bg-[rgb(11_11_12/0.78)] py-3 shadow-[0_16px_38px_rgba(0,0,0,0.44)] backdrop-blur-xl"
              : "rounded-none bg-transparent py-4",
          )}
        >
          <Link
            href="/"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--marketing-fg)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
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
            className="h-9 rounded-full bg-[color:var(--marketing-fg)] px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-black hover:bg-[color:var(--marketing-fg)]/90"
          >
            <Link href="/app">Open Curio</Link>
          </Button>
        </motion.nav>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
        <section id="product" className="grid grid-cols-12 gap-x-6 gap-y-10 pb-16 sm:pb-20">
          <SectionReveal className="col-span-12 lg:col-span-8">
            <div className="mb-6 flex items-center gap-3">
              <PastelDot variant="sand" />
              <EditorialLabel>A calmer way to watch later.</EditorialLabel>
            </div>
            <h1 className="text-balance text-[34px] font-normal leading-[1.16] tracking-[-0.01em] text-[color:var(--marketing-fg)] sm:text-[50px] md:text-[58px]">
              Curio — Curate what you consume.
            </h1>
            <p className="mt-5 max-w-2xl text-[20px] font-[450] leading-[1.45] text-[color:var(--marketing-fg)]/92">
              Watch with{" "}
              <span className="font-accent text-[1.03em] italic text-[color:var(--marketing-fg)]">intention</span>.
            </p>
            <p className="mt-6 max-w-2xl text-pretty text-[16px] leading-8 text-[color:var(--marketing-muted)] sm:text-[17px]">
              Curio replaces endless watch later piles with a{" "}
              <UnderlineAccent variant="sage">calm library</UnderlineAccent>. Save what matters, add context, and
              return when you are ready with <UnderlineAccent variant="sky">clarity</UnderlineAccent> - without
              autoplay, noise, or algorithmic pressure.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="h-11 rounded-full bg-[color:var(--marketing-fg)] px-6 text-xs font-medium uppercase tracking-[0.1em] text-black hover:bg-[color:var(--marketing-fg)]/90"
              >
                <Link href="/app">
                  Open Curio
                  <MoveRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full border-[color:var(--marketing-border)] bg-transparent px-6 text-xs font-medium uppercase tracking-[0.1em] text-[color:var(--marketing-fg)] hover:bg-[color:var(--marketing-panel)]"
              >
                <Link href="#how-it-works">See how it works</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-[color:var(--marketing-muted)]">No autoplay. No noise. No algorithmic pressure.</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--marketing-sky)/0.25)] bg-[rgb(var(--marketing-sky)/0.08)] px-4 py-1.5 text-xs text-[color:var(--marketing-muted)]">
              Built for students • creators • deep work
            </div>
          </SectionReveal>
          <SectionReveal className="col-span-12 lg:col-span-4 lg:pt-16" delay={0.08}>
            <div className="space-y-3 rounded-2xl border border-[color:var(--marketing-border)] bg-[color:var(--marketing-panel)] p-6">
              <EditorialLabel className="text-[10px] tracking-[0.2em]">Curio — Watch with intention.</EditorialLabel>
              <p className="text-sm leading-7 text-[color:var(--marketing-muted)]">
                Curio shifts your watch-later habit from collection to curation.
              </p>
              <div className="space-y-2 pt-2 text-sm text-[color:var(--marketing-fg)]/90">
                <div className="flex items-center gap-2">
                  <PastelDot variant="sage" />
                  <span>Intentional queue</span>
                </div>
                <div className="flex items-center gap-2">
                  <PastelDot variant="lilac" />
                  <span>Organized library</span>
                </div>
                <div className="flex items-center gap-2">
                  <PastelDot variant="sky" />
                  <span>Calm revisits</span>
                </div>
              </div>
            </div>
          </SectionReveal>
          <div className="col-span-12 pt-3">
            <GradientDivider variant="sand" />
          </div>
        </section>

        <section id="why-curio" className="grid grid-cols-12 gap-x-6 gap-y-12 py-16 sm:py-20">
          <SectionReveal className="col-span-12 lg:col-span-6">
            <div className="mb-4 flex items-center gap-3">
              <PastelDot variant="lilac" />
              <EditorialLabel>Curio — From chaos to clarity.</EditorialLabel>
            </div>
            <EditorialHeading className="mb-6">From chaos to clarity</EditorialHeading>
            <p className="max-w-xl text-[16px] leading-8 text-[color:var(--marketing-muted)]">
              Most feeds optimize for volume, not understanding. Curio takes a library mindset: you save with purpose,
              sort with context, and revisit when your attention is available.
            </p>
          </SectionReveal>
          <SectionReveal className="col-span-12 lg:col-span-6 lg:pt-4" delay={0.06}>
            <ul className="space-y-4">
              {[
                "Save what matters.",
                "Organize with calm.",
                "Return with intention.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 border-b border-[rgb(42_42_45/0.95)] pb-4 text-[15px] text-[color:var(--marketing-fg)] last:border-none"
                >
                  <CMark className="text-[rgb(var(--marketing-sand)/0.95)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </SectionReveal>
          <div className="col-span-12 pt-2">
            <GradientDivider variant="lilac" />
          </div>
        </section>

        <section className="grid grid-cols-12 gap-x-6 gap-y-10 py-16 sm:py-20">
          <SectionReveal className="col-span-12 lg:col-span-7">
            <div className="mb-4 flex items-center gap-3">
              <PastelDot variant="sky" />
              <EditorialLabel>What is Curio?</EditorialLabel>
            </div>
            <p className="max-w-2xl text-[17px] leading-8 text-[color:var(--marketing-muted)]">
              Curio is a watch-later app and video watchlist that helps you save YouTube videos to watch later,
              organize them with tags and priority, and return to a distraction-free queue when you are ready to focus.
            </p>
          </SectionReveal>
          <SectionReveal className="col-span-12 lg:col-span-5" delay={0.06}>
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
          <div className="col-span-12 pt-2">
            <GradientDivider variant="sky" />
          </div>
        </section>

        <section id="why-curio-works" className="relative py-16 sm:py-20">
          <Glow variant="sage" opacity={0.14} className="left-[8%] top-[18%] h-[260px] w-[260px]" />
          <SectionReveal className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <PastelDot variant="sage" />
              <EditorialLabel>Why Curio works</EditorialLabel>
            </div>
            <EditorialHeading>Psychology of attention</EditorialHeading>
          </SectionReveal>

          <div className="grid grid-cols-12 gap-4">
            {marketingWhyWorks.map((item, index) => (
              <SectionReveal key={item.title} className="col-span-12 md:col-span-4" delay={0.04 * index}>
                <Card className="h-full rounded-2xl border-[color:var(--marketing-border)] bg-[color:var(--marketing-panel)] shadow-none">
                  <CardContent className="p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <PastelDot variant={index === 0 ? "sage" : index === 1 ? "sky" : "lilac"} />
                      <p className="font-nord text-[10px] uppercase tracking-[0.2em] text-[color:var(--marketing-muted)]">
                        {item.title}
                      </p>
                    </div>
                    <p className="text-sm leading-7 text-[color:var(--marketing-muted)]">{item.description}</p>
                  </CardContent>
                </Card>
              </SectionReveal>
            ))}
          </div>
          <SectionReveal className="mt-6">
            <p className="text-xs text-[color:var(--marketing-muted)]">Designed to reduce feed pressure.</p>
          </SectionReveal>
          <div className="pt-14">
            <GradientDivider variant="sage" />
          </div>
        </section>

        <section id="features" className="py-16 sm:py-20">
          <SectionReveal className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <PastelDot variant="sand" />
              <EditorialLabel>Core product blocks</EditorialLabel>
            </div>
            <EditorialHeading>Designed for calm throughput</EditorialHeading>
          </SectionReveal>
          <div className="grid grid-cols-12 gap-4">
            <SectionReveal className="col-span-12 lg:col-span-7">
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2, ease: "easeOut" }} className="h-full">
                <Card className="h-full rounded-2xl border-[color:var(--marketing-border)] bg-[color:var(--marketing-panel)] shadow-none">
                  <CardContent className="p-7 sm:p-8">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--marketing-sky)/0.4)] bg-[rgb(var(--marketing-sky)/0.08)] text-[color:var(--marketing-fg)]">
                      <heroFeature.icon className="h-4 w-4" />
                    </div>
                    <h3 className="font-nord text-[21px] font-normal uppercase tracking-[0.14em] text-[color:var(--marketing-fg)]">
                      {heroFeature.title}
                    </h3>
                    <p className="mt-3 text-[17px] text-[color:var(--marketing-fg)]/92">{heroFeature.subtitle}</p>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-[color:var(--marketing-muted)]">
                      {heroFeature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </SectionReveal>

            <div className="col-span-12 grid grid-cols-1 gap-4 lg:col-span-5">
              {otherFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <SectionReveal key={feature.title} delay={0.05 * (index + 1)}>
                    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                      <Card className="rounded-2xl border-[color:var(--marketing-border)] bg-[color:var(--marketing-panel)] shadow-none">
                        <CardContent className="p-6">
                          <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgb(var(--marketing-sand)/0.32)] bg-[rgb(var(--marketing-sand)/0.08)] text-[color:var(--marketing-fg)]">
                            <Icon className="h-4 w-4" />
                          </div>
                          <h3 className="font-nord text-[14px] font-normal uppercase tracking-[0.14em] text-[color:var(--marketing-fg)]">
                            {feature.title}
                          </h3>
                          <p className="mt-2 text-sm text-[color:var(--marketing-fg)]/90">{feature.subtitle}</p>
                          <p className="mt-2 text-sm leading-7 text-[color:var(--marketing-muted)]">{feature.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </SectionReveal>
                )
              })}
            </div>
          </div>
          <div className="pt-14">
            <GradientDivider variant="sand" />
          </div>
        </section>

        <section id="screens" className="py-16 sm:py-20">
          <SectionReveal className="mb-10">
            <EditorialHeading>A calmer way to watch later.</EditorialHeading>
          </SectionReveal>

          <div className="grid grid-cols-12 gap-4">
            {[
              "Screenshot / Video Library",
              "Screenshot / Video Detail",
              "Screenshot / Insights",
            ].map((label, index) => (
              <SectionReveal key={label} className={cn("col-span-12 md:col-span-4", index === 1 && "md:translate-y-6")}>
                <div className="aspect-[4/3] rounded-2xl border border-[color:var(--marketing-border)] bg-[color:var(--marketing-panel)] p-5">
                  {/* TODO: Replace with real product screenshot asset. */}
                  <p className="font-nord text-[10px] uppercase tracking-[0.18em] text-[color:var(--marketing-muted)]">
                    {label}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal className="mt-8">
            <div className="relative aspect-[16/6] rounded-2xl border border-[rgb(var(--marketing-lilac)/0.42)] bg-[color:var(--marketing-panel)] p-6">
              <Glow variant="lilac" opacity={0.12} className="right-[10%] top-[18%] h-[180px] w-[180px]" />
              {/* TODO: Replace with embedded 10-15s product walkthrough video component. */}
              <p className="font-nord text-[10px] uppercase tracking-[0.18em] text-[color:var(--marketing-muted)]">
                Video placeholder - 10-15s product walkthrough
              </p>
            </div>
          </SectionReveal>

          <SectionReveal className="mt-8 max-w-lg">
            <Card className="rounded-2xl border-[color:var(--marketing-border)] bg-[color:var(--marketing-panel)] shadow-none">
              <CardContent className="p-6">
                <EditorialLabel className="mb-4">Empty state preview</EditorialLabel>
                <p className="text-base text-[color:var(--marketing-fg)]">Your Curio is empty.</p>
                <p className="mt-2 text-sm text-[color:var(--marketing-muted)]">Add something worth your time.</p>
              </CardContent>
            </Card>
          </SectionReveal>
          <div className="pt-14">
            <GradientDivider variant="lilac" />
          </div>
        </section>

        <section id="how-it-works" className="py-16 sm:py-20">
          <SectionReveal className="mb-10">
            <EditorialHeading>How it works</EditorialHeading>
          </SectionReveal>
          <div className="grid grid-cols-12 gap-4">
            {[
              "Add what matters",
              "Organize your library",
              "Watch with intention",
            ].map((step, index) => (
              <SectionReveal key={step} className="col-span-12 md:col-span-4" delay={index * 0.04}>
                <Card className="h-full rounded-2xl border-[color:var(--marketing-border)] bg-[color:var(--marketing-panel)] shadow-none">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <CMark className="text-[rgb(var(--marketing-sage)/0.95)]" />
                      <p className="font-nord text-[10px] uppercase tracking-[0.2em] text-[color:var(--marketing-muted)]">
                        Step {index + 1}
                      </p>
                    </div>
                    <p className="text-base text-[color:var(--marketing-fg)]">{step}</p>
                  </CardContent>
                </Card>
              </SectionReveal>
            ))}
          </div>
          <div className="pt-14">
            <GradientDivider variant="sky" />
          </div>
        </section>

        <section id="compare" className="py-16 sm:py-20">
          <SectionReveal className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <PastelDot variant="sky" />
              <EditorialLabel>Compare</EditorialLabel>
            </div>
            <EditorialHeading>Curio vs alternatives</EditorialHeading>
          </SectionReveal>

          <SectionReveal>
            <div className="overflow-x-auto rounded-2xl border border-[color:var(--marketing-border)] bg-[color:var(--marketing-panel)]">
              <div className="grid min-w-[760px] grid-cols-4 border-b border-[color:var(--marketing-border)] bg-[rgb(255_255_255/0.01)] px-4 py-3 text-xs uppercase tracking-[0.13em] text-[color:var(--marketing-muted)]">
                <span className="col-span-1">Capability</span>
                <span className="text-[color:var(--marketing-fg)]">Curio</span>
                <span>YouTube Watch Later</span>
                <span>Bookmarks</span>
              </div>
              {marketingCompareRows.map((row, index) => (
                <motion.div
                  key={row.label}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "grid min-w-[760px] grid-cols-4 px-4 py-4 text-sm text-[color:var(--marketing-muted)]",
                    index < marketingCompareRows.length - 1 && "border-b border-[color:var(--marketing-border)]",
                  )}
                >
                  <p className="pr-3 text-[color:var(--marketing-fg)]/88">{row.label}</p>
                  <p className="text-[color:var(--marketing-fg)]">{row.curio}</p>
                  <p>{row.watchLater}</p>
                  <p>{row.bookmarks}</p>
                </motion.div>
              ))}
            </div>
          </SectionReveal>
          <div className="pt-14">
            <GradientDivider variant="sage" />
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <SectionReveal>
            <blockquote className="max-w-3xl text-[28px] font-normal leading-[1.45] text-[color:var(--marketing-fg)] sm:text-[36px]">
              Curio turns scattered links into a calm{" "}
              <UnderlineAccent variant="sand">
                <span className="font-accent italic">system</span>
              </UnderlineAccent>
              .
            </blockquote>
          </SectionReveal>
          <div className="pt-14">
            <GradientDivider variant="sand" />
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <SectionReveal className="max-w-xl">
            <EditorialLabel className="mb-6">Tiny manifesto</EditorialLabel>
            <div className="space-y-3 text-[23px] font-normal leading-[1.4] text-[color:var(--marketing-fg)] sm:text-[28px]">
              {marketingManifesto.map((line) => {
                if (line === "Let curiosity be calm.") {
                  return (
                    <p key={line}>
                      Let{" "}
                      <span className="font-accent text-[1.03em] italic text-[color:var(--marketing-fg)]">
                        curiosity
                      </span>{" "}
                      be calm.
                    </p>
                  )
                }
                return <p key={line}>{line}</p>
              })}
            </div>
          </SectionReveal>
          <div className="pt-14">
            <GradientDivider variant="lilac" />
          </div>
        </section>

        <section id="faq" className="py-16 sm:py-20">
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
          <div className="pt-14">
            <GradientDivider variant="sky" />
          </div>
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
                    className="h-11 rounded-full bg-[color:var(--marketing-fg)] px-6 text-xs font-medium uppercase tracking-[0.1em] text-black hover:bg-[color:var(--marketing-fg)]/90"
                  >
                    <Link href="/app">
                      Open Curio
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 rounded-full border-[color:var(--marketing-border)] bg-transparent px-6 text-xs font-medium uppercase tracking-[0.1em] text-[color:var(--marketing-fg)] hover:bg-black/30"
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
            <Link
              href="/privacy"
              className="transition-colors hover:text-[color:var(--marketing-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--marketing-fg)]"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-[color:var(--marketing-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--marketing-fg)]"
            >
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
