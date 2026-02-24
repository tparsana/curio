"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, Plus, Play, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useVideo } from "./video-provider"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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

export function YouTubeSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [nextPageToken, setNextPageToken] = useState("")
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)
  const { addVideo, setSelectedVideo } = useVideo()
  const { toast } = useToast()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Set up intersection observer for infinite scroll
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
    setNextPageToken("")
    setError(null)
    setUsingMockData(false)

    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(searchQuery)}`)

      if (!response.ok && response.status !== 200) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to search videos")
      }

      const data = await response.json()

      // Check if we're using mock data (no nextPageToken is a hint)
      if (!data.nextPageToken && data.items && data.items.length > 0) {
        setUsingMockData(true)
      }

      setResults(data.items || [])
      setNextPageToken(data.nextPageToken || "")
    } catch (error) {
      console.error("Error searching videos:", error)
      setError(error instanceof Error ? error.message : "Failed to search YouTube videos")
    } finally {
      setIsSearching(false)
    }
  }

  const loadMoreResults = async () => {
    if (!nextPageToken || isLoadingMore || usingMockData) return

    setIsLoadingMore(true)

    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}&pageToken=${nextPageToken}`)

      if (!response.ok && response.status !== 200) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to load more videos")
      }

      const data = await response.json()
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

  const handleWatchVideo = (result: SearchResult) => {
    // Create a temporary video object to watch without saving
    const tempVideo = {
      id: "temp-" + result.id.videoId,
      youtube_id: result.id.videoId,
      title: result.snippet.title,
      thumbnail: result.snippet.thumbnails.medium.url,
      status: "up_next" as const,
      priority: null,
      tags: [],
      created_at: new Date().toISOString(),
    }
    setSelectedVideo(tempVideo)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search YouTube videos..."
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
          <AlertDescription>YouTube API is currently unavailable. Showing demo results instead.</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-4 bg-red-900/20 border-red-800 text-[#EDE9E4]">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isSearching ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#EDE9E4]/70" />
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

          {/* Infinite scroll loading indicator */}
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
      ) : query.trim() && !isSearching ? (
        <div className="text-center py-12 text-[#EDE9E4]/65">
          <p>No videos found. Try a different search term.</p>
        </div>
      ) : null}
    </div>
  )
}
