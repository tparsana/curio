"use client"

import type React from "react"
import { useState } from "react"
import { Check, Eye, Flag, MoreVertical, Tag, Trash, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useVideo, type Video, type VideoStatus, type PriorityLevel } from "./video-provider"
import { ConfirmationModal } from "./confirmation-modal"

interface VideoCardProps {
  video: Video
}

export function VideoCard({ video }: VideoCardProps) {
  const {
    updateVideoStatus,
    updateVideoPriority,
    tags,
    addTagToVideo,
    removeTagFromVideo,
    setSelectedVideo,
    deleteVideo,
  } = useVideo()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const videoTags = tags.filter((tag) => video.tags.includes(tag.id))

  const handleStatusUpdate = (status: VideoStatus, e: React.MouseEvent) => {
    e.stopPropagation()
    updateVideoStatus(video.id, status)
  }

  const handlePriorityUpdate = (priority: PriorityLevel, e: React.MouseEvent) => {
    e.stopPropagation()
    updateVideoPriority(video.id, priority)
  }

  const toggleTag = async (tagId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      if (video.tags.includes(tagId)) {
        await removeTagFromVideo(video.id, tagId)
      } else {
        await addTagToVideo(video.id, tagId)
      }
    } catch (error) {
      console.error("Error toggling tag:", error)
    }
  }

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteVideo(video.id)
    } catch (error) {
      console.error("Error deleting video:", error)
    }
  }

  const getPriorityColor = (priority: PriorityLevel) => {
    switch (priority) {
      case "high":
        return "bg-amber-500"
      case "medium":
        return "bg-zinc-500"
      case "low":
        return "bg-emerald-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="bg-[#121214] border border-[#2A2A2D] rounded-xl overflow-hidden group">
      <div className="relative">
        {/* Thumbnail */}
        <div
          className="aspect-video bg-cover bg-center cursor-pointer"
          style={{ backgroundImage: `url(${video.thumbnail})` }}
          onClick={() => setSelectedVideo(video)}
        >
          {/* Overlay with status buttons */}
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-black/50 hover:bg-[#2A2A2D] hover:text-[#EDE9E4] transition-colors"
              onClick={(e) => handleStatusUpdate("up_next", e)}
            >
              <Eye className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-black/50 hover:bg-emerald-600 hover:text-white transition-colors"
              onClick={(e) => handleStatusUpdate("watched", e)}
            >
              <Check className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-black/50 hover:bg-red-600 hover:text-white transition-colors"
              onClick={(e) => handleStatusUpdate("not_interested", e)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Status and priority indicators */}
          <div className="absolute bottom-2 right-2 flex gap-1">
            {video.status === "up_next" && (
              <span className="bg-[#2A2A2D] text-[#EDE9E4] px-2 py-1 rounded text-xs">Up Next</span>
            )}
            {video.status === "watched" && (
              <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Watched</span>
            )}
            {video.status === "not_interested" && (
              <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">Not Interested</span>
            )}
            {video.priority && (
              <span className={`${getPriorityColor(video.priority)} text-white px-2 py-1 rounded text-xs`}>
                {video.priority.charAt(0).toUpperCase() + video.priority.slice(1)}
              </span>
            )}
          </div>

          {/* 3-dot menu */}
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-black/50 opacity-0 group-hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuLabel>Options</DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Priority submenu */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger onClick={(e) => e.stopPropagation()}>
                    <Flag className="h-4 w-4 mr-2" />
                    Set Priority
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={(e) => handlePriorityUpdate("high", e)}>
                      <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                      High
                      {video.priority === "high" && <Check className="h-4 w-4 ml-2" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handlePriorityUpdate("medium", e)}>
                      <span className="w-2 h-2 rounded-full bg-zinc-500 mr-2"></span>
                      Medium
                      {video.priority === "medium" && <Check className="h-4 w-4 ml-2" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handlePriorityUpdate("low", e)}>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                      Low
                      {video.priority === "low" && <Check className="h-4 w-4 ml-2" />}
                    </DropdownMenuItem>
                    {video.priority && (
                      <DropdownMenuItem onClick={(e) => handlePriorityUpdate(null, e)}>
                        <span className="w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
                        None
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* Remove option */}
                <DropdownMenuItem className="text-red-500" onClick={handleRemove}>
                  <Trash className="h-4 w-4 mr-2" />
                  Remove
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Tags section */}
                <DropdownMenuLabel className="text-xs text-gray-400 mt-1">Tags</DropdownMenuLabel>
                {tags.length === 0 ? (
                  <DropdownMenuItem disabled>No tags available</DropdownMenuItem>
                ) : (
                  tags.map((tag) => (
                    <DropdownMenuItem key={tag.id} onClick={(e) => toggleTag(tag.id, e)}>
                      <Tag className="h-4 w-4 mr-2" />
                      {tag.name}
                      {video.tags.includes(tag.id) && <Check className="h-4 w-4 ml-2" />}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Video info - Now showing title and tags */}
      <div className="p-3">
        {/* Title */}
        <h3 className="font-medium line-clamp-2 text-sm mb-1">{video.title}</h3>

        {/* Tags */}
        {videoTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {videoTags.map((tag) => (
              <span key={tag.id} className="text-xs bg-[#2A2A2D] text-[#EDE9E4]/75 px-2 py-0.5 rounded">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        description="Are you sure you want to delete this video?"
      />
    </div>
  )
}
