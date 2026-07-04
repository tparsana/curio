"use client"

import { useEffect, useMemo, useRef } from "react"

const VIEWBOX_WIDTH = 640
const VIEWBOX_HEIGHT = 760
const GRID_SIZE = 9.5
const GRID_LEFT = 58
const GRID_TOP = 50
const DOT_RADIUS = 1.45
const DOT_FILL = "rgba(255, 255, 255, 1)"
const MIN_DOT_COUNT = 1100

type DotMatrixScrollArtProps = {
  className?: string
}

type LayoutDot = {
  col: number
  row: number
  opacity: number
}

type DotSpec = {
  noise: LayoutDot
  cards: LayoutDot
  play: LayoutDot
  ambient: LayoutDot
  isCardShapeDot: boolean
  isPlayShapeDot: boolean
  phase: number
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const progress = clamp((value - edge0) / (edge1 - edge0))
  return progress * progress * (3 - 2 * progress)
}

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

function gridX(col: number) {
  return GRID_LEFT + col * GRID_SIZE
}

function gridY(row: number) {
  return GRID_TOP + row * GRID_SIZE
}

function addDot(layout: LayoutDot[], col: number, row: number, opacity = 0.3) {
  layout.push({ col, row, opacity })
}

function addHorizontal(layout: LayoutDot[], startCol: number, row: number, length: number, opacity = 0.3) {
  for (let offset = 0; offset < length; offset += 1) {
    addDot(layout, startCol + offset, row, opacity)
  }
}

function addVertical(layout: LayoutDot[], col: number, startRow: number, length: number, opacity = 0.3) {
  for (let offset = 0; offset < length; offset += 1) {
    addDot(layout, col, startRow + offset, opacity)
  }
}

function addFilledRect(layout: LayoutDot[], startCol: number, startRow: number, width: number, height: number, opacity = 0.34) {
  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      addDot(layout, startCol + col, startRow + row, opacity)
    }
  }
}

function createDormantDot(index: number): LayoutDot {
  return {
    col: Math.round(9 + seededRandom(index + 701) * 42),
    row: Math.round(8 + seededRandom(index + 733) * 50),
    opacity: 0.018,
  }
}

function createAmbientDot(index: number): LayoutDot {
  return {
    col: Math.round(5 + seededRandom(index + 1701) * 50),
    row: Math.round(5 + seededRandom(index + 1733) * 58),
    opacity: 0.035 + seededRandom(index + 1741) * 0.045,
  }
}

function createScatteredNoise(count: number) {
  const layout: LayoutDot[] = []

  for (let index = 0; index < count; index += 1) {
    const cluster = seededRandom(index + 11)
    const centerCol = cluster < 0.36 ? 18 : cluster < 0.7 ? 31 : 43
    const centerRow = 4 + seededRandom(index + 17) * 60
    const colSpread = 11 + seededRandom(index + 23) * 12
    const rowSpread = 4 + seededRandom(index + 31) * 11
    const col = Math.round(centerCol + (seededRandom(index + 37) - 0.5) * colSpread * 2)
    const row = Math.round(centerRow + (seededRandom(index + 41) - 0.5) * rowSpread * 2)
    const opacity = 0.08 + seededRandom(index + 47) * 0.32

    addDot(layout, clamp(col, 3, 56), clamp(row, 3, 65), opacity)
  }

  return layout
}

