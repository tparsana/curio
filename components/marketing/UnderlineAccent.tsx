import type React from "react"

import { cn } from "@/lib/utils"

type AccentVariant = "sage" | "sky" | "lilac" | "sand"

const accentRgb: Record<AccentVariant, string> = {
  sage: "var(--marketing-sage)",
  sky: "var(--marketing-sky)",
  lilac: "var(--marketing-lilac)",
  sand: "var(--marketing-sand)",
}

type UnderlineAccentProps = {
  as?: React.ElementType
  variant?: AccentVariant
  className?: string
  children: React.ReactNode
}

export function UnderlineAccent({
  as: Comp = "span",
  variant = "sky",
  className,
  children,
}: UnderlineAccentProps) {
  return (
    <Comp className={cn("relative inline-flex", className)}>
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[0.07em] h-[2px] rounded-full"
        style={{
          background: `linear-gradient(90deg, rgb(${accentRgb[variant]} / 0), rgb(${accentRgb[variant]} / 0.55), rgb(${accentRgb[variant]} / 0))`,
        }}
      />
    </Comp>
  )
}
