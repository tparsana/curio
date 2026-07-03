"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { AlertCircle, Check, ListVideo, Loader2, Play, Plus, Search } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useVideo } from "./video-provider"

interface SearchResult {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    channelTitle: string
    thumbnails: {
      medium: {
        url: string
      }
    }
  }
}

interface PlaylistResult {
  youtube_playlist_id: string
  title: string
  channel_title: string
  thumbnail: string
  video_count: number
  videos: Array<{
    youtube_id: string
    title: string
    channel_title: string
    thumbnail: string
    position: number
  }>
}

interface YouTubeSearchProps {
  externalQuery?: string
  externalQueryKey?: number
}

export function YouTubeSearch({ externalQuery, externalQueryKey }: YouTubeSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [playlistResult, setPlaylistResult] = useState<PlaylistResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [nextPageToken, setNextPageToken] = useState("")
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)
  const [savedPlaylistId, setSavedPlaylistId] = useState<string | null>(null)
  const { addVideo, addPlaylist, playlists, setSelectedVideo, playPlaylist } = useVideo()
  const { toast } = useToast()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!externalQuery) return

    setQuery(externalQuery)
    searchVideos(externalQuery)
  }, [externalQuery, externalQueryKey])

  useEffect(() => {
    if (!nextPageToken) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMoreResults()
        }
      },
      { threshold: 1.0 },
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [nextPageToken, isLoadingMore])

  const searchVideos = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setResults([])
    setPlaylistResult(null)
    setSavedPlaylistId(null)
    setNextPageToken("")
    setError(null)
    setUsingMockData(false)

    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || "Failed to search YouTube")
      }

      if (data.resultType === "playlist" && data.playlist) {
        setPlaylistResult(data.playlist)
        setSavedPlaylistId(
          playlists.find((playlist) => playlist.youtube_playlist_id === data.playlist.youtube_playlist_id)?.id || null,
        )
        return
      }

      if (!data.nextPageToken && data.items && data.items.length > 0) {
        setUsingMockData(true)
      }

      setResults(data.items || [])
      setNextPageToken(data.nextPageToken || "")
    } catch (error) {
      console.error("Error searching YouTube:", error)
      setError(error instanceof Error ? error.message : "Failed to search YouTube")
    } finally {
      setIsSearching(false)
    }
  }

  const loadMoreResults = async () => {
    if (!nextPageToken || isLoadingMore || usingMockData) return

    setIsLoadingMore(true)

    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}&pageToken=${nextPageToken}`)
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || "Failed to load more videos")
      }

      setResults((prev) => [...prev, ...(data.items || [])])
      setNextPageToken(data.nextPageToken || "")
    } catch (error) {
      console.error("Error loading more videos:", error)
      toast({
        title: "Failed to load more",
        description: "Could not load additional videos. Using available results.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchVideos(query)
  }

  const handleSaveVideo = async (result: SearchResult) => {
    try {
      const videoUrl = `https://www.youtube.com/watch?v=${result.id.videoId}`
      await addVideo(videoUrl)
      toast({
        title: "Video saved",
        description: "Video has been added to your Up Next list",
      })
    } catch (error) {
      console.error("Error saving video:", error)
      toast({
        title: "Failed to save",
        description: error instanceof Error ? error.message : "Could not save the video",
        variant: "destructive",
      })
    }
  }

  const handleSavePlaylist = async () => {
    if (!playlistResult) return

    try {
      await addPlaylist(playlistResult)
      setSavedPlaylistId(playlistResult.youtube_playlist_id)
      toast({
        title: "Playlist saved",
        description: "Playlist has been added to your Playlists tab",
      })
    } catch (error) {
      console.error("Error saving playlist:", error)
      toast({
        title: "Failed to save playlist",
        description: error instanceof Error ? error.message : "Could not save the playlist",
        variant: "destructive",
      })
    }
  }

  const watchVideo = (video: {
    youtube_id: string
    title: string
    thumbnail: string
    channel_title?: string
  }) => {
    setSelectedVideo({
      id: "temp-" + video.youtube_id,
      youtube_id: video.youtube_id,
      title: video.title,
      thumbnail: video.thumbnail,
      status: "up_next",
      priority: null,
      tags: [],
      created_at: new Date().toISOString(),
    })
  }

  const playPreviewPlaylist = () => {
    if (!playlistResult || !playlistResult.videos.length) return

    playPlaylist({
      id: `preview-${playlistResult.youtube_playlist_id}`,
      youtube_playlist_id: playlistResult.youtube_playlist_id,
      title: playlistResult.title,
      thumbnail: playlistResult.thumbnail,
      channel_title: playlistResult.channel_title,
      video_count: playlistResult.video_count,
      created_at: new Date().toISOString(),
      storage: "local",
      videos: playlistResult.videos.map((video) => ({
        id: `preview-${playlistResult.youtube_playlist_id}-${video.youtube_id}-${video.position}`,
        playlist_id: `preview-${playlistResult.youtube_playlist_id}`,
        youtube_id: video.youtube_id,
        title: video.title,
        thumbnail: video.thumbnail,
        channel_title: video.channel_title,
        position: video.position,
        created_at: new Date().toISOString(),
      })),
    })
  }

  const handleWatchVideo = (result: SearchResult) => {
    watchVideo({
      youtube_id: result.id.videoId,
      title: result.snippet.title,
      thumbnail: result.snippet.thumbnails.medium.url,
      channel_title: result.snippet.channelTitle,
    })
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search YouTube or paste a playlist URL..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-[#121214] border-[#2A2A2D] h-10 pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#EDE9E4]/55" />
        </div>
        <Button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="bg-[#2A2A2D] hover:bg-[#38383D] text-[#EDE9E4] w-full sm:w-auto"
        >
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </form>

      {usingMockData && (
        <Alert className="mb-4 bg-yellow-900/20 border-yellow-800">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle>Using demo data</AlertTitle>
          <AlertDescription>YouTube API is currently unavailable. Showing demo video results instead.</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-4 bg-red-900/20 border-red-800 text-[#EDE9E4]">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertTitle>Playlist unavailable</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isSearching ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#EDE9E4]/70" />
        </div>
      ) : playlistResult ? (
        <div className="space-y-5">
          <div className="overflow-hidden rounded-xl border border-[#2A2A2D] bg-[#121214]">
            <div className="grid gap-4 p-4 md:grid-cols-[260px_1fr]">
              <button
                type="button"
                className="group relative aspect-video overflow-hidden rounded-lg bg-black text-left"
                onClick={playPreviewPlaylist}
              >
                <img
                  src={playlistResult.thumbnail || "/placeholder.svg"}
                  alt={playlistResult.title}
                  className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-70"
                />
                <div className="absolute inset-y-0 right-0 flex w-20 items-center justify-center bg-black/65 text-sm">
                  <div className="text-center">
                    <ListVideo className="mx-auto mb-1 h-5 w-5" />
                    {playlistResult.video_count}
                  </div>
                </div>
              </button>

              <div className="flex flex-col justify-between gap-4">
                <div>
                  <div className="mb-2 text-xs uppercase tracking-[0.24em] text-[#EDE9E4]/50">Playlist</div>
                  <h2 className="text-2xl font-semibold leading-tight">{playlistResult.title}</h2>
                  <p className="mt-2 text-sm text-[#EDE9E4]/55">{playlistResult.channel_title}</p>
                  <p className="mt-3 text-sm text-[#EDE9E4]/65">
                    {playlistResult.videos.length} videos ready to browse.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleSavePlaylist}
                    disabled={Boolean(savedPlaylistId)}
                    className="bg-[#EDE9E4] text-[#0B0B0C] hover:bg-[#D8D3CB]"
                  >
                    {savedPlaylistId ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Save playlist
                      </>
                    )}
                  </Button>
                  {playlistResult.videos[0] && (
                    <Button
                      variant="outline"
                      className="border-[#2A2A2D] bg-transparent text-[#EDE9E4] hover:bg-[#1A1A1D]"
                      onClick={playPreviewPlaylist}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Play all
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#2A2A2D] bg-[#0F0F11]">
            {playlistResult.videos.map((video, index) => (
              <button
                key={`${video.youtube_id}-${video.position}`}
                type="button"
                onClick={() => watchVideo(video)}
                className="grid w-full grid-cols-[44px_96px_1fr] items-center gap-3 border-b border-[#2A2A2D] p-3 text-left transition-colors last:border-b-0 hover:bg-[#151518]"
              >
                <span className="text-sm text-[#EDE9E4]/45">{index + 1}</span>
                <img src={video.thumbnail || "/placeholder.svg"} alt="" className="aspect-video w-24 rounded object-cover" />
                <span>
                  <span className="line-clamp-2 text-sm font-medium">{video.title}</span>
                  <span className="mt-1 block text-xs text-[#EDE9E4]/45">{video.channel_title}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : results.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((result) => (
              <div key={result.id.videoId} className="bg-[#121214] border border-[#2A2A2D] rounded-xl overflow-hidden">
                <div className="aspect-video bg-cover bg-center relative">
                  <img
                    src={result.snippet.thumbnails.medium.url || "/placeholder.svg"}
                    alt={result.snippet.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-[#2A2A2D] hover:bg-[#38383D] text-[#EDE9E4] border-none"
                      onClick={() => handleSaveVideo(result)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                      onClick={() => handleWatchVideo(result)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Watch
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium line-clamp-2 text-sm">{result.snippet.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{result.snippet.channelTitle}</p>
                </div>
              </div>
            ))}
          </div>

          {nextPageToken && !usingMockData && (
            <div ref={loadMoreRef} className="flex justify-center py-6">
              {isLoadingMore ? (
                <Loader2 className="h-6 w-6 animate-spin text-[#EDE9E4]/70" />
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadMoreResults}
                  className="text-[#EDE9E4]/60 hover:text-[#EDE9E4]"
                >
                  Load more
                </Button>
              )}
            </div>
          )}
        </div>
      ) : query.trim() && !isSearching && !error ? (
        <div className="text-center py-12 text-[#EDE9E4]/65">
          <p>No videos or playlists found. Try a different search term.</p>
        </div>
      ) : null}
    </div>
  )
}
