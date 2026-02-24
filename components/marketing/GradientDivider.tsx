import { cn } from "@/lib/utils"

type DividerVariant = "sage" | "sky" | "lilac" | "sand"

const dividerRgb: Record<DividerVariant, string> = {
  sage: "var(--marketing-sage)",
  sky: "var(--marketing-sky)",
  lilac: "var(--marketing-lilac)",
  sand: "var(--marketing-sand)",
}

type GradientDividerProps = {
  variant?: DividerVariant
  className?: string
}

export function GradientDivider({ variant = "sky", className }: GradientDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("h-px w-full", className)}
      style={{
        background: `linear-gradient(90deg, rgb(42 42 45 / 0), rgb(${dividerRgb[variant]} / 0.4), rgb(42 42 45 / 1), rgb(${dividerRgb[variant]} / 0.22), rgb(42 42 45 / 0))`,
      }}
    />
  )
}
