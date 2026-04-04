"use client"

import { useEffect, useRef } from "react"

import { ASCII_ART } from "@/components/landing/ascii-art"

const STICKY_TOP = 108
const FRAME_PADDING = 4
const SCALE_MULTIPLIER = 1.35
const MAX_SCALE = 1.75

export function AsciiScrollPanel() {
  const frameRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    const frame = frameRef.current
    const art = artRef.current
    const container = frame?.parentElement

    if (!frame || !art || !container) {
      return
    }

    let animationFrame = 0

    const syncArtPosition = () => {
      animationFrame = 0

      const containerTop = window.scrollY + container.getBoundingClientRect().top
      const stickyStart = Math.max(0, containerTop - STICKY_TOP)
      const stickyRange = Math.max(1, container.scrollHeight - frame.clientHeight)
      const progress = Math.min(1, Math.max(0, (window.scrollY - stickyStart) / stickyRange))
      const availableWidth = Math.max(1, frame.clientWidth - FRAME_PADDING)
      const fitScale = availableWidth / art.scrollWidth
      const scale = Math.min(MAX_SCALE, fitScale * SCALE_MULTIPLIER)
      const scaledHeight = art.scrollHeight * scale
      const travelDistance = Math.max(0, scaledHeight - frame.clientHeight)

      art.style.transform = `translate3d(-50%, ${-travelDistance * progress}px, 0) scale(${scale})`
    }

    const requestSync = () => {
      if (animationFrame !== 0) {
        return
      }

      animationFrame = window.requestAnimationFrame(syncArtPosition)
    }

    requestSync()
    window.addEventListener("scroll", requestSync, { passive: true })
    window.addEventListener("resize", requestSync)

    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(requestSync) : null
    resizeObserver?.observe(frame)
    resizeObserver?.observe(art)

    return () => {
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame)
      }

      window.removeEventListener("scroll", requestSync)
      window.removeEventListener("resize", requestSync)
      resizeObserver?.disconnect()
    }
  }, [])

  return (
    <div
      ref={frameRef}
      aria-hidden="true"
      className="relative mt-6 h-[29rem] overflow-hidden sm:mt-8 sm:h-[34rem] lg:sticky lg:top-[6.75rem] lg:mt-0 lg:h-[calc(100vh-8.5rem)]"
    >
      <pre
        ref={artRef}
        className="pointer-events-none absolute left-1/2 top-0 m-0 w-max origin-top whitespace-pre text-center font-mono text-[12px] leading-[0.72rem] text-white/[0.3] antialiased sm:text-[13px] sm:leading-[0.76rem] xl:text-[14px] xl:leading-[0.82rem]"
      >
        {ASCII_ART}
      </pre>
    </div>
  )
}
