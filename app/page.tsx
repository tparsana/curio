import type { Metadata } from "next"
import Link from "next/link"

import { AuthRedirect } from "@/components/auth-redirect"
import { CurioLogo } from "@/components/branding/CurioLogo"
import { DotMatrixScrollArt } from "@/components/landing/dot-matrix-scroll-art"

const whatIsCurio = [
  {
    title: "Save what matters",
    description: "Not everything deserves your attention. Curio keeps the videos that do.",
  },
  {
    title: "Make your own queues",
    description: "Build playlists for work, learning, fitness, music, or to just lock in.",
  },
  {
    title: "Watch without drifting",
    description: "Open Curio, press play, and stay with the videos you chose.",
  },
]

const reasons = [
  {
    title: "YouTube is built for drift",
    description: "You open it for one video. The feed turns it into ten.",
  },
  {
    title: "Saved videos need structure",
    description: "Playlists, tags, and queues keep your library usable instead of buried.",
  },
  {
    title: "Watching should feel intentional",
    description: "Curio gives you the clean parts: save, organize, play, repeat.",
  },
]

const stats = [
  {
    value: "0",
    label: "ADs or Distractions",
  },
  {
    value: "1",
    label: "focused YouTube library",
  },
  {
    value: "3",
    label: "simple actions: save, sort, stay Curious",
  },
]

export const metadata: Metadata = {
  title: "Curio",
  description: "Curio is a calm video queue built to help you save, sort, and return with intention.",
}

export default function LandingPage() {
  return (
    <main className="relative isolate min-h-screen bg-[#080808] text-[#F5F5F0]">
      <AuthRedirect />

      <div className="fixed inset-x-0 top-4 z-50 px-4 sm:top-5">
        <nav className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 rounded-full bg-[linear-gradient(140deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] px-3 py-2 backdrop-blur-xl sm:px-4">
          <Link href="/" className="flex min-w-0 items-center">
            <CurioLogo variant="wordmark" className="text-sm uppercase tracking-[0.28em] text-white" />
          </Link>

          <div className="hidden items-center gap-1 text-sm text-white/62 md:flex">
            <a className="rounded-full px-3 py-2 transition-colors hover:text-white" href="#what-is-curio">
              Overview
            </a>
            <a className="rounded-full px-3 py-2 transition-colors hover:text-white" href="#why-curio-exists">
              Why it exists
            </a>
            <a className="rounded-full px-3 py-2 transition-colors hover:text-white" href="#site-footer">
              About
            </a>
          </div>

          <Link
            href="/signup"
            className="rounded-full border border-white/14 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#E9E9E4]"
          >
            Start now
          </Link>
        </nav>
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] lg:grid lg:min-h-screen lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
        <div className="bg-[#080808] px-6 pb-8 pt-28 sm:px-10 sm:pb-10 sm:pt-32 lg:col-start-1 lg:row-start-1 lg:px-16 lg:pb-6 lg:pt-36">
          <section id="top" className="flex min-h-[calc(100vh-7rem)] scroll-mt-28 items-center">
            <div className="max-w-[33rem] space-y-14">
              <div className="space-y-8">
                <h1 className="text-[4.8rem] font-medium leading-[0.92] tracking-[0.05em] text-white sm:text-[6rem] lg:text-[7.4rem]">
                  Curio
                </h1>
              </div>

              <div className="space-y-6">
                <p className="max-w-[31rem] text-lg leading-8 text-white/70 sm:text-[1.7rem] sm:leading-[1.55]">
                  No Premium. No ADs. No Fuss. No Feed. Only YouTube and Curiosity.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/signup"
                    className="rounded-full border border-white/14 bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-[#ECECE6]"
                  >
                    Create an account
                  </Link>
                  <a
                    href="#what-is-curio"
                    className="rounded-full border border-white/14 px-5 py-3 text-sm font-medium text-white/86 transition-colors hover:bg-white/6 hover:text-white"
                  >
                    What is Curio
                  </a>
                </div>

                <p className="text-sm leading-7 text-white/48">Stream and save YT videos, build playlists, arrange your library, distraction free.</p>
              </div>
            </div>
          </section>

          <section id="what-is-curio" className="scroll-mt-28 py-20 sm:py-24">
            <div className="max-w-[34rem] space-y-10">
              <div className="space-y-3">
                <p className="text-[0.68rem] uppercase tracking-[0.32em] text-white/44">What is Curio</p>
                <h2 className="text-3xl font-medium tracking-[-0.05em] text-white sm:text-4xl">
                  YouTube, organized around you.
                </h2>
                <p className="text-base leading-8 text-white/60 sm:text-lg">
                  Curio lets you save videos, arrange them into playlists, tag your library, and watch without the feed taking over.
                </p>
              </div>

              <div className="space-y-4">
                  {whatIsCurio.map((item) => (
                    <article
                      key={item.title}
                      className="rounded-[1.6rem] border border-[#242424] bg-[#101010] px-5 py-5 sm:px-6 sm:py-6"
                    >
                      <h3 className="text-base font-medium text-white sm:text-lg">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#A3A3A3] sm:text-[0.96rem]">{item.description}</p>
                    </article>
                  ))}
                </div>
            </div>
          </section>

          <section id="why-curio-exists" className="scroll-mt-28 pb-4 pt-20 sm:pb-6 sm:pt-24">
            <div className="max-w-[38rem] space-y-12">
              <div className="space-y-3">
                <p className="text-[0.68rem] uppercase tracking-[0.32em] text-white/44">Why Curio exists</p>
                <h2 className="text-3xl font-medium tracking-[-0.05em] text-white sm:text-4xl">
                  Your attention is already spread thin.
                </h2>
                <p className="text-base leading-8 text-white/60 sm:text-lg">
                  Most tools keep you watching.
                  <br />
                  Curio helps you stop, save, organize and return when you&apos;re ready.
                </p>
              </div>

              <div className="space-y-4">
                {reasons.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[1.6rem] border border-[#242424] bg-[#101010] px-5 py-5 sm:px-6 sm:py-6"
                  >
                    <h3 className="text-lg font-medium text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#A3A3A3] sm:text-[0.96rem]">{item.description}</p>
                  </article>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-[1.6rem] border border-[#242424] bg-[#101010] px-5 py-6">
                    <p className="text-3xl font-medium tracking-[-0.08em] text-white sm:text-4xl">{item.value}</p>
                    <p className="mt-3 max-w-[12rem] text-sm leading-6 text-[#A3A3A3]">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <p className="text-sm leading-7 text-white/48">Stay Curious.</p>
                <div className="flex items-center gap-4 text-sm text-white/56">
                  <Link className="transition-colors hover:text-white" href="/signup">
                    Sign up
                  </Link>
                  <Link className="transition-colors hover:text-white" href="/login">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="order-2 hidden px-4 pb-8 sm:px-6 sm:pb-10 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:block lg:px-8 lg:pb-12">
          <DotMatrixScrollArt />
        </aside>

        <footer
          id="site-footer"
          className="order-3 bg-[#080808] px-6 pb-8 pt-2 text-sm text-white/40 sm:px-10 sm:pb-10 lg:col-start-1 lg:row-start-2 lg:px-16 lg:pb-12 lg:pt-0"
        >
          <div className="flex items-center justify-between gap-6">
            <p>c. &copy; 2026 Curio. All rights reserved.</p>
            <p className="text-right">
              Created Curiously by{" "}
              <a
                href="https://www.tanishparsana.com"
                target="_blank"
                rel="noreferrer"
                className="text-white/66 transition-colors hover:text-white"
              >
                Tanish Parsana
              </a>
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
