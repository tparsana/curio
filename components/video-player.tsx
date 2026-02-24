"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useVideo, type Video } from "./video-provider"

interface VideoPlayerProps {
  video: Video
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const { setSelectedVideo } = useVideo()

  return (
    <div className="mt-6 max-w-5xl mx-auto">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" onClick={() => setSelectedVideo(null)} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to videos
        </Button>
      </div>

      <div className="rounded-xl overflow-hidden shadow-lg bg-[#121214] border border-[#2A2A2D]">
        {/* Enhanced video player container */}
        <div className="aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
