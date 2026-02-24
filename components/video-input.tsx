"use client"

import type React from "react"

import { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useVideo } from "./video-provider"
import { useToast } from "@/hooks/use-toast"

export function VideoInput() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { addVideo } = useVideo()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) return

    setIsLoading(true)

    try {
      await addVideo(url)
      setUrl("")
      toast({
        title: "Video added successfully",
        description: "Your video has been added to the Up Next list",
      })
    } catch (error) {
      toast({
        title: "Error adding video",
        description: error instanceof Error ? error.message : "Failed to add video",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="sticky top-0 z-10 bg-[#0B0B0C] py-2 sm:py-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Paste YouTube URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-[#121214] border-[#2A2A2D] h-10 pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#EDE9E4]/55" />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="bg-[#2A2A2D] hover:bg-[#38383D] text-[#EDE9E4] w-full sm:w-auto"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Video"}
        </Button>
      </form>
    </div>
  )
}
