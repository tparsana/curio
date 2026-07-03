"use client"

import { useState } from "react"
import { ArrowLeft, ListVideo, Play, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { useVideo, type SavedPlaylist, type PlaylistVideo } from "./video-provider"

export function PlaylistGrid() {
  const { playlists, deletePlaylist, playPlaylist, playPlaylistVideo } = useVideo()
  const [openedPlaylistId, setOpenedPlaylistId] = useState<string | null>(null)
  const [playlistToDelete, setPlaylistToDelete] = useState<SavedPlaylist | null>(null)

  const openedPlaylist = playlists.find((playlist) => playlist.id === openedPlaylistId) || null

  const confirmDelete = async () => {
    if (!playlistToDelete) return
    await deletePlaylist(playlistToDelete.id)
    if (openedPlaylistId === playlistToDelete.id) {
      setOpenedPlaylistId(null)
    }
  }

  if (!playlists.length) {
    return (
      <div className="py-12 text-center text-[#EDE9E4]/65">
        <p>No playlists saved yet.</p>
        <p className="mt-1 text-sm">Paste a YouTube playlist URL into search to save one.</p>
      </div>
    )
  }

  if (openedPlaylist) {
    return (
      <div className="mt-8 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpenedPlaylistId(null)}
            className="text-[#EDE9E4]/80 hover:bg-[#151518] hover:text-[#EDE9E4]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to playlists
          </Button>
          <Button
            className="bg-[#2A2A2D] text-[#EDE9E4] hover:bg-[#38383D]"
            onClick={() => playPlaylist(openedPlaylist)}
            disabled={!openedPlaylist.videos.length}
          >
            <Play className="mr-2 h-4 w-4" />
            Play all
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#2A2A2D] bg-[#0F0F11]">
          <div className="grid gap-4 border-b border-[#2A2A2D] p-4 md:grid-cols-[240px_1fr]">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
              <img
                src={openedPlaylist.thumbnail || "/placeholder.svg"}
                alt={openedPlaylist.title}
                className="h-full w-full object-cover opacity-85"
              />
              <div className="absolute inset-y-0 right-0 flex w-16 items-center justify-center bg-black/70 text-sm">
                <div className="text-center">
                  <ListVideo className="mx-auto mb-1 h-4 w-4" />
                  {openedPlaylist.video_count}
                </div>
              </div>
            </div>
            <div className="flex min-w-0 flex-col justify-center">
              <p className="text-xs uppercase tracking-[0.24em] text-[#EDE9E4]/45">Playlist</p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight">{openedPlaylist.title}</h2>
              <p className="mt-2 text-sm text-[#EDE9E4]/50">
                {openedPlaylist.videos.length} videos by {openedPlaylist.channel_title || "YouTube"}
              </p>
            </div>
          </div>

          {openedPlaylist.videos.map((video, index) => (
            <PlaylistVideoRow
              key={video.id}
              video={video}
              index={index}
              onPlay={() => playPlaylistVideo(openedPlaylist, video)}
            />
          ))}
        </div>

        <ConfirmationModal
          isOpen={Boolean(playlistToDelete)}
          onClose={() => setPlaylistToDelete(null)}
          onConfirm={confirmDelete}
          title="Delete playlist"
          description={`Delete "${playlistToDelete?.title}" from your playlists? This will not remove videos from your main library.`}
        />
      </div>
    )
  }

  return (
    <div className="mt-8 space-y-6">
      <div>
        <h2 className="mb-2 text-xl font-bold">Playlists</h2>
        <p className="text-sm text-[#EDE9E4]/55">Saved separately from your main library.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onOpen={() => setOpenedPlaylistId(playlist.id)}
            onDelete={() => setPlaylistToDelete(playlist)}
            onPlayAll={() => playPlaylist(playlist)}
          />
        ))}
      </div>

      <ConfirmationModal
        isOpen={Boolean(playlistToDelete)}
        onClose={() => setPlaylistToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete playlist"
        description={`Delete "${playlistToDelete?.title}" from your playlists? This will not remove videos from your main library.`}
      />
    </div>
  )
}

interface PlaylistCardProps {
  playlist: SavedPlaylist
  onOpen: () => void
  onDelete: () => void
  onPlayAll: () => void
}

function PlaylistCard({ playlist, onOpen, onDelete, onPlayAll }: PlaylistCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#2A2A2D] bg-[#121214] transition-colors hover:border-[#EDE9E4]/25">
      <button type="button" className="group relative aspect-video w-full bg-black text-left" onClick={onOpen}>
        <img
          src={playlist.thumbnail || "/placeholder.svg"}
          alt={playlist.title}
          className="h-full w-full object-cover opacity-85 transition-opacity group-hover:opacity-65"
        />
        <div className="absolute inset-y-0 right-0 flex w-14 items-center justify-center bg-black/70 text-xs">
          <div className="text-center">
            <ListVideo className="mx-auto mb-1 h-4 w-4" />
            {playlist.video_count}
          </div>
        </div>
      </button>

      <div className="space-y-3 p-3">
        <button type="button" className="block w-full text-left" onClick={onOpen}>
          <h3 className="line-clamp-2 text-sm font-medium">{playlist.title}</h3>
          <p className="mt-1 truncate text-xs text-[#EDE9E4]/45">{playlist.channel_title}</p>
        </button>

        <div className="flex gap-2">
          <Button size="sm" className="h-8 flex-1 bg-[#2A2A2D] text-[#EDE9E4] hover:bg-[#38383D]" onClick={onPlayAll}>
            <Play className="mr-1 h-4 w-4" />
            Play all
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 border-[#2A2A2D] bg-transparent text-[#EDE9E4]/70 hover:bg-[#1A1A1D] hover:text-[#EDE9E4]"
            onClick={onDelete}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

interface PlaylistVideoRowProps {
  video: PlaylistVideo
  index: number
  onPlay: () => void
}

function PlaylistVideoRow({ video, index, onPlay }: PlaylistVideoRowProps) {
  return (
    <button
      type="button"
      onClick={onPlay}
      className="grid w-full grid-cols-[44px_96px_1fr] items-center gap-3 border-b border-[#2A2A2D] p-3 text-left transition-colors last:border-b-0 hover:bg-[#151518]"
    >
      <span className="text-sm text-[#EDE9E4]/45">{index + 1}</span>
      <img src={video.thumbnail || "/placeholder.svg"} alt="" className="aspect-video w-24 rounded object-cover" />
      <span>
        <span className="line-clamp-2 text-sm font-medium">{video.title}</span>
        <span className="mt-1 block text-xs text-[#EDE9E4]/45">{video.channel_title}</span>
      </span>
    </button>
  )
}
