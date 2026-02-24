"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth-provider"
import { getSupabaseClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
// Import directly from the youtube.ts file
import { fetchYouTubeVideoDetails } from "@/lib/youtube"

// Update the VideoStatus type to use underscores instead of hyphens
export type VideoStatus = "up_next" | "watched" | "not_interested"
export type PriorityLevel = "high" | "medium" | "low" | null

export interface Tag {
  id: string
  name: string
}

export interface Video {
  id: string
  youtube_id: string
  title: string
  thumbnail: string
  status: VideoStatus
  priority: PriorityLevel
  tags: string[]
  created_at: string
}

interface VideoContextType {
  videos: Video[]
  tags: Tag[]
  selectedVideo: Video | null
  setSelectedVideo: (video: Video | null) => void
  addVideo: (url: string) => Promise<void>
  updateVideoStatus: (id: string, status: VideoStatus) => Promise<void>
  updateVideoPriority: (id: string, priority: PriorityLevel) => Promise<void>
  addTag: (name: string) => Promise<void>
  updateTag: (id: string, name: string) => Promise<void>
  deleteTag: (id: string) => Promise<void>
  addTagToVideo: (videoId: string, tagId: string) => Promise<void>
  removeTagFromVideo: (videoId: string, tagId: string) => Promise<void>
  deleteVideo: (id: string) => Promise<void>
  getVideosByStatus: (status: VideoStatus) => Video[]
  getVideosByTag: (tagId: string) => Video[]
  getVideosByPriority: (priority: PriorityLevel) => Video[]
  isLoading: boolean
}

const VideoContext = createContext<VideoContextType | undefined>(undefined)

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [videos, setVideos] = useState<Video[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = getSupabaseClient()
  const { toast } = useToast()

  // Load data from Supabase when user changes
  useEffect(() => {
    if (!user) {
      setVideos([])
      setTags([])
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch videos
        const { data: videosData, error: videosError } = await supabase
          .from("videos")
          .select("*")
          .order("created_at", { ascending: false })

        if (videosError) {
          throw videosError
        }

        // Fetch tags
        const { data: tagsData, error: tagsError } = await supabase.from("tags").select("*").order("name")

        if (tagsError) {
          throw tagsError
        }

        // Fetch video-tag relationships
        const { data: videoTagsData, error: videoTagsError } = await supabase.from("video_tags").select("*")

        if (videoTagsError) {
          throw videoTagsError
        }

        // Process videos with their tags
        const processedVideos = videosData.map((video) => {
          const videoTags = videoTagsData.filter((vt) => vt.video_id === video.id).map((vt) => vt.tag_id)

          return {
            ...video,
            tags: videoTags,
          }
        })

        setVideos(processedVideos)
        setTags(tagsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error loading data",
          description: "Failed to load your videos and tags",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // Set up realtime subscriptions
    const videosSubscription = supabase
      .channel("videos-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "videos",
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          console.log("Videos change:", payload)
          if (payload.eventType === "INSERT") {
            // For new videos, we need to ensure they have an empty tags array
            const newVideo = { ...payload.new, tags: [] } as Video
            setVideos((prev) => {
              // Check if the video already exists to prevent duplication
              if (prev.some((v) => v.id === newVideo.id)) {
                return prev
              }
              return [newVideo, ...prev]
            })
          } else if (payload.eventType === "UPDATE") {
            setVideos((prev) =>
              prev.map((video) =>
                video.id === payload.new.id ? ({ ...payload.new, tags: video.tags } as Video) : video,
              ),
            )
          } else if (payload.eventType === "DELETE") {
            setVideos((prev) => prev.filter((video) => video.id !== payload.old.id))
            // If the deleted video is currently selected, clear the selection
            if (selectedVideo && selectedVideo.id === payload.old.id) {
              setSelectedVideo(null)
            }
          }
        },
      )
      .subscribe()

    const tagsSubscription = supabase
      .channel("tags-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tags",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Tags change:", payload)
          if (payload.eventType === "INSERT") {
            setTags((prev) => {
              // Check if the tag already exists to prevent duplication
              if (prev.some((t) => t.id === payload.new.id)) {
                return prev
              }
              return [...prev, payload.new as Tag].sort((a, b) => a.name.localeCompare(b.name))
            })
          } else if (payload.eventType === "UPDATE") {
            setTags((prev) =>
              prev
                .map((tag) => (tag.id === payload.new.id ? (payload.new as Tag) : tag))
                .sort((a, b) => a.name.localeCompare(b.name)),
            )
          } else if (payload.eventType === "DELETE") {
            setTags((prev) => prev.filter((tag) => tag.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    const videoTagsSubscription = supabase
      .channel("video-tags-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "video_tags",
        },
        async (payload) => {
          console.log("Video tags change:", payload)
          // When a tag is added/removed from a video
          if (payload.eventType === "INSERT") {
            const videoId = payload.new.video_id
            const tagId = payload.new.tag_id

            setVideos((prev) =>
              prev.map((video) => {
                if (video.id === videoId && !video.tags.includes(tagId)) {
                  return { ...video, tags: [...video.tags, tagId] }
                }
                return video
              }),
            )
          } else if (payload.eventType === "DELETE") {
            const videoId = payload.old.video_id
            const tagId = payload.old.tag_id

            setVideos((prev) =>
              prev.map((video) => {
                if (video.id === videoId) {
                  return { ...video, tags: video.tags.filter((id) => id !== tagId) }
                }
                return video
              }),
            )
          }
        },
      )
      .subscribe()

    return () => {
      videosSubscription.unsubscribe()
      tagsSubscription.unsubscribe()
      videoTagsSubscription.unsubscribe()
    }
  }, [user, supabase, toast, selectedVideo])

  // Extract YouTube video ID from URL
  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const fetchVideoDetails = async (videoId: string) => {
    try {
      return await fetchYouTubeVideoDetails(videoId)
    } catch (error) {
      console.error("Error fetching video details:", error)
      throw error
    }
  }

  // Add a new video
  const addVideo = async (url: string) => {
    if (!user) return

    const youtube_id = extractVideoId(url)

    if (!youtube_id) {
      throw new Error("Invalid YouTube URL")
    }

    // Check if video already exists
    const existingVideo = videos.find((v) => v.youtube_id === youtube_id)
    if (existingVideo) {
      throw new Error("Video already in your list")
    }

    try {
      // Fetch video details from YouTube API
      const videoDetails = await fetchVideoDetails(youtube_id)

      // Insert into Supabase
      const { data, error } = await supabase
        .from("videos")
        .insert({
          user_id: user.id,
          youtube_id,
          title: videoDetails.title,
          thumbnail: videoDetails.thumbnail,
          status: "up_next", // Use underscore instead of hyphen
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      // Let the real-time subscription handle adding this to the state
      // We won't do optimistic updates to avoid duplication
    } catch (error: any) {
      console.error("Error adding video:", error)
      toast({
        title: "Error adding video",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  // Delete a video
  const deleteVideo = async (id: string) => {
    try {
      // Optimistic update - remove from UI immediately
      setVideos((prev) => prev.filter((video) => video.id !== id))

      // If the deleted video is currently selected, clear the selection
      if (selectedVideo && selectedVideo.id === id) {
        setSelectedVideo(null)
      }

      // Delete from Supabase
      const { error } = await supabase.from("videos").delete().eq("id", id)

      if (error) {
        throw error
      }

      // The real-time subscription will also handle removing from the state
    } catch (error: any) {
      console.error("Error deleting video:", error)
      toast({
        title: "Error deleting video",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  // Update video status
  const updateVideoStatus = async (id: string, status: VideoStatus) => {
    try {
      // Optimistic update
      setVideos((prev) => prev.map((video) => (video.id === id ? { ...video, status } : video)))

      const { error } = await supabase.from("videos").update({ status }).eq("id", id)

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error("Error updating video status:", error)
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // Update video priority
  const updateVideoPriority = async (id: string, priority: PriorityLevel) => {
    try {
      // Optimistic update - only update priority, not status
      setVideos((prev) => prev.map((video) => (video.id === id ? { ...video, priority } : video)))

      // Only update the priority field, not the status
      const { error } = await supabase.from("videos").update({ priority }).eq("id", id)

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error("Error updating video priority:", error)
      toast({
        title: "Error updating priority",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // Add a new tag
  const addTag = async (name: string) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("tags")
        .insert({
          user_id: user.id,
          name,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      // Let the real-time subscription handle adding to the state
      // We won't do optimistic updates to avoid duplication
    } catch (error: any) {
      console.error("Error adding tag:", error)
      toast({
        title: "Error adding tag",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // Update an existing tag
  const updateTag = async (id: string, name: string) => {
    try {
      // Optimistic update
      setTags((prev) =>
        prev.map((tag) => (tag.id === id ? { ...tag, name } : tag)).sort((a, b) => a.name.localeCompare(b.name)),
      )

      const { error } = await supabase.from("tags").update({ name }).eq("id", id)

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error("Error updating tag:", error)
      toast({
        title: "Error updating tag",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // Delete a tag
  const deleteTag = async (id: string) => {
    try {
      // Optimistic update
      setTags((prev) => prev.filter((tag) => tag.id !== id))

      // Also update videos that have this tag
      setVideos((prev) =>
        prev.map((video) => {
          if (video.tags.includes(id)) {
            return { ...video, tags: video.tags.filter((tagId) => tagId !== id) }
          }
          return video
        }),
      )

      // Delete tag (video_tags will be deleted via cascade)
      const { error } = await supabase.from("tags").delete().eq("id", id)

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error("Error deleting tag:", error)
      toast({
        title: "Error deleting tag",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // Add a tag to a video
  const addTagToVideo = async (videoId: string, tagId: string) => {
    try {
      // Optimistic update
      setVideos((prev) =>
        prev.map((video) => {
          if (video.id === videoId && !video.tags.includes(tagId)) {
            return { ...video, tags: [...video.tags, tagId] }
          }
          return video
        }),
      )

      const { error } = await supabase.from("video_tags").insert({
        video_id: videoId,
        tag_id: tagId,
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error("Error adding tag to video:", error)
      toast({
        title: "Error adding tag to video",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // Remove a tag from a video
  const removeTagFromVideo = async (videoId: string, tagId: string) => {
    try {
      // Optimistic update
      setVideos((prev) =>
        prev.map((video) => {
          if (video.id === videoId) {
            return { ...video, tags: video.tags.filter((id) => id !== tagId) }
          }
          return video
        }),
      )

      const { error } = await supabase.from("video_tags").delete().match({
        video_id: videoId,
        tag_id: tagId,
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error("Error removing tag from video:", error)
      toast({
        title: "Error removing tag from video",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // Get videos by status
  const getVideosByStatus = (status: VideoStatus) => {
    return videos.filter((video) => video.status === status)
  }

  // Get videos by tag
  const getVideosByTag = (tagId: string) => {
    return videos.filter((video) => video.tags.includes(tagId))
  }

  // Get videos by priority
  const getVideosByPriority = (priority: PriorityLevel) => {
    return videos.filter((video) => video.priority === priority)
  }

  return (
    <VideoContext.Provider
      value={{
        videos,
        tags,
        selectedVideo,
        setSelectedVideo,
        addVideo,
        updateVideoStatus,
        updateVideoPriority,
        addTag,
        updateTag,
        deleteTag,
        addTagToVideo,
        removeTagFromVideo,
        deleteVideo,
        getVideosByStatus,
        getVideosByTag,
        getVideosByPriority,
        isLoading,
      }}
    >
      {children}
    </VideoContext.Provider>
  )
}

export function useVideo() {
  const context = useContext(VideoContext)
  if (context === undefined) {
    throw new Error("useVideo must be used within a VideoProvider")
  }
  return context
}
