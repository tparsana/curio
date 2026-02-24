import { cn } from "@/lib/utils"

type CurioLogoProps = {
  variant?: "wordmark" | "mark"
  className?: string
  dotClassName?: string
  trackingClassName?: string
}

export function CurioLogo({
  variant = "wordmark",
  className,
  dotClassName,
  trackingClassName,
}: CurioLogoProps) {
  const label = variant === "mark" ? "c" : "curio"

  return (
    <span className={cn("inline-flex items-baseline", className)}>
      {/* TODO: Replace this typographic placeholder with a finalized Curio SVG logo mark. */}
      <span
        className={cn(
          "font-medium lowercase leading-none text-[0.98em]",
          variant === "wordmark" ? "tracking-[0.1em]" : "tracking-[0.18em]",
          trackingClassName,
        )}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "ml-[0.04em] inline-block h-[0.24em] w-[0.24em] rounded-full bg-current align-[0.14em]",
          dotClassName,
        )}
      />
      <span className="sr-only">Curio</span>
    </span>
  )
}
