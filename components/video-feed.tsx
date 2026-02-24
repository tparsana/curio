"use client"

import { useState, useEffect } from "react"
import { VideoInput } from "./video-input"
import { VideoPlayer } from "./video-player"
import { useVideo } from "./video-provider"
import { YouTubeSearch } from "./youtube-search"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"

// Import the VideoGrid with dynamic to avoid hydration mismatch
const VideoGrid = dynamic(() => import("@/app/video-grid"), { ssr: false })

export function VideoFeed() {
  const { selectedVideo } = useVideo()
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("library")

  // Handle hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6">
        <VideoInput />
      </div>

      {selectedVideo ? (
        <VideoPlayer video={selectedVideo} />
      ) : (
        <Tabs defaultValue="library" value={activeTab} onValueChange={setActiveTab} className="mt-4 sm:mt-6">
          <TabsList className="mb-4 w-full sm:w-auto">
            <TabsTrigger value="library" className="flex-1 sm:flex-initial">
              My Library
            </TabsTrigger>
            <TabsTrigger value="search" className="flex-1 sm:flex-initial">
              Search YouTube
            </TabsTrigger>
          </TabsList>
          <TabsContent value="library">
            {isMounted ? (
              <VideoGrid />
            ) : (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="search">
            <YouTubeSearch />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
