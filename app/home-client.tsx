"use client"

import { Sidebar } from "@/components/sidebar"
import { VideoProvider } from "@/components/video-provider"
import { VideoFeed } from "@/components/video-feed"

export default function HomeClient() {
  return (
    <VideoProvider>
      <div className="flex min-h-screen bg-black text-white">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <VideoFeed />
        </main>
      </div>
    </VideoProvider>
  )
}
