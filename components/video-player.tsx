"use client"

import { useEffect, useRef } from "react"
import { ArrowLeft, ListVideo, Play, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useVideo, type Video } from "./video-provider"

declare global {
  interface Window {
    YT?: any
    onYouTubeIframeAPIReady?: () => void
  }
}

interface VideoPlayerProps {
  video: Video
}

const ensureYouTubeIframeApi = () =>
  new Promise<void>((resolve) => {
    if (typeof window === "undefined") return
    if (window.YT?.Player) {
      resolve()
      return
    }

    const previousReadyHandler = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previousReadyHandler?.()
      resolve()
    }

    if (!document.getElementById("youtube-iframe-api")) {
      const script = document.createElement("script")
      script.id = "youtube-iframe-api"
      script.src = "https://www.youtube.com/iframe_api"
      document.head.appendChild(script)
    }
  })

export function VideoPlayer({ video }: VideoPlayerProps) {
  const {
    setSelectedVideo,
    playlistPlayback,
    playPlaylistVideo,
    playNextPlaylistVideo,
    setPlaylistAutoplay,
  } = useVideo()
  const playerContainerRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<any>(null)
  const isPlayerReadyRef = useRef(false)
  const loadedVideoIdRef = useRef<string | null>(null)
  const autoplayRef = useRef(false)
  const hasNextRef = useRef(false)
  const playNextRef = useRef(playNextPlaylistVideo)
  const currentVideoIdRef = useRef(video.youtube_id)
  const handledEndedVideoIdRef = useRef<string | null>(null)

  const actualCurrentIndex = playlistPlayback
    ? playlistPlayback.playlist.videos.findIndex((item) => item.youtube_id === video.youtube_id)
    : -1
  const safeCurrentIndex = actualCurrentIndex >= 0 ? actualCurrentIndex : playlistPlayback?.currentIndex ?? 0
  const nextVideo = playlistPlayback?.playlist.videos[safeCurrentIndex + 1] || null

  useEffect(() => {
    autoplayRef.current = Boolean(playlistPlayback?.autoplay)
    hasNextRef.current = Boolean(nextVideo)
    playNextRef.current = playNextPlaylistVideo
    currentVideoIdRef.current = video.youtube_id
    handledEndedVideoIdRef.current = null
  }, [playlistPlayback?.autoplay, nextVideo, playNextPlaylistVideo, video.youtube_id])

  useEffect(() => {
    let cancelled = false

    const createOrUpdatePlayer = async () => {
      await ensureYouTubeIframeApi()
      if (cancelled || !playerContainerRef.current) return

      if (!playerRef.current) {
        playerRef.current = new window.YT.Player(playerContainerRef.current, {
          videoId: video.youtube_id,
          playerVars: {
            autoplay: 1,
            rel: 0,
            playsinline: 1,
          },
          events: {
            onReady: (event: any) => {
              isPlayerReadyRef.current = true
              loadedVideoIdRef.current = video.youtube_id
              event.target.playVideo()
            },
            onStateChange: (event: any) => {
              if (
                event.data === window.YT.PlayerState.ENDED &&
                autoplayRef.current &&
                hasNextRef.current &&
                handledEndedVideoIdRef.current !== currentVideoIdRef.current
              ) {
                handledEndedVideoIdRef.current = currentVideoIdRef.current
                playNextRef.current()
              }
            },
          },
        })
        return
      }

      if (isPlayerReadyRef.current && loadedVideoIdRef.current !== video.youtube_id) {
        loadedVideoIdRef.current = video.youtube_id
        playerRef.current.loadVideoById(video.youtube_id)
      }
    }

    createOrUpdatePlayer()

    return () => {
      cancelled = true
    }
  }, [video.youtube_id])

  useEffect(() => {
    return () => {
      playerRef.current?.destroy?.()
      playerRef.current = null
      isPlayerReadyRef.current = false
      loadedVideoIdRef.current = null
    }
  }, [])

  return (
    <div className="mt-6 mx-auto max-w-[1500px]">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedVideo(null)}
          className="w-fit text-[#EDE9E4]/80 hover:bg-[#151518] hover:text-[#EDE9E4]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to videos
        </Button>

        {playlistPlayback && (
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              disabled={!nextVideo}
              onClick={playNextPlaylistVideo}
              className="border-[#2A2A2D] bg-[#121214] text-[#EDE9E4] hover:bg-[#1A1A1D] hover:text-[#EDE9E4] disabled:text-[#EDE9E4]/35"
            >
              <SkipForward className="mr-2 h-4 w-4" />
              Next video
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPlaylistAutoplay(!playlistPlayback.autoplay)}
              className={
                playlistPlayback.autoplay
                  ? "border-[#EDE9E4]/30 bg-[#EDE9E4] text-[#0B0B0C] hover:bg-[#D8D3CB] hover:text-[#0B0B0C]"
                  : "border-[#2A2A2D] bg-[#121214] text-[#EDE9E4] hover:bg-[#1A1A1D] hover:text-[#EDE9E4]"
              }
            >
              Autoplay {playlistPlayback.autoplay ? "on" : "off"}
            </Button>
          </div>
        )}
      </div>

      <div className={playlistPlayback ? "grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]" : ""}>
        <div className="overflow-hidden rounded-xl border border-[#2A2A2D] bg-[#121214]">
          <div className="aspect-video w-full bg-black">
            <div ref={playerContainerRef} title={video.title} className="h-full w-full" />
          </div>
        </div>

        {playlistPlayback && (
          <aside className="overflow-hidden rounded-xl border border-[#2A2A2D] bg-[#0F0F11] xl:max-h-[calc(100vh-150px)]">
            <div className="border-b border-[#2A2A2D] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-md bg-[#1A1A1D] p-2 text-[#EDE9E4]/75">
                  <ListVideo className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h2 className="line-clamp-2 text-sm font-semibold">{playlistPlayback.playlist.title}</h2>
                  <p className="mt-1 text-xs text-[#EDE9E4]/45">
                    {safeCurrentIndex + 1} / {playlistPlayback.playlist.videos.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="max-h-[420px] overflow-y-auto xl:max-h-[calc(100vh-245px)]">
              {playlistPlayback.playlist.videos.map((playlistVideo, index) => {
                const isActive = playlistVideo.youtube_id === video.youtube_id

                return (
                  <button
                    key={playlistVideo.id}
                    type="button"
                    onClick={() => playPlaylistVideo(playlistPlayback.playlist, playlistVideo)}
                    className={`grid w-full grid-cols-[30px_88px_1fr] items-center gap-3 border-b border-[#2A2A2D] p-3 text-left last:border-b-0 ${
                      isActive ? "bg-[#1A1A1D]" : "hover:bg-[#151518]"
                    }`}
                  >
                    <span className="text-xs text-[#EDE9E4]/45">{isActive ? <Play className="h-3.5 w-3.5" /> : index + 1}</span>
                    <img src={playlistVideo.thumbnail || "/placeholder.svg"} alt="" className="aspect-video w-20 rounded object-cover" />
                    <span className="min-w-0">
                      <span className={`line-clamp-2 text-xs font-medium ${isActive ? "text-[#EDE9E4]" : ""}`}>
                        {playlistVideo.title}
                      </span>
                      <span className="mt-1 block truncate text-xs text-[#EDE9E4]/45">{playlistVideo.channel_title}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
