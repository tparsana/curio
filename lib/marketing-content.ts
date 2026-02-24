import type { LucideIcon } from "lucide-react"
import { Archive, Compass, ListTodo, PlayCircle } from "lucide-react"

export type MarketingFaq = {
  question: string
  answer: string
}

export const marketingNavItems = [
  { label: "Product", href: "#product" },
  { label: "Why Curio", href: "#why-curio" },
  { label: "Features", href: "#features" },
  { label: "Screens", href: "#screens" },
  { label: "FAQ", href: "#faq" },
]

export const marketingUseCases = [
  "Students saving lectures for focused study sessions.",
  "Creators bookmarking tutorials for their next project sprint.",
  "Professionals curating research playlists for deep work.",
]

export type MarketingFeature = {
  title: string
  subtitle: string
  description: string
  icon: LucideIcon
}

export const marketingFeatures: MarketingFeature[] = [
  {
    title: "Library",
    subtitle: "Everything you save, organized.",
    description:
      "Keep important videos in one calm place with tags and structure that make sense.",
    icon: Archive,
  },
  {
    title: "Up Next",
    subtitle: "What you actually plan to watch.",
    description:
      "Turn scattered links into a deliberate queue so your next watch decision is effortless.",
    icon: ListTodo,
  },
  {
    title: "Progress",
    subtitle: "Know what you've watched.",
    description:
      "Track what is complete, what is pending, and where your attention should go next.",
    icon: PlayCircle,
  },
  {
    title: "Distraction-free",
    subtitle: "No autoplay. No noise.",
    description:
      "Curio gives you a focused environment without feed pressure or algorithmic detours.",
    icon: Compass,
  },
]

export const marketingFaqs: MarketingFaq[] = [
  {
    question: "What is Curio?",
    answer:
      "Curio is a watch-later app and distraction-free video watchlist that helps you save videos, organize them, and return with intention.",
  },
  {
    question: "Can Curio help me watch videos later?",
    answer:
      "Yes. Curio is built for people who want a clean place to save videos now and watch them later without losing focus.",
  },
  {
    question: "Can I save YouTube videos to watch later in Curio?",
    answer:
      "Yes. Curio helps you save YouTube videos to watch later in a private library you can sort by relevance and priority.",
  },
  {
    question: "How is Curio different from YouTube Watch Later?",
    answer:
      "Curio is designed as a calm, distraction-free queue with intentional organization, not a feed-centric extension of the platform.",
  },
  {
    question: "Is Curio free?",
    answer:
      "Curio currently supports a simple core experience. Pricing and plan details can be added as the product evolves.",
  },
  {
    question: "Can I organize my watchlist with tags?",
    answer:
      "Yes. Curio supports organization workflows such as tags and priority so your watchlist reflects what matters most.",
  },
  {
    question: "Who is Curio built for?",
    answer:
      "Curio is made for students, creators, and professionals who want to curate a focused video library for learning and research.",
  },
  {
    question: "Does Curio support a distraction-free queue?",
    answer:
      "Yes. Curio is designed for deliberate viewing with no autoplay, no noise, and less algorithmic pressure.",
  },
]
