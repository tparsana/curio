import { cn } from "@/lib/utils"

type GlowVariant = "sage" | "sky" | "lilac" | "sand"

const glowRgb: Record<GlowVariant, string> = {
  sage: "var(--marketing-sage)",
  sky: "var(--marketing-sky)",
  lilac: "var(--marketing-lilac)",
  sand: "var(--marketing-sand)",
}

type GlowProps = {
  variant?: GlowVariant
  opacity?: number
  className?: string
}

export function Glow({ variant = "sky", opacity = 0.12, className }: GlowProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute rounded-full blur-3xl", className)}
      style={{
        background: `radial-gradient(circle, rgb(${glowRgb[variant]} / ${opacity}) 0%, rgb(${glowRgb[variant]} / 0) 70%)`,
      }}
    />
  )
}
