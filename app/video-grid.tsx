"use client"

import { useVideo } from "@/components/video-provider"
import { useSearchParams } from "next/navigation"
import { VideoCard } from "@/components/video-card"
import type { VideoStatus, PriorityLevel } from "@/components/video-provider"
import { useMemo } from "react"

// Helper function to sort videos by priority
const sortByPriority = (videos: any[]) => {
  const priorityOrder = { high: 1, medium: 2, low: 3, null: 4 }

  return [...videos].sort((a, b) => {
    const aPriority = a.priority || null
    const bPriority = b.priority || null

    return (
      (priorityOrder[aPriority as keyof typeof priorityOrder] || 4) -
      (priorityOrder[bPriority as keyof typeof priorityOrder] || 4)
    )
  })
}

export default function VideoGrid() {
  const { videos, getVideosByStatus, getVideosByTag, getVideosByPriority, isLoading, tags } = useVideo()
  const search = useSearchParams()

  const status = search.get("filter") as VideoStatus | null
  const tagId = search.get("tag")
  const priority = search.get("priority") as PriorityLevel

  const { list, sectionTitle } = useMemo(() => {
    let currentList = videos
    let currentSectionTitle = "Home"

    // Home tab enhancement - show a mix of videos
    if (!status && !tagId && !priority) {
      currentSectionTitle = "Home"
      // Sort by priority on the home page
      currentList = sortByPriority(videos)
    } else if (status) {
      currentList = getVideosByStatus(status)
      currentSectionTitle = status === "up_next" ? "Up Next" : status === "watched" ? "Watched" : "Not Interested"

      // Only sort Up Next videos by priority
      if (status === "up_next") {
        currentList = sortByPriority(currentList)
      }
    } else if (tagId) {
      if (tagId === "all") {
        // Show all tagged videos
        const taggedVideoIds = new Set()
        tags.forEach((tag) => {
          const videosWithTag = getVideosByTag(tag.id)
          videosWithTag.forEach((video) => taggedVideoIds.add(video.id))
        })

        currentList = videos.filter((video) => taggedVideoIds.has(video.id))
        currentSectionTitle = "All Tagged Videos"
      } else {
        currentList = getVideosByTag(tagId)
        const tagName = tags.find((t) => t.id === tagId)?.name
        currentSectionTitle = tagName ? `Tagged: ${tagName}` : "Tagged Videos"
      }
    } else if (priority) {
      currentList = getVideosByPriority(priority)
      currentSectionTitle = `Priority: ${priority.charAt(0).toUpperCase() + priority.slice(1)}`
    }

    return { list: currentList, sectionTitle: currentSectionTitle }
  }, [videos, status, tagId, priority, getVideosByStatus, getVideosByTag, getVideosByPriority, tags])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!list.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No videos found in this section.</p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">{sectionTitle}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {list.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  )
}
