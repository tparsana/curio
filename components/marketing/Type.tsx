import type React from "react"

import { cn } from "@/lib/utils"

type TypeProps = {
  as?: React.ElementType
  className?: string
  children: React.ReactNode
}

export function EditorialHeading({ as: Comp = "h2", className, children }: TypeProps) {
  return (
    <Comp
      className={cn(
        "font-nord text-balance text-[26px] font-normal uppercase tracking-[0.18em] text-[color:var(--marketing-fg)] sm:text-[34px]",
        className,
      )}
    >
      {children}
    </Comp>
  )
}

export function EditorialLabel({ as: Comp = "p", className, children }: TypeProps) {
  return (
    <Comp
      className={cn(
        "font-nord text-[11px] uppercase tracking-[0.22em] text-[color:var(--marketing-muted)]",
        className,
      )}
    >
      {children}
    </Comp>
  )
}