function createVideoCards() {
  const layout: LayoutDot[] = []
  const cardLeft = 6
  const cardWidth = 46
  const cardHeight = 14

  for (let card = 0; card < 3; card += 1) {
    const top = 6 + card * 18
    const bottom = top + cardHeight
    const right = cardLeft + cardWidth

    addHorizontal(layout, cardLeft + 2, top, cardWidth - 3, 0.3)
    addHorizontal(layout, cardLeft + 2, bottom, cardWidth - 3, 0.3)
    addVertical(layout, cardLeft, top + 2, cardHeight - 3, 0.3)
    addVertical(layout, right, top + 2, cardHeight - 3, 0.3)
    addDot(layout, cardLeft + 1, top + 1, 0.2)
    addDot(layout, right - 1, top + 1, 0.2)
    addDot(layout, cardLeft + 1, bottom - 1, 0.2)
    addDot(layout, right - 1, bottom - 1, 0.2)

    addFilledRect(layout, cardLeft + 5, top + 4, 12, 7, 0.44)
    addHorizontal(layout, cardLeft + 21, top + 4, 20, 0.58)
    addHorizontal(layout, cardLeft + 21, top + 7, 16, 0.4)
    addHorizontal(layout, cardLeft + 21, top + 10, 11, 0.28)
    addHorizontal(layout, cardLeft + 35, top + 10, 6, 0.22)
  }

  return layout
}

function createPlayQueue() {
  const layout: LayoutDot[] = []
  const tipCol = 43
  const leftCol = 16
  const topRow = 15
  const bottomRow = 43
  const centerRow = (topRow + bottomRow) / 2

  for (let row = topRow; row <= bottomRow; row += 1) {
    const distanceFromCenter = Math.abs(row - centerRow)
    const edgeProgress = 1 - distanceFromCenter / ((bottomRow - topRow) / 2)
    const rightEdge = Math.round(leftCol + edgeProgress * (tipCol - leftCol))

    for (let col = leftCol; col <= rightEdge; col += 1) {
      addDot(layout, col, row, 0.58)
    }
  }

  return layout
}

function buildDots() {
  const cards = createVideoCards()
  const play = createPlayQueue()
  const count = Math.max(MIN_DOT_COUNT, cards.length, play.length)
  const noise = createScatteredNoise(count)

  return Array.from({ length: count }, (_, index): DotSpec => {
    const ambient = createAmbientDot(index)

    return {
      noise: noise[index] ?? createDormantDot(index),
      cards: cards[index] ?? ambient,
      play: play[index] ?? ambient,
      ambient,
      isCardShapeDot: index < cards.length,
      isPlayShapeDot: index < play.length,
      phase: seededRandom(index + 3000) * Math.PI * 2,
    }
  })
}

function getSectionTop(id: string) {
  const section = document.getElementById(id)

  if (!section) {
    return null
  }

  const rect = section.getBoundingClientRect()
  return window.scrollY + rect.top
}

function getScrollMorphProgress() {
  const heroTop = getSectionTop("top")
  const cardsTop = getSectionTop("what-is-curio")
  const playTop = getSectionTop("why-curio-exists")
  const viewportHeight = window.innerHeight
  const scrollY = window.scrollY

  if (heroTop === null || cardsTop === null || playTop === null) {
    const documentRange = Math.max(1, document.documentElement.scrollHeight - viewportHeight)
    const fallbackProgress = clamp(scrollY / documentRange)

    return {
      cardProgress: smoothstep(0.16, 0.42, fallbackProgress),
      playProgress: smoothstep(0.46, 0.74, fallbackProgress),
    }
  }

  return {
    cardProgress: smoothstep(cardsTop - viewportHeight * 0.95, cardsTop - viewportHeight * 0.32, scrollY),
    playProgress: smoothstep(playTop - viewportHeight * 0.9, playTop - viewportHeight * 0.28, scrollY),
  }
}

export function DotMatrixScrollArt({ className = "" }: DotMatrixScrollArtProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const circlesRef = useRef<Array<SVGCircleElement | null>>([])
  const dots = useMemo(buildDots, [])

  useEffect(() => {
    const frame = frameRef.current

    if (!frame) {
      return
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let animationFrame = 0
    const startedAt = performance.now()

    const renderDots = (currentTime: number) => {
      const { cardProgress, playProgress } = getScrollMorphProgress()
      const elapsed = reducedMotion ? 0 : (currentTime - startedAt) / 1000
      const noiseWeight = 1 - cardProgress
      const cardWeight = cardProgress * (1 - playProgress)
      const playWeight = playProgress

      dots.forEach((dot, index) => {
        const circle = circlesRef.current[index]

        if (!circle) {
          return
        }

        const ambientFlowCol = clamp(
          dot.ambient.col + Math.sin(elapsed * 0.58 + dot.phase * 1.3) * 1.85 + Math.sin(elapsed * 0.31 + dot.phase) * 1.1,
          3,
          56,
        )
        const ambientFlowRow = clamp(
          dot.ambient.row + Math.cos(elapsed * 0.52 + dot.phase * 1.2) * 1.7 + Math.sin(elapsed * 0.27 + dot.phase) * 1.05,
          3,
          65,
        )
        const cardTarget = dot.isCardShapeDot ? dot.cards : { ...dot.ambient, col: ambientFlowCol, row: ambientFlowRow }
        const playTarget = dot.isPlayShapeDot ? dot.play : { ...dot.ambient, col: ambientFlowCol, row: ambientFlowRow }
        const flowCol = clamp(
          dot.noise.col +
            (Math.sin(elapsed * 0.85 + dot.phase) * 2.6 + Math.sin(elapsed * 0.48 + dot.phase * 1.7) * 1.55) *
              noiseWeight,
          3,
          56,
        )
        const flowRow = clamp(
          dot.noise.row +
            (Math.cos(elapsed * 0.76 + dot.phase) * 2.35 + Math.sin(elapsed * 0.42 + dot.phase * 1.4) * 1.35) *
              noiseWeight,
          3,
          65,
        )
        const cardCol = lerp(flowCol, cardTarget.col, cardProgress)
        const cardRow = lerp(flowRow, cardTarget.row, cardProgress)
        const col = lerp(cardCol, playTarget.col, playProgress)
        const row = lerp(cardRow, playTarget.row, playProgress)
        const driftX = Math.sin(elapsed * 0.42 + dot.phase) * 0.08 * noiseWeight
        const driftY = Math.cos(elapsed * 0.36 + dot.phase) * 0.08 * noiseWeight
        const shimmer = reducedMotion ? 0 : Math.sin(elapsed * 1.05 + dot.phase) * 0.025
        const cardOpacity = dot.isCardShapeDot ? dot.cards.opacity : dot.ambient.opacity
        const playOpacity = dot.isPlayShapeDot ? dot.play.opacity : dot.ambient.opacity
        const opacity = clamp(
          dot.noise.opacity * noiseWeight + cardOpacity * cardWeight + playOpacity * playWeight + shimmer,
          0.004,
          0.62,
        )

        circle.setAttribute("cx", gridX(col + driftX).toFixed(2))
        circle.setAttribute("cy", gridY(row + driftY).toFixed(2))
        circle.setAttribute("opacity", opacity.toFixed(3))
      })

      if (!reducedMotion) {
        animationFrame = window.requestAnimationFrame(renderDots)
      }
    }

    animationFrame = window.requestAnimationFrame(renderDots)

    return () => {
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame)
      }
    }
  }, [dots])

  return (
    <div
      ref={frameRef}
      aria-hidden="true"
      className={`pointer-events-none relative mt-6 h-[29rem] overflow-hidden sm:mt-8 sm:h-[34rem] lg:sticky lg:top-[6.75rem] lg:mt-0 lg:h-[calc(100vh-8.5rem)] ${className}`}
    >
      <svg
        className="absolute left-1/2 top-1/2 h-[min(58rem,112%)] w-[min(49rem,112%)] -translate-x-1/2 -translate-y-1/2 overflow-visible"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {dots.map((dot, index) => (
          <circle
            key={index}
            ref={(node) => {
              circlesRef.current[index] = node
            }}
            cx={gridX(dot.noise.col)}
            cy={gridY(dot.noise.row)}
            r={DOT_RADIUS}
            fill={DOT_FILL}
            opacity={dot.noise.opacity}
          />
        ))}
      </svg>
    </div>
  )
}
